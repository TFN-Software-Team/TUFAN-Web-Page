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

app = FastAPI(title="TUFAN Web API", redirect_slashes=False)

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
    if not items:
        default_items = [
            {
                "title": "TEKNOFEST Hackathon 2025",
                "date": "Mayıs 2025",
                "imageUrl": "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=800&q=80",
                "description": "TUFAN Elektromobil ekibi olarak katıldığımız TEKNOFEST 2025 Hackathon etkinliğinde geliştirdiğimiz yerli batarya yönetim yazılımı ve telemetri altyapımızla birincilik ödülüne layık görüldük."
            },
            {
                "title": "Elektromobil Şasi Test Etkinliği",
                "date": "Nisan 2025",
                "imageUrl": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=800&q=80",
                "description": "Yeni nesil karbon fiber şasi testlerimizi başarıyla tamamladık. Aracımızın aerodinamik sürtünme katsayısı ve mukavemet testleri hedeflenen standartların üzerine çıktı."
            },
            {
                "title": "Kurumsal Sponsorluk Zirvesi",
                "date": "Mart 2025",
                "imageUrl": "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80",
                "description": "Sanayi ortaklarımız ve ana sponsorlarımızla bir araya gelerek TUFAN Elektromobil vizyonunu ve yeni araç konseptimizi tanıttığımız gala organizasyonumuz."
            },
            {
                "title": "Otonom Sürüş Çalıştayı",
                "date": "Şubat 2025",
                "imageUrl": "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
                "description": "Yapay zeka ve bilgisayarlı görü ekibimizin düzenlediği 3 günlük kampüs çalıştayında araç içi görüntü işleme ve şerit takip sistemleri canlı olarak test edildi."
            },
            {
                "title": "Yerli İnovasyon Sergisi",
                "date": "Ocak 2025",
                "imageUrl": "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
                "description": "Kendi geliştirdiğimiz yüksek verimlilikli motor sürücü kartlarımızı ve yerleşik şarj ünitelerimizi üniversitemiz inovasyon sergisinde öğrencilere ve akademisyenlere sunduk."
            }
        ]
        for item in default_items:
            m = models.Media(**item)
            db.add(m)
        db.commit()
        items = db.query(models.Media).all()
    return items

@app.post("/media", response_model=schemas.Media)
@app.post("/media/", response_model=schemas.Media)
def medya_olustur(medya: schemas.MediaCreate, db: Session = Depends(get_db)):
    yeni_medya = models.Media(**medya.dict())
    db.add(yeni_medya)
    db.commit()
    db.refresh(yeni_medya)
    return yeni_medya

@app.put("/media/{media_id}", response_model=schemas.Media)
@app.put("/media/{media_id}/", response_model=schemas.Media)
def medya_guncelle(media_id: int, medya: schemas.MediaCreate, db: Session = Depends(get_db)):
    db_medya = db.query(models.Media).filter(models.Media.id == media_id).first()
    if not db_medya:
        raise HTTPException(status_code=404, detail="Medya bulunamadı")
    for key, value in medya.dict().items():
        setattr(db_medya, key, value)
    db.commit()
    db.refresh(db_medya)
    return db_medya

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