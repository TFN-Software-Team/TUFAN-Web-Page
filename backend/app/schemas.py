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

class ApplicationCreate(ApplicationBase):
    pass

class Application(ApplicationBase):
    id: int

    class Config:
        from_attributes = True
