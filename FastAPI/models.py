from database import Base
from sqlalchemy import Column, Integer, String, Date, Float
from sqlalchemy.orm import declarative_base
from sqlalchemy.ext.hybrid import hybrid_property
from sqlalchemy.sql import case, func

# Define a base class for all ORM models using SQLAlchemy's declarative system
# Base = declarative_base()

# Define the Animal class, representing the 'animals' table in the database
class Animal(Base):
    __tablename__ = 'animals' # Set the table name in the database

    # Define columns for the 'animals' table
    rec_num = Column(Integer, primary_key=True, index=True) # Primary key column with indexing for faster lookups
    animal_id = Column(String)                              # Internal ID of animal
    animal_type = Column(String)                            # Type of animal (e.g., dog, cat)
    breed = Column(String)                                  # Breed of the animal
    color = Column(String)                                  # Color of the animal
    date_of_birth = Column(Date)                            # Animal's date of birth
    date_of_outcome = Column(Date)                          # Date of event
    name = Column(String, nullable=True)                    # Name of the animal
    outcome_subtype = Column(String, nullable=True)         # Additional details about the outcome
    outcome_type = Column(String, nullable=True)            # Type of outcome (e.g., adoption, euthanasia)
    sex_upon_outcome = Column(String)                       # Sex of the animal at the outcome
    location_lat = Column(Float)                            # Coordinate (Latitude)
    location_long = Column(Float)                           # Coordinate (Longitude)

    # Define a hybrid property to calculate the age in a readable string format
    @hybrid_property
    def age_upon_outcome(self):
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
    
    # Define a hybrid property to calculate the age in weeks based on the date of birth
    @hybrid_property
    def age_upon_outcome_in_weeks(self):
        # Calculate age in weeks if the date of birth is available
        if self.date_of_birth and self.date_of_outcome:
            delta = self.date_of_outcome - self.date_of_birth # Get the difference in days
            return delta.days // 7             # Convert days to weeks
        return 0                            # Return None if the date of birth is not provided
    
    @age_upon_outcome_in_weeks.expression
    def age_upon_outcome_in_weeks(cls):
        # SQLAlchemy implementation
        return case(
        (
            cls.date_of_birth.isnot(None) & cls.date_of_outcome.isnot(None),
            func.floor(
                (func.julianday(cls.date_of_outcome) - func.julianday(cls.date_of_birth)) / 7
            ),
        ),
        else_=0,
        )