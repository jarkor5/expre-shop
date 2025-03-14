from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import products 
from database import engine, Base

# Crea todas las tablas
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Backend para Expre Shop")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # TODO: Limitar
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



app.include_router(products.router)

