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

    class Config:
        orm_mode = True
