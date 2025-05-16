from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.schemas.cart import Cart, CartItemCreate
from app.repositories.cart_repository import CartRepository
from app.database import get_db
from app.auth.jwt import get_current_user

router = APIRouter()

@router.get("/cart/", response_model=Cart)
def get_cart(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = CartRepository(db)
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
    repo = CartRepository(db)
    repo.add_to_cart(current_user["user_id"], item)
    return repo.get_cart(current_user["user_id"])

@router.delete("/cart/items/{item_id}")
def remove_from_cart(
    item_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = CartRepository(db)
    if not repo.remove_from_cart(current_user["user_id"], item_id):
        raise HTTPException(status_code=404, detail="Cart item not found")
    return {"message": "Item removed from cart"}

@router.delete("/cart/")
def clear_cart(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = CartRepository(db)
    if not repo.clear_cart(current_user["user_id"]):
        raise HTTPException(status_code=404, detail="Cart not found")
    return {"message": "Cart cleared"} 