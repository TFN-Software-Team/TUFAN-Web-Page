from pydantic import BaseModel

# Temel proje özellikleri
class ProjectBase(BaseModel):
    title: str
    description: str | None = None

# Veri oluştururken kullanılacak şema (Şimdilik Base ile aynı)
class ProjectCreate(ProjectBase):
    pass

# Veritabanından okurken dönecek şema (ID içerir)
class Project(ProjectBase):
    id: int

    class Config:
        from_attributes = True # ORM nesnelerini JSON'a çevirebilmek için gerekli
