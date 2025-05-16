from sqlalchemy.orm import Session
from app.models.order import Order, OrderItem
from app.models.product import Product
from app.schemas.order import OrderCreate
from typing import List, Optional
from fastapi import HTTPException

class OrderRepository:
    def __init__(self, db: Session):
        self.db = db

    def create_order(self, user_id: int, order: OrderCreate) -> Order:
        db_order = Order(
            user_id=user_id,
            total_amount=order.total_amount,
            status="pending"
        )
        self.db.add(db_order)
        self.db.commit()
        self.db.refresh(db_order)

        for item in order.items:
            product = self.db.query(Product).filter(Product.id == item.product_id).first()
            if not product:
                self.db.delete(db_order)
                self.db.commit()
                raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
            if product.stock < item.quantity:
                self.db.delete(db_order)
                self.db.commit()
                raise HTTPException(status_code=400, detail=f"Not enough stock for product {product.name}")
            product.stock -= item.quantity
            order_item = OrderItem(
                order_id=db_order.id,
                product_id=item.product_id,
                quantity=item.quantity,
                price=item.price
            )
            self.db.add(order_item)
        self.db.commit()
        return db_order

    def get_user_orders(self, user_id: int, skip: int = 0, limit: int = 100) -> List[Order]:
        return self.db.query(Order).filter(Order.user_id == user_id).offset(skip).limit(limit).all()

    def get_order(self, order_id: int) -> Optional[Order]:
        return self.db.query(Order).filter(Order.id == order_id).first()

    def update_order_status(self, order_id: int, status: str) -> Optional[Order]:
        order = self.get_order(order_id)
        if not order:
            return None
        order.status = status
        self.db.commit()
        self.db.refresh(order)
        return order 