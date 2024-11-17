from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# Define the database URL for the SQLite database file
# SQLite database is stored locally as 'aac.db' in the project directory
URL_DATABASE = 'sqlite:///./aac.db'

# Create a SQLAlchemy engine to manage database connections
# Setting 'check_same_thread' to False allows multiple threads to access the SQLite database
engine = create_engine(URL_DATABASE, connect_args={"check_same_thread": False})

# Create a configured session class bound to the engine for creating database sessions
# autocommit=False: Requires manual commits for changes
# autoflush=False: Prevents automatic flushing of changes to the database before queries
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Define the base class for all ORM models, enabling table creation and ORM mappings
Base = declarative_base()