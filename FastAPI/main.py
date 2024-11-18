from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from typing import Annotated, Optional, List
from sqlalchemy.orm import Session, Query
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
from datetime import date
import logging
from io import StringIO  
import pandas as pd  
import os 
from datetime import datetime

# Uncomment the following lines to regenerate database tables during development
# from database import Base
# from models import Animal

# Base.metadata.create_all(bind=engine)

# Initialize FastAPI application
app = FastAPI()

# Configure CORS settings to allow specific origins for frontend access
origins = [
    'http://localhost:5173',
    'http://127.0.0.1:5173'
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all HTTP methods (e.g., GET, POST, PUT, DELETE)
    allow_headers=["*"], # Allows all headers
)

# Directory to save uploaded CSV files
UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

# Base model representing the basic attributes of an animal
class AnimalBase(BaseModel):
    animal_id: str
    animal_type: str
    breed: str
    color: str
    date_of_birth: date
    date_of_outcome: date
    name: Optional[str]
    outcome_subtype: Optional[str]
    outcome_type: Optional[str]
    sex_upon_outcome: str
    location_lat: float
    location_long: float

# Animal model class with additional database-specific fields and calculated properties
class AnimalModel(AnimalBase):
    rec_num: int 
    age_upon_outcome: Optional[str] = None
    age_upon_outcome_in_weeks: Optional[int] = None

    class Config:
        from_attributes = True # Enable ORM mode for attribute mapping

    @property
    def age_upon_outcome(self):
        # Calculate the age in a readable string format
        if self.date_of_birth and self.date_of_outcome:
            delta = self.date_of_outcome - self.date_of_birth
            years = delta.days // 365
            months = (delta.days % 365) // 30

            if years >= 1:
                return f"{years} year{'s' if years > 1 else ''}"
            elif months >= 1:
                return f"{months} month{'s' if months > 1 else ''}"
            else:
                return "0 years"
        return None

    @property
    def age_upon_outcome_in_weeks(self):
        # Calculate the age upon outcome in weeks if date_of_birth is available
        if self.date_of_birth:
            return (self.date_of_outcome - self.date_of_birth).days // 7
        return None # Return None if date_of_birth is unavailable

# # Dependency to provide a database session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db 
    finally:
        db.close() 

# Annotated dependency for injecting the database session into route handlers
db_dependency = Annotated[Session, Depends(get_db)]

# Create database tables from SQLAlchemy models if they don't already exist
models.Base.metadata.create_all(bind=engine)


# Route to create a new animal record in the database
@app.post("/animals/", response_model=AnimalModel)
async def create_animal(animal: AnimalBase, db: db_dependency):
    db_animal = models.Animal(**animal.model_dump()) 
    db.add(db_animal)
    db.commit()
    db.refresh(db_animal)
    return db_animal


# Route to fetch a single animal by ID
@app.get("/animals/{id}", response_model=AnimalModel)
async def get_animal(id: int, db: db_dependency):
    animal = db.query(models.Animal).filter(models.Animal.rec_num == id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
    return animal


# Route to read and return a list of animals, with optional pagination parameters
# Updated query parameters to handle filters
@app.get("/animals/", response_model=List[AnimalModel])
async def read_animals(
    db: db_dependency,
    skip: int = 0,
    limit: int = 100,
    animal_type: Optional[str] = None,
    breed: Optional[List[str]] = None,
    sex_upon_outcome: Optional[str] = None,
    min_age: Optional[int] = None,
    max_age: Optional[int] = None,
):
    logging.info("Filters received: animal_type=%s, breed=%s, ...", animal_type, breed)
    query = db.query(models.Animal)

    if animal_type:
        query = query.filter(models.Animal.animal_type == animal_type)
    if breed:
        query = query.filter(models.Animal.breed.in_(breed))
    if sex_upon_outcome:
        query = query.filter(models.Animal.sex_upon_outcome == sex_upon_outcome)
    if min_age is not None:
        query = query.filter(models.Animal.age_upon_outcome_in_weeks >= min_age)
    if max_age is not None:
        query = query.filter(models.Animal.age_upon_outcome_in_weeks <= max_age)

    return query.offset(skip).limit(limit).all()


# Route to update an existing animal by ID
@app.put("/animals/{id}", response_model=AnimalModel)
async def update_animal(id: int, animal: AnimalBase, db: db_dependency):
    db_animal = db.query(models.Animal).filter(models.Animal.rec_num == id).first()
    if not db_animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    # Update the fields of the existing animal
    for key, value in animal.model_dump().items():
        setattr(db_animal, key, value)

    db.commit()  # Commit the changes to the database
    db.refresh(db_animal)  # Refresh the object to get updated data
    return db_animal

# Route to delete an existing animal by ID
@app.delete("/animals/{id}", status_code=200)
async def delete_animal(id: int, db: db_dependency):
    db_animal = db.query(models.Animal).filter(models.Animal.rec_num == id).first()
    if not db_animal:
        raise HTTPException(status_code=404, detail="Animal not found")
    db.delete(db_animal)
    db.commit()
    return {"message": "Animal deleted successfully"}

@app.post("/upload-csv/")
async def upload_csv(db: db_dependency, file: UploadFile = File(...)):
    # Ensure the uploaded file is a CSV
    if file.content_type != "text/csv":
        raise HTTPException(status_code=400, detail="Invalid file type. Please upload a CSV file.")

    try:
        # Read the uploaded CSV file content
        content = await file.read()
        data = pd.read_csv(StringIO(content.decode('utf-8')))
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Error reading CSV: {e}")

    # Define required columns
    required_columns = [
        'animal_id', 'animal_type', 'breed', 'color', 'date_of_birth',
        'date_of_outcome', 'sex_upon_outcome', 'location_lat', 'location_long'
    ]

    # Validate required columns in the CSV
    if not all(column in data.columns for column in required_columns):
        raise HTTPException(
            status_code=400,
            detail=f"Missing required columns. Required: {', '.join(required_columns)}"
        )

    try:
        # Process each row and insert into the database
        for _, row in data.iterrows():
            # Convert string dates to Python `date` objects
            date_of_birth = datetime.strptime(row['date_of_birth'], '%Y-%m-%d').date()
            date_of_outcome = datetime.strptime(row['date_of_outcome'], '%Y-%m-%d').date()

            animal = Animal(
                animal_id=row['animal_id'],
                animal_type=row['animal_type'],
                breed=row['breed'],
                color=row['color'],
                date_of_birth=date_of_birth,
                date_of_outcome=date_of_outcome,
                name=row.get('name'),
                outcome_subtype=row.get('outcome_subtype'),
                outcome_type=row.get('outcome_type'),
                sex_upon_outcome=row['sex_upon_outcome'],
                location_lat=row['location_lat'],
                location_long=row['location_long']
            )
            db.add(animal)
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Error inserting data: {e}")

    # Save the uploaded file in the uploads directory for reference
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as f:
        f.write(content)

    return {"message": "CSV uploaded and data imported successfully!", "file_path": file_path}