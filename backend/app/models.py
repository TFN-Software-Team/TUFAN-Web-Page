from sqlalchemy import Column, Integer, String
from .database import Base

class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    phone = Column(String)
    email = Column(String)
    faculty = Column(String)
    department = Column(String)
    student_class = Column(String)
    reason = Column(String)
    about_me = Column(String)
    admin_note = Column(String, nullable=True)
