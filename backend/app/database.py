import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase

# Render'daki Secret Files'ı oku (production)
load_dotenv("/etc/secrets/.env")
# Lokal .env'i oku (development / Docker)
load_dotenv()

SQLALCHEMY_DATABASE_URL = os.getenv("DATABASE_URL")

if not SQLALCHEMY_DATABASE_URL:
    SQLALCHEMY_DATABASE_URL = "sqlite:///./tufan.db"

# postgres:// veya postgresql:// → postgresql+psycopg2:// dönüşümü (SQLAlchemy v2 + psycopg2-binary uyumluluğu)
if SQLALCHEMY_DATABASE_URL.startswith("postgresql://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgresql://", "postgresql+psycopg2://", 1)
elif SQLALCHEMY_DATABASE_URL.startswith("postgres://"):
    SQLALCHEMY_DATABASE_URL = SQLALCHEMY_DATABASE_URL.replace("postgres://", "postgresql+psycopg2://", 1)

# psycopg2 uyumsuzluğu yaratan 'channel_binding' parametresini temizle
if "channel_binding=" in SQLALCHEMY_DATABASE_URL:
    import re
    SQLALCHEMY_DATABASE_URL = re.sub(r'[&?]channel_binding=[^&]+', '', SQLALCHEMY_DATABASE_URL)

connect_args = {"check_same_thread": False} if SQLALCHEMY_DATABASE_URL.startswith("sqlite") else {}

engine = create_engine(SQLALCHEMY_DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

class Base(DeclarativeBase):
    pass
