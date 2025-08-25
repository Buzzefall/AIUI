from fastapi import FastAPI
from app.config import settings
from app.routers import projects, auth

app = FastAPI()

app.include_router(auth.router, tags=["auth"])
app.include_router(projects.router, prefix="/projects", tags=["projects"])

@app.get("/")
async def root():
    return {"message": "Hello World"}

@app.get("/config")
async def get_config():
    return {
        "mongo_details": settings.mongodb.DETAILS,
        "jwt_algorithm": settings.security.ALGORITHM
    }
