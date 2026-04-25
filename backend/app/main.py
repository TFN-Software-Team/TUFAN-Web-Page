from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from . import models, schemas
from .database import SessionLocal

app = FastAPI(title="TUFAN Web API")

from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="TUFAN Web API")

# --- CORS AYARLARI BAŞLANGICI ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"], # Sadece React'in çalıştığı bu adrese izin ver
    allow_credentials=True,
    allow_methods=["*"], # GET, POST, PUT, DELETE tüm metotlara izin ver
    allow_headers=["*"], # Tüm başlık (header) türlerine izin ver
)
# --- CORS AYARLARI BİTİŞİ ---

# ... dosyanın geri kalanı aynı şekilde kalacak (get_db, @app.post, @app.get vs.)c

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
    
    # Adım 1: Kullanıcıdan gelen JSON verisini (proje) alıp, SQLAlchemy Veritabanı Modeline çeviriyoruz.
    yeni_proje = models.Project(title=proje.title, description=proje.description)
    
    # Adım 2: Oluşturduğumuz bu yeni satırı veritabanı oturumuna ekliyoruz.
    db.add(yeni_proje)
    
    # Adım 3: İşlemi onaylayıp veritabanına kalıcı olarak kaydediyoruz (Commit).
    db.commit()
    
    # Adım 4: Veritabanının otomatik oluşturduğu ID numarasını (örn: id=1) yakalamak için veriyi yeniliyoruz.
    db.refresh(yeni_proje)
    
    # Adım 5: Kaydedilen veriyi kullanıcıya geri döndürüyoruz.
    return yeni_proje

# 3. PROJELERİ LİSTELEME (GET)
@app.get("/projeler/", response_model=list[schemas.Project])
def projeleri_listele(db: Session = Depends(get_db)):
    
    # Adım 1: Veritabanına gidip 'Project' tablosundaki tüm satırları sorguluyoruz (.all()).
    projeler = db.query(models.Project).all()
    
    # Adım 2: Bulunan listeyi kullanıcıya gönderiyoruz.
    return projeler