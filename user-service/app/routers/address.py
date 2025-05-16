from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.schemas.user import AddressBase
from app.services.user_service import UserService
from app.repositories.user_repository import UserRepository
from app.models.user import User, Address
from app.config import get_db
from app.routers.auth import get_current_user

router = APIRouter(prefix="/address", tags=["addresses"])

@router.post("/", response_model=AddressBase)
def create_address(
    address: AddressBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_repo = UserRepository(db)
    user_service = UserService(user_repo)
    return user_service.create_address(current_user.id, address)