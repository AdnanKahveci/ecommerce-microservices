from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.product import Product, ProductCreate, ProductUpdate
from app.repositories.product_repository import ProductRepository
from app.database import get_db
from app.auth.jwt import get_current_user, check_permission

router = APIRouter()

@router.get("/products/", response_model=List[Product])
def get_products(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = ProductRepository(db)
    return repo.get_products(skip=skip, limit=limit)

@router.post("/products/", response_model=Product)
def create_product(
    product: ProductCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("create_product"))
):
    repo = ProductRepository(db)
    return repo.create_product(product)

@router.get("/products/{product_id}", response_model=Product)
def get_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = ProductRepository(db)
    product = repo.get_product(product_id)
    if product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.put("/products/{product_id}", response_model=Product)
def update_product(
    product_id: int,
    product: ProductUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("update_product"))
):
    repo = ProductRepository(db)
    updated_product = repo.update_product(product_id, product)
    if updated_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return updated_product

@router.delete("/products/{product_id}")
def delete_product(
    product_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("delete_product"))
):
    repo = ProductRepository(db)
    if not repo.delete_product(product_id):
        raise HTTPException(status_code=404, detail="Product not found")
    return {"message": "Product deleted"} 