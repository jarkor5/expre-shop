from pydantic import BaseModel
from typing import Optional

class Product(BaseModel):
    id: int
    name: str
    price: float
    image: str
    description: str
    isfeatured: bool
    category: Optional[str] = None
    brand: Optional[str] = None
    technicalDetails: Optional[str] = None

    class Config:
        orm_mode = True

class ProductUpdate(BaseModel):
    id: Optional[int] = None
    name: Optional[str] = None
    price: Optional[float] = None
    image: Optional[str] = None
    description: Optional[str] = None
    isfeatured: Optional[bool] = None
    category: Optional[str] = None
    brand: Optional[str] = None
    technicalDetails: Optional[str] = None

    class Config:
        orm_mode = True


class UserBase(BaseModel):
    username: str
    full_name: Optional[str] = None
    email: Optional[str] = None

class UserCreate(UserBase):
    password: str  # Contraseña en texto plano para el registro
    role: Optional[str] = "user"

class UserResponse(UserBase):
    id: int
    role: str
    disabled: bool

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None