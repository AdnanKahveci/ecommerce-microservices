from sqlalchemy.orm import Session
from app.models.user import User, Role, Address, Contact
from app.schemas.user import UserCreate, AddressBase, ContactBase
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_user(self, user_id: int):
        return self.db.query(User).filter(User.id == user_id).first()

    def get_user_by_username(self, username: str):
        return self.db.query(User).filter(User.username == username).first()

    def get_users(self, skip: int = 0, limit: int = 100):
        return self.db.query(User).offset(skip).limit(limit).all()

    def create_user(self, user: UserCreate):
        hashed_password = pwd_context.hash(user.password)
        db_user = User(
            username=user.username,
            hashed_password=hashed_password,
            full_name=user.full_name
        )
        self.db.add(db_user)
        self.db.commit()
        self.db.refresh(db_user)
        return db_user

    def authenticate_user(self, username: str, password: str):
        user = self.get_user_by_username(username)
        if not user:
            return False
        if not pwd_context.verify(password, user.hashed_password):
            return False
        return user

    def create_address(self, user_id: int, address: AddressBase):
        db_address = Address(**address.dict(), user_id=user_id)
        self.db.add(db_address)
        self.db.commit()
        self.db.refresh(db_address)
        return db_address

    def create_contact(self, user_id: int, contact: ContactBase):
        db_contact = Contact(**contact.dict(), user_id=user_id)
        self.db.add(db_contact)
        self.db.commit()
        self.db.refresh(db_contact)
        return db_contact