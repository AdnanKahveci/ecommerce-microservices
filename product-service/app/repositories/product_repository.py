from sqlalchemy.orm import Session
from app.models.product import Product, Category, Cart, CartItem, Order, OrderItem
from app.schemas.product import ProductCreate, ProductUpdate, CartItemCreate, OrderCreate
from typing import List, Optional
from fastapi import HTTPException, status

class ProductRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_product(self, product_id: int) -> Optional[Product]:
        return self.db.query(Product).filter(Product.id == product_id).first()

    def get_products(self, skip: int = 0, limit: int = 100) -> List[Product]:
        return self.db.query(Product).offset(skip).limit(limit).all()

    def create_product(self, product: ProductCreate) -> Product:
        categories = self.db.query(Category).filter(Category.id.in_(product.category_ids)).all()
        if len(categories) != len(product.category_ids):
            raise HTTPException(status_code=400, detail="Invalid category IDs")

        db_product = Product(
            name=product.name,
            description=product.description,
            price=product.price,
            stock=product.stock,
            is_active=product.is_active,
            categories=categories
        )
        self.db.add(db_product)
        self.db.commit()
        self.db.refresh(db_product)
        return db_product

    def update_product(self, product_id: int, product: ProductUpdate) -> Optional[Product]:
        db_product = self.get_product(product_id)
        if not db_product:
            return None

        update_data = product.dict(exclude_unset=True)
        if "category_ids" in update_data:
            categories = self.db.query(Category).filter(
                Category.id.in_(update_data["category_ids"])
            ).all()
            if len(categories) != len(update_data["category_ids"]):
                raise HTTPException(status_code=400, detail="Invalid category IDs")
            db_product.categories = categories
            del update_data["category_ids"]

        for field, value in update_data.items():
            setattr(db_product, field, value)

        self.db.commit()
        self.db.refresh(db_product)
        return db_product

    def delete_product(self, product_id: int) -> bool:
        db_product = self.get_product(product_id)
        if not db_product:
            return False
        self.db.delete(db_product)
        self.db.commit()
        return True

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
        product = self.get_product(item.product_id)
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

    def create_order(self, user_id: int, order: OrderCreate) -> Order:
        # Sipariş oluştur
        db_order = Order(
            user_id=user_id,
            total_amount=order.total_amount,
            status="pending"
        )
        self.db.add(db_order)
        self.db.commit()
        self.db.refresh(db_order)

        # Sipariş öğelerini ekle ve stok kontrolü yap
        for item in order.items:
            product = self.get_product(item.product_id)
            if not product:
                self.db.delete(db_order)
                self.db.commit()
                raise HTTPException(status_code=404, detail=f"Product {item.product_id} not found")
            if product.stock < item.quantity:
                self.db.delete(db_order)
                self.db.commit()
                raise HTTPException(status_code=400, detail=f"Not enough stock for product {product.name}")

            # Stok güncelle
            product.stock -= item.quantity
            
            # Sipariş öğesini ekle
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