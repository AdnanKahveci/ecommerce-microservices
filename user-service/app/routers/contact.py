from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.schemas.user import ContactBase
from app.services.user_service import UserService
from app.repositories.user_repository import UserRepository
from app.models.user import User
from app.config import get_db
from app.routers.auth import get_current_user

router = APIRouter(prefix="/contact", tags=["contacts"])

@router.post("/", response_model=ContactBase)
def create_contact(
    contact: ContactBase,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    user_repo = UserRepository(db)
    user_service = UserService(user_repo)
    return user_service.create_contact(current_user.id, contact)