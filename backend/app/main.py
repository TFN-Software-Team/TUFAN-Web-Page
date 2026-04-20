from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models, schemas
from .database import engine, SessionLocal

app = FastAPI(title="TUFAN Web API")

# Her istekte yeni bir veritabanı oturumu açıp kapatan yardımcı fonksiyon
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/")
def read_root():
    return {"message": "TUFAN Backend Servisi Başarıyla Ayakta!"}

@app.get("/asd")
def asd():
    return {"message": "asadfdsf"}

