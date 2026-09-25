from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import text
from . import models, schemas
from .database import SessionLocal, engine

# Veritabanı tablolarını otomatik oluştur
models.Base.metadata.create_all(bind=engine)

# Mevcut tabloya 'admin_note' sütununu otomatik ekleme (Migration yerine basit çözüm)
with engine.connect() as conn:
    try:
        conn.execute(text("ALTER TABLE applications ADD COLUMN admin_note VARCHAR;"))
        conn.commit()
    except Exception:
        pass

app = FastAPI(title="TUFAN Web API")

from fastapi.middleware.cors import CORSMiddleware

# --- CORS AYARLARI BAŞLANGICI ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)
# --- CORS AYARLARI BİTİŞİ ---

# Health check endpoint — Cron job ve uptime monitor için
@app.get("/health")
@app.get("/health/")
def health_check():
    return {"status": "ok"}

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# 2. PROJE EKLEME (POST) - Çift rota desteği (slash'li ve slash'siz)
@app.post("/projeler", response_model=schemas.Project)
@app.post("/projeler/", response_model=schemas.Project)
def proje_olustur(proje: schemas.ProjectCreate, db: Session = Depends(get_db)):
    yeni_proje = models.Project(**proje.dict())
    db.add(yeni_proje)
    db.commit()
    db.refresh(yeni_proje)
    return yeni_proje

# 3. PROJELERİ LİSTELEME (GET)
@app.get("/projeler", response_model=list[schemas.Project])
@app.get("/projeler/", response_model=list[schemas.Project])
def projeleri_listele(db: Session = Depends(get_db)):
    projeler = db.query(models.Project).all()
    return projeler

# 4. PROJE GÜNCELLEME (PUT)
@app.put("/projeler/{proje_id}", response_model=schemas.Project)
@app.put("/projeler/{proje_id}/", response_model=schemas.Project)
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
@app.delete("/projeler/{proje_id}/")
def proje_sil(proje_id: int, db: Session = Depends(get_db)):
    db_proje = db.query(models.Project).filter(models.Project.id == proje_id).first()
    if not db_proje:
        raise HTTPException(status_code=404, detail="Proje bulunamadı")
    
    db.delete(db_proje)
    db.commit()
    return {"message": "Proje silindi"}

# 6. TÜM PROJELERİ SİLME (DELETE ALL)
@app.delete("/projeler")
@app.delete("/projeler/")
def projeleri_sil(db: Session = Depends(get_db)):
    db.query(models.Project).delete()
    db.commit()
    return {"message": "Tüm projeler silindi"}

# --- MEDYA / ETKİNLİK ENDPOINT'LERİ ---
@app.get("/media", response_model=list[schemas.Media])
@app.get("/media/", response_model=list[schemas.Media])
def medyala_listele(db: Session = Depends(get_db)):
    items = db.query(models.Media).all()
    result = []
    for item in items:
        result.append({
            "id": item.id,
            "title": item.title,
            "date": item.date,
            "image_url": item.image_url,
            "imageUrl": item.image_url,
            "description": item.description
        })
    return result

@app.post("/media", response_model=schemas.Media)
@app.post("/media/", response_model=schemas.Media)
def medya_olustur(medya: schemas.MediaCreate, db: Session = Depends(get_db)):
    m_dict = medya.dict()
    img = m_dict.get("imageUrl") or m_dict.get("image_url") or ""
    yeni_medya = models.Media(
        title=m_dict.get("title"),
        date=m_dict.get("date"),
        image_url=img,
        description=m_dict.get("description")
    )
    db.add(yeni_medya)
    db.commit()
    db.refresh(yeni_medya)
    return {
        "id": yeni_medya.id,
        "title": yeni_medya.title,
        "date": yeni_medya.date,
        "image_url": yeni_medya.image_url,
        "imageUrl": yeni_medya.image_url,
        "description": yeni_medya.description
    }

@app.put("/media/{media_id}", response_model=schemas.Media)
@app.put("/media/{media_id}/", response_model=schemas.Media)
def medya_guncelle(media_id: int, medya: schemas.MediaCreate, db: Session = Depends(get_db)):
    db_medya = db.query(models.Media).filter(models.Media.id == media_id).first()
    if not db_medya:
        raise HTTPException(status_code=404, detail="Medya bulunamadı")
    m_dict = medya.dict()
    if "title" in m_dict and m_dict["title"] is not None: db_medya.title = m_dict["title"]
    if "date" in m_dict and m_dict["date"] is not None: db_medya.date = m_dict["date"]
    if "description" in m_dict and m_dict["description"] is not None: db_medya.description = m_dict["description"]
    img = m_dict.get("imageUrl") or m_dict.get("image_url")
    if img is not None: db_medya.image_url = img
    
    db.commit()
    db.refresh(db_medya)
    return {
        "id": db_medya.id,
        "title": db_medya.title,
        "date": db_medya.date,
        "image_url": db_medya.image_url,
        "imageUrl": db_medya.image_url,
        "description": db_medya.description
    }

@app.delete("/media/{media_id}")
@app.delete("/media/{media_id}/")
def medya_sil(media_id: int, db: Session = Depends(get_db)):
    db_medya = db.query(models.Media).filter(models.Media.id == media_id).first()
    if not db_medya:
        raise HTTPException(status_code=404, detail="Medya bulunamadı")
    db.delete(db_medya)
    db.commit()
    return {"message": "Medya silindi"}

@app.delete("/media", response_model=dict)
@app.delete("/media/", response_model=dict)
def tum_medyalari_sil(db: Session = Depends(get_db)):
    db.query(models.Media).delete()
    db.commit()
    return {"message": "Tüm medyalar silindi"}

# 7. BAŞVURU EKLEME (POST)
@app.post("/applications", response_model=schemas.Application)
@app.post("/applications/", response_model=schemas.Application)
def create_application(application: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    db_application = models.Application(**application.dict())
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

# 8. BAŞVURULARI LİSTELEME (GET)
@app.get("/applications", response_model=list[schemas.Application])
@app.get("/applications/", response_model=list[schemas.Application])
def list_applications(db: Session = Depends(get_db)):
    applications = db.query(models.Application).all()
    return applications

# 8.5. BAŞVURU GÜNCELLEME (PUT - Admin Notu İçin)
@app.put("/applications/{application_id}", response_model=schemas.Application)
@app.put("/applications/{application_id}/", response_model=schemas.Application)
def update_application(application_id: int, application_update: schemas.ApplicationUpdate, db: Session = Depends(get_db)):
    db_application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not db_application:
        raise HTTPException(status_code=404, detail="Başvuru bulunamadı")
    
    db_application.admin_note = application_update.admin_note
    db.commit()
    db.refresh(db_application)
    return db_application

# 9. BAŞVURU SİLME (DELETE)
@app.delete("/applications/{application_id}")
@app.delete("/applications/{application_id}/")
def delete_application(application_id: int, db: Session = Depends(get_db)):
    db_application = db.query(models.Application).filter(models.Application.id == application_id).first()
    if not db_application:
        raise HTTPException(status_code=404, detail="Başvuru bulunamadı")
    
    db.delete(db_application)
    db.commit()
    return {"message": "Başvuru silindi"}

# 10. TÜM BAŞVURULARI SİLME (DELETE ALL)
@app.delete("/applications", response_model=dict)
@app.delete("/applications/", response_model=dict)
def delete_all_applications(db: Session = Depends(get_db)):
    db.query(models.Application).delete()
    db.commit()
    return {"message": "Tüm başvurular silindi"}