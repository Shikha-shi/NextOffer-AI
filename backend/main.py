from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.database import Base, engine
from models.users import User
from models.resume import Resume
from models.student_profile import StudentProfile
from app.routers import (
    auth,
    student_profile,
    resume,
    jobs,
    career_roadmap,
    learning_resources,
    personalized_learning,
    ai_assistant,
)



app = FastAPI(
    title="NextOffer AI API",
    version="1.0.0"
)


# Create database tables
Base.metadata.create_all(bind=engine)


# CORS configuration for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# API routers
app.include_router(auth.router)
app.include_router(student_profile.router)
app.include_router(resume.router)
app.include_router(jobs.router)
app.include_router(career_roadmap.router)
app.include_router(learning_resources.router)
app.include_router(personalized_learning.router)
app.include_router(ai_assistant.router)


@app.get("/")
def root():
    return {
        "message": "NextOffer AI API is running"
    }