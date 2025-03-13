from sqlalchemy import Column, Integer, String, Float, Boolean
from database import Base

class ProductDB(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float)
    image = Column(String)
    description = Column(String)
    isfeatured = Column(Boolean, default=False)
    category = Column(String, nullable=True)
    brand = Column(String, nullable=True)
    technicalDetails = Column(String, nullable=True)

# TODO: Agregar otros modelos
