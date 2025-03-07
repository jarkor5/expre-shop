from fastapi import FastAPI, Depends, HTTPException, Body
from sqlalchemy import create_engine, Column, Integer, String, Float, Boolean
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
from fastapi.middleware.cors import CORSMiddleware

SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://postgres:jacobo2253@localhost:5432/expre_shop"

# Crear una única instancia de FastAPI
app = FastAPI(title="Backend para Expre Shop")

# Agregar middleware de CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Puedes especificar dominios en lugar de "*"
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear el engine y la sesión
engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base para los modelos de SQLAlchemy
Base = declarative_base()

# Modelo de la base de datos (SQLAlchemy)
class ProductDB(Base):
    __tablename__ = "products"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    price = Column(Float)
    image = Column(String)
    description = Column(String)
    isfeatured = Column(Boolean, default=False)
    category = Column(String, nullable=True)  # Nueva columna para categoría
    brand = Column(String, nullable=True)     # Nueva columna para marca

# Crear las tablas en la base de datos
Base.metadata.create_all(bind=engine)

# Esquema Pydantic para validar y enviar datos
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

# Esquema para actualización (campos opcionales)
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

# Dependencia para obtener la sesión de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# Endpoint: Obtener todos los productos
@app.get("/products", response_model=List[Product])
def read_products(
    skip: int = 0,
    limit: int = 100,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(ProductDB)
    if category:
        query = query.filter(ProductDB.category == category)
    if brand:
        query = query.filter(ProductDB.brand == brand)
    products = query.offset(skip).limit(limit).all()
    return products

# Endpoint: Obtener productos paginados (por ejemplo, 9 por página)
@app.get("/products/paginated", response_model=List[Product])
def read_products_paginated(
    page: int = 1,
    limit: int = 9,
    category: Optional[str] = None,
    brand: Optional[str] = None,
    db: Session = Depends(get_db)
):
    skip = (page - 1) * limit
    query = db.query(ProductDB)
    if category:
        query = query.filter(ProductDB.category == category)
    if brand:
        query = query.filter(ProductDB.brand == brand)
    products = query.offset(skip).limit(limit).all()
    return products

# Endpoint: Crear un nuevo producto
@app.post("/products", response_model=Product)
def create_product(product: Product, db: Session = Depends(get_db)):
    db_product = ProductDB(
        id=product.id,
        name=product.name,
        price=product.price,
        image=product.image,
        description=product.description,
        isfeatured=product.isfeatured,
        category=product.category,
        brand=product.brand,
    )
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

# Endpoint: Crear múltiples productos a la vez (batch)
@app.post("/products/batch", response_model=List[Product])
def create_products_batch(
    products: List[Product] = Body(...),
    db: Session = Depends(get_db)
):
    db_products = []
    for product in products:
        db_product = ProductDB(
            id=product.id,
            name=product.name,
            price=product.price,
            image=product.image,
            description=product.description,
            isfeatured=product.isfeatured,
            category=product.category,
            brand=product.brand,
        )
        db.add(db_product)
        db_products.append(db_product)
    db.commit()
    for product in db_products:
        db.refresh(product)
    return db_products

# Endpoint: Actualizar múltiples productos a la vez (batch update)
@app.put("/products/batch", response_model=List[Product])
def update_products_batch(
    updates: List[ProductUpdate] = Body(...),
    db: Session = Depends(get_db)
):
    updated_products = []
    for update in updates:
        update_data = update.dict(exclude_unset=True)
        product_id = update_data.get("id")
        if not product_id:
            continue  # O lanzar un error si el id es obligatorio
        db_product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
        if not db_product:
            continue  # O lanzar un error
        update_data.pop("id", None)
        for key, value in update_data.items():
            setattr(db_product, key, value)
        updated_products.append(db_product)
    db.commit()
    for product in updated_products:
        db.refresh(product)
    return updated_products

# Endpoint: Actualizar un producto individual
@app.put("/products/{product_id}", response_model=Product)
def update_product(
    product_id: int,
    product_update: ProductUpdate,
    db: Session = Depends(get_db)
):
    db_product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
    if not db_product:
        raise HTTPException(status_code=404, detail="Producto no encontrado")
    update_data = product_update.dict(exclude_unset=True)
    update_data.pop("id", None)
    for key, value in update_data.items():
        setattr(db_product, key, value)
    db.commit()
    db.refresh(db_product)
    return db_product


@app.get("/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    # Obtener las categorías distintas (excluyendo valores nulos)
    categories = db.query(ProductDB.category).distinct().all()
    # El resultado es una lista de tuplas, por lo que extraemos el primer elemento de cada tupla
    return [category[0] for category in categories if category[0] is not None]

@app.get("/filters", response_model=dict)
def get_filters(db: Session = Depends(get_db)):
    # Obtener las categorías distintas (excluyendo valores nulos)
    categories = db.query(ProductDB.category).distinct().all()
    # Obtener las marcas distintas (excluyendo valores nulos)
    brands = db.query(ProductDB.brand).distinct().all()

    # Extraer el primer elemento de cada tupla y filtrar los nulos
    categories_list = [c[0] for c in categories if c[0] is not None]
    brands_list = [b[0] for b in brands if b[0] is not None]

    return {"categories": categories_list, "brands": brands_list}
