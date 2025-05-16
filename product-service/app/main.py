from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.v1.endpoints import products
from app.database import engine
from app.models import product

# Veritabanı tablolarını oluştur
product.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Product Service",
    description="Product management service for e-commerce application",
    version="1.0.0"
)

# CORS ayarları
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# API rotalarını ekle
app.include_router(
    products.router,
    prefix="api/routers",
    tags=["products"]
)

@app.get("/", tags=["health"])
def health_check():
    return {
        "service": "Product Service",
        "status": "healthy",
        "version": "1.0.0"
    } 