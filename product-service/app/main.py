from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routers import products, cart, orders
from app.database import engine, Base

# Veritabanı tablolarını oluştur
Base.metadata.create_all(bind=engine)

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
app.include_router(products.router, prefix="/api", tags=["products"])
app.include_router(cart.router, prefix="/api", tags=["cart"])
app.include_router(orders.router, prefix="/api", tags=["orders"])

@app.get("/", tags=["health"])
def health_check():
    return {
        "service": "Product Service",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.get("/")
def read_root():
    return {"message": "Welcome to Product Service"} 