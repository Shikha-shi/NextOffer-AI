from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import auth


app = FastAPI(
    title="NextOffer AI API",
    version="1.0.0"
)


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


app.include_router(auth.router)


@app.get("/")
def root():
    return {
        "message": "NextOffer AI API is running"
    }