from fastapi import APIRouter, Depends, HTTPException, Body
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from database import SessionLocal
from models import ProductDB
from schemas import Product, ProductUpdate

router = APIRouter()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@router.get("/products", response_model=List[Product])
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

# Endpoint: Obtener productos paginados
@router.get("/products/paginated", response_model=List[Product])
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
        query = query.filter(ProductDB.category.ilike(category))
    if brand:
        query = query.filter(ProductDB.brand.ilike(brand))
    products = query.offset(skip).limit(limit).all()
    return products

# Endpoint: Crear un nuevo producto
@router.post("/products", response_model=Product)
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

# Endpoint: Crear múltiples productos a la vez
@router.post("/products/batch", response_model=List[Product])
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
@router.put("/products/batch", response_model=List[Product])
def update_products_batch(
    updates: List[ProductUpdate] = Body(...),
    db: Session = Depends(get_db)
):
    updated_products = []
    for update in updates:
        update_data = update.dict(exclude_unset=True)
        product_id = update_data.get("id")
        if not product_id:
            continue  # TODO:  retornar error si falta id
        db_product = db.query(ProductDB).filter(ProductDB.id == product_id).first()
        if not db_product:
            continue  # TODO: retornar error si no se encuentra el producto
        update_data.pop("id", None)
        for key, value in update_data.items():
            setattr(db_product, key, value)
        updated_products.append(db_product)
    db.commit()
    for product in updated_products:
        db.refresh(product)
    return updated_products

# Endpoint: Actualizar un producto individual
@router.put("/products/{product_id}", response_model=Product)
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


# Endpoint: Obtener categorías únicas
@router.get("/categories", response_model=List[str])
def get_categories(db: Session = Depends(get_db)):
    categories = db.query(ProductDB.category).distinct().all()
    return [category[0] for category in categories if category[0] is not None]

# Endpoint: Obtener filtros (categorías y marcas)
@router.get("/filters", response_model=Dict[str, List[str]])
def get_filters(category: Optional[str] = None, db: Session = Depends(get_db)):
    # Obtener todas las categorías disponibles (sin filtro)
    categories = db.query(ProductDB.category).distinct().all()
    categories_list = [c[0] for c in categories if c[0] is not None]
    # Si se proporciona una categoría, filtrar las marcas por esa categoría
    if category:
        brands = db.query(ProductDB.brand).filter(ProductDB.category == category).distinct().all()
    else:
        brands = db.query(ProductDB.brand).distinct().all()
    brands_list = [b[0] for b in brands if b[0] is not None]

    return {"categories": categories_list, "brands": brands_list}