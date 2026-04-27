from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# docker-compose.yml içindeki veritabanı bilgilerimiz
SQLALCHEMY_DATABASE_URL = "postgresql://user:password@db:5432/mydatabase"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()
