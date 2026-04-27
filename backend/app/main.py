from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from . import models, schemas
from .database import SessionLocal

app = FastAPI(title="TUFAN Web API")

from fastapi.middleware.cors import CORSMiddleware

# --- CORS AYARLARI BAŞLANGICI ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Tüm kaynaklara izin ver (ağdaki diğer cihazlar dahil)
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE tüm metotlara izin ver
    allow_headers=["*"],  # Tüm başlık (header) türlerine izin ver
)
# --- CORS AYARLARI BİTİŞİ ---

# 1. Veritabanı Oturumu (Session) Yönetimi
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 2. PROJE EKLEME (POST)
@app.post("/projeler/", response_model=schemas.Project)
def proje_olustur(proje: schemas.ProjectCreate, db: Session = Depends(get_db)):
    yeni_proje = models.Project(**proje.dict())
    db.add(yeni_proje)
    db.commit()
    db.refresh(yeni_proje)
    return yeni_proje

# 3. PROJELERİ LİSTELEME (GET)
@app.get("/projeler/", response_model=list[schemas.Project])
def projeleri_listele(db: Session = Depends(get_db)):
    projeler = db.query(models.Project).all()
    return projeler

# 4. PROJE GÜNCELLEME (PUT)
@app.put("/projeler/{proje_id}", response_model=schemas.Project)
def proje_guncelle(proje_id: int, proje: schemas.ProjectCreate, db: Session = Depends(get_db)):
    db_proje = db.query(models.Project).filter(models.Project.id == proje_id).first()
    if not db_proje:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")
    
    for key, value in proje.dict().items():
        setattr(db_proje, key, value)
    
    db.commit()
    db.refresh(db_proje)
    return db_proje

# 5. PROJE SİLME (DELETE)
@app.delete("/projeler/{proje_id}")
def proje_sil(proje_id: int, db: Session = Depends(get_db)):
    db_proje = db.query(models.Project).filter(models.Project.id == proje_id).first()
    if not db_proje:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")
    
    db.delete(db_proje)
    db.commit()
    return {"message": "Proje silindi"}

# 6. TÜM PROJELERİ SİLME (DELETE ALL)
@app.delete("/projeler/")
def projeleri_sil(db: Session = Depends(get_db)):
    db.query(models.Project).delete()
    db.commit()
    return {"message": "Tüm projeler silindi"}

# 7. BAŞVURU EKLEME (POST)
@app.post("/applications/", response_model=schemas.Application)
def create_application(application: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    db_application = models.Application(**application.dict())
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

# 8. BAŞVURULARI LİSTELEME (GET)
@app.get("/applications/", response_model=list[schemas.Application])
def list_applications(db: Session = Depends(get_db)):
    applications = db.query(models.Application).all()
    return applications

# 9. BAŞVURU SİLME (DELETE)
@app.delete("/applications/{application_id}")
def delete_application(application_id: int, db: Session = Depends(get_db)):
    db_application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not db_application:
        raise HTTPException(status_code=404, detail="Başvuru bulunamadı")
    
    db.delete(db_application)
    db.commit()
    return {"message": "Başvuru silindi"}

# 10. TÜM BAŞVURULARI SİLME (DELETE ALL)
# 10. TÜM BAŞVURULARI SİLME (DELETE ALL)
@app.delete("/applications/")
def delete_all_applications(db: Session = Depends(get_db)):
    db.query(models.Application).delete()
    db.commit()
    return {"message": "Tüm başvurular silindi"}