from typing import Optional
from pydantic import BaseModel, Field

class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserInDB(UserBase):
    id: int
    is_active: bool
    is_superuser: bool

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

class AddressBase(BaseModel):
    address_type: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: Optional[str] = None
    postal_code: str
    country: str

class ContactBase(BaseModel):
    contact_type: str
    phone_number: Optional[str] = None
    mobile_number: str