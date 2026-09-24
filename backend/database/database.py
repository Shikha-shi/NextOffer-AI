from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker,declarative_base
from app.settings import settings

Base=declarative_base()

engine=create_engine(url=settings.DB_CONNECTION)

SessionLocal=sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False
    )

def get_db():
    db=SessionLocal()
    try:
        yield db
    finally:
        db.close()
