from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from app.schemas.order import Order, OrderCreate
from app.repositories.order_repository import OrderRepository
from app.database import get_db
from app.auth.jwt import get_current_user, check_permission

router = APIRouter()

@router.post("/orders/", response_model=Order)
def create_order(
    order: OrderCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = OrderRepository(db)
    return repo.create_order(current_user["user_id"], order)

@router.get("/orders/", response_model=List[Order])
def get_user_orders(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = OrderRepository(db)
    return repo.get_user_orders(current_user["user_id"], skip=skip, limit=limit)

@router.get("/orders/{order_id}", response_model=Order)
def get_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user)
):
    repo = OrderRepository(db)
    order = repo.get_order(order_id)
    if order is None or order.user_id != current_user["user_id"]:
        raise HTTPException(status_code=404, detail="Order not found")
    return order

@router.put("/orders/{order_id}/status")
def update_order_status(
    order_id: int,
    status: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(check_permission("update_order_status"))
):
    repo = OrderRepository(db)
    order = repo.update_order_status(order_id, status)
    if order is None:
        raise HTTPException(status_code=404, detail="Order not found")
    return {"message": "Order status updated"} 