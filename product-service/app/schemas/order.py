from pydantic import BaseModel
from typing import List
from datetime import datetime

class OrderItemBase(BaseModel):
    product_id: int
    quantity: int
    price: float

class OrderItem(OrderItemBase):
    id: int
    order_id: int

    class Config:
        from_attributes = True

class OrderBase(BaseModel):
    user_id: int
    total_amount: float
    status: str

class OrderCreate(OrderBase):
    items: List[OrderItemBase]

class Order(OrderBase):
    id: int
    created_at: datetime
    updated_at: datetime
    items: List[OrderItem]

    class Config:
        from_attributes = True 