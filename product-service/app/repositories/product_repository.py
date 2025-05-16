from sqlalchemy.orm import Session
from app.models.product import Product, Category
from app.schemas.product import ProductCreate, ProductUpdate
from typing import List, Optional
from fastapi import HTTPException

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