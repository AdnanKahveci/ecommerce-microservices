from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from app.routers import auth, user, address, contact
from app.config import get_db, engine
from app.models.user import Base

app = FastAPI(title="User Service API", version="1.0.0")

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)

# Router'ları ekle
app.include_router(auth.router)
app.include_router(user.router)
app.include_router(address.router)
app.include_router(contact.router)

@app.get("/", tags=["Root"])
async def root():
    return {"message": "User Service API"}