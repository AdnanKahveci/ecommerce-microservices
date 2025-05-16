from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.schemas.product import (
    Product, ProductCreate, ProductUpdate, Category, CategoryCreate,
    Cart, CartItemCreate, Order, OrderCreate
)
from app.repositories.product_repository import ProductRepository
from app.database import get_db
from app.auth.jwt import get_current_user, check_permission

router = APIRouter()

# Ürün endpoint'leri
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

# Sepet endpoint'leri
@router.get("/cart/", response_model=Cart)
def get_cart(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = ProductRepository(db)
    cart = repo.get_cart(current_user["user_id"])
    if cart is None:
        raise HTTPException(status_code=404, detail="Cart not found")
    return cart

@router.post("/cart/items/", response_model=Cart)
def add_to_cart(
    item: CartItemCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = ProductRepository(db)
    repo.add_to_cart(current_user["user_id"], item)
    return repo.get_cart(current_user["user_id"])

@router.delete("/cart/items/{item_id}")
def remove_from_cart(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = ProductRepository(db)
    if not repo.remove_from_cart(current_user["user_id"], item_id):
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Item removed from cart"}

@router.delete("/cart/")
def clear_cart(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = ProductRepository(db)
    if not repo.clear_cart(current_user["user_id"]):
        raise HTTPException(status_code=404, detail="Cart not found")
    return {"message": "Cart cleared"}

# Sipariş endpoint'leri
@router.post("/orders/", response_model=Order)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = ProductRepository(db)
    return repo.create_order(current_user["user_id"], order)

@router.get("/orders/", response_model=List[Order])
def get_user_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = ProductRepository(db)
    return repo.get_user_orders(current_user["user_id"], skip=skip, limit=limit)

@router.get("/orders/{order_id}", response_model=Order)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = ProductRepository(db)
    order = repo.get_order(order_id)
    if order is None or order.user_id != current_user["user_id"]:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

# Admin endpoint'leri
@router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("update_order_status"))
):
    repo = ProductRepository(db)
    order = repo.update_order_status(order_id, status)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order status updated"} 