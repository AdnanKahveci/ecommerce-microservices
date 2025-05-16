from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.user import UserInDB, UserCreate
from app.services.user_service import UserService
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.config import get_db
from app.routers.auth import get_current_user

router = APIRouter(prefix="/user", tags=["users"])

@router.post("/", response_model=UserInDB)
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    user_repo = UserRepository(db)
    user_service = UserService(user_repo)
    
    db_user = user_service.get_user_by_username(user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")
    
    return user_service.create_user(user)

@router.get("/", response_model=List[UserInDB])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    user_repo = UserRepository(db)
    user_service = UserService(user_repo)
    users = user_service.get_users(skip=skip, limit=limit)
    return users

@router.get("/me", response_model=UserInDB)
async def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user