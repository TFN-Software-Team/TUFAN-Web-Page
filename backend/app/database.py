import os
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

<<<<<<< HEAD
# Sabit bir metin yerine her zaman ortam değişkenini okumalıdır!
SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")
=======
# docker-compose.yml içindeki veritabanı bilgilerimiz
SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://user:password@db:5432/mydatabase"
>>>>>>> Duru-frontend

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()
