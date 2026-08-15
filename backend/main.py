from fastapi import FastAPI, Request
from database.database import Base, engine
Base.metadata.create_all(engine)

app = FastAPI()



