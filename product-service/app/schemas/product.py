from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class CategoryBase(BaseModel):
    name: str
    description: Optional[str] = None

class CategoryCreate(CategoryBase):
    pass

class Category(CategoryBase):
    id: int

    class Config:
        from_attributes = True

class ProductBase(BaseModel):
    name: str
    description: Optional[str] = None
    price: float = Field(gt=0)
    stock: int = Field(ge=0)
    is_active: bool = True

class ProductCreate(ProductBase):
    category_ids: List[int]

class ProductUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price: Optional[float] = Field(None, gt=0)
    stock: Optional[int] = Field(None, ge=0)
    is_active: Optional[bool] = None
    category_ids: Optional[List[int]] = None

class Product(ProductBase):
    id: int
    created_at: datetime
    updated_at: datetime
    categories: List[Category]

    class Config:
        from_attributes = True

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