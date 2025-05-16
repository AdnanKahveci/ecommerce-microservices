from typing import Optional
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.schemas.user import UserCreate, UserInDB

class UserService:
    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    def get_user(self, user_id: int) -> Optional[User]:
        return self.user_repository.get_user(user_id)

    def get_user_by_username(self, username: str) -> Optional[User]:
        return self.user_repository.get_user_by_username(username)

    def get_users(self, skip: int = 0, limit: int = 100):
        return self.user_repository.get_users(skip, limit)

    def create_user(self, user: UserCreate) -> User:
        return self.user_repository.create_user(user)

    def authenticate_user(self, username: str, password: str) -> Optional[User]:
        return self.user_repository.authenticate_user(username, password)

    def create_address(self, user_id: int, address):
        return self.user_repository.create_address(user_id, address)

    def create_contact(self, user_id: int, contact):
        return self.user_repository.create_contact(user_id, contact)