from typing import Optional
from pydantic import BaseModel

# Temel proje özellikleri
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None

# Veri oluştururken kullanılacak şema (Şimdilik Base ile aynı)
class ProjectCreate(ProjectBase):
    pass

# Veritabanından okurken dönecek şema (ID içerir)
class Project(ProjectBase):
    id: int

    class Config:
        from_attributes = True

# Medya ögeleri şeması
class MediaBase(BaseModel):
    title: Optional[str] = None
    date: Optional[str] = None
    image_url: Optional[str] = None
    imageUrl: Optional[str] = None
    description: Optional[str] = None

class MediaCreate(MediaBase):
    pass

class Media(MediaBase):
    id: int

    class Config:
        from_attributes = True

# Başvuru formu özellikleri
class ApplicationBase(BaseModel):
    first_name: str
    last_name: str
    phone: str
    email: str
    faculty: str
    department: str
    student_class: str
    reason: str
    about_me: str
    admin_note: Optional[str] = None

class ApplicationCreate(ApplicationBase):
    pass

class ApplicationUpdate(BaseModel):
    admin_note: Optional[str] = None

class Application(ApplicationBase):
    id: int

    class Config:
        from_attributes = True
