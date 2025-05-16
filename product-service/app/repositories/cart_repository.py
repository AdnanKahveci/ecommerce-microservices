from sqlalchemy.orm import Session
from app.models.cart import Cart, CartItem
from app.models.product import Product
from app.schemas.cart import CartItemCreate
from typing import Optional
from fastapi import HTTPException

class CartRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_or_create_cart(self, user_id: int) -> Cart:
        cart = self.db.query(Cart).filter(Cart.user_id == user_id).first()
        if not cart:
            cart = Cart(user_id=user_id)
            self.db.add(cart)
            self.db.commit()
            self.db.refresh(cart)
        return cart

    def add_to_cart(self, user_id: int, item: CartItemCreate) -> CartItem:
        cart = self.get_or_create_cart(user_id)
        product = self.db.query(Product).filter(Product.id == item.product_id).first()
        if not product:
            raise HTTPException(status_code=404, detail="Product not found")
        if not product.is_active:
            raise HTTPException(status_code=400, detail="Product is not active")
        if product.stock < item.quantity:
            raise HTTPException(status_code=400, detail="Not enough stock")

        cart_item = CartItem(
            cart_id=cart.id,
            product_id=item.product_id,
            quantity=item.quantity
        )
        self.db.add(cart_item)
        self.db.commit()
        self.db.refresh(cart_item)
        return cart_item

    def remove_from_cart(self, user_id: int, cart_item_id: int) -> bool:
        cart = self.get_or_create_cart(user_id)
        cart_item = self.db.query(CartItem).filter(
            CartItem.id == cart_item_id,
            CartItem.cart_id == cart.id
        ).first()
        if not cart_item:
            return False
        self.db.delete(cart_item)
        self.db.commit()
        return True

    def get_cart(self, user_id: int) -> Optional[Cart]:
        return self.db.query(Cart).filter(Cart.user_id == user_id).first()

    def clear_cart(self, user_id: int) -> bool:
        cart = self.get_cart(user_id)
        if not cart:
            return False
        self.db.query(CartItem).filter(CartItem.cart_id == cart.id).delete()
        self.db.commit()
        return True 