from pydantic import BaseModel, Field
from typing import List
from datetime import datetime
from app.schemas.product import Product

class CartItemBase(BaseModel):
    product_id: int
    quantity: int = Field(gt=0)

class CartItemCreate(CartItemBase):
    pass

class CartItem(CartItemBase):
    id: int
    cart_id: int
    product: Product

    class Config:
        from_attributes = True

class CartBase(BaseModel):
    user_id: int

class Cart(CartBase):
    id: int
    created_at: datetime
    updated_at: datetime
    items: List[CartItem]

    class Config:
        from_attributes = True 