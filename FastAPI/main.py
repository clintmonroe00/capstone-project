from fastapi import FastAPI, HTTPException, Depends
from typing import Annotated, Optional, List
from sqlalchemy.orm import Session
from pydantic import BaseModel
from database import SessionLocal, engine
import models
from fastapi.middleware.cors import CORSMiddleware
from datetime import date

# Commented out lines below allow db to be regenerated after deleting, useful when still modifying columns
from database import Base
from models import Animal

Base.metadata.create_all(bind=engine)

# Initialize FastAPI application
app = FastAPI()

# Configure CORS settings to allow specific origins for frontend access
origins = [
    'http://localhost:5173',
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allows all HTTP methods (e.g., GET, POST, PUT, DELETE)
    allow_headers=["*"], # Allows all headers
)

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
    rec_num: int # Unique record number for each animal
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

# Dependency function to provide a new database session per request
def get_db():
    db = SessionLocal()
    try:
        yield db # Provide the database session
    finally:
        db.close() # Close the session after the request is processed

# Annotated dependency for injecting the database session into route handlers
db_dependency = Annotated[Session, Depends(get_db)]

# Create database tables from SQLAlchemy models if they don't already exist
models.Base.metadata.create_all(bind=engine)


# Route to create a new animal record in the database
@app.post("/animals/", response_model=AnimalModel)
async def create_animal(animal: AnimalBase, db: db_dependency):
    db_animal = models.Animal(**animal.model_dump()) # Map request data to a database model
    db.add(db_animal)                                # Add new animal record to the session
    db.commit()                                      # Commit the session to save the record
    db.refresh(db_animal)                            # Refresh to get the latest data from the database
    return db_animal                                 # Return the newly created animal


# Route to fetch a single animal by ID
@app.get("/animals/{id}", response_model=AnimalModel)
async def get_animal(id: int, db: db_dependency):
    animal = db.query(models.Animal).filter(models.Animal.rec_num == id).first()
    if not animal:
        raise HTTPException(status_code=404, detail="Animal not found")
    return animal


# Route to read and return a list of animals, with optional pagination parameters
@app.get("/animals/", response_model=List[AnimalModel])
async def read_animals(db: db_dependency, skip: int = 0, limit: int = 100):
    animals = db.query(models.Animal).offset(skip).limit(limit).all() # Query animals with pagination
    return animals                                                    # Return the list of queried animals


# Route to update an existing animal by ID
@app.put("/animals/{id}", response_model=AnimalModel)
async def update_animal(id: int, animal: AnimalBase, db: db_dependency):
    db_animal = db.query(models.Animal).filter(models.Animal.rec_num == id).first()
    if not db_animal:
        raise HTTPException(status_code=404, detail="Animal not found")

    # Update the fields of the existing animal
    for key, value in animal.dict().items():
        setattr(db_animal, key, value)

    db.commit()  # Commit the changes to the database
    db.refresh(db_animal)  # Refresh the object to get updated data
    return db_animal