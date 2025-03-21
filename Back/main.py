import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import products, auth 
from database import engine, Base
import logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
from dotenv import load_dotenv
load_dotenv()
logger.info("La aplicación ha arrancado")


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Crea todas las tablas
# TODO: utilizar Alembic u otra herramienta de migraciones
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
app.include_router(auth.router)

# TODO: Agregar middleware adicional para manejo avanzado de errores
if __name__ == "__main__":
    host = os.getenv("API_HOST")
    port = int(os.getenv("API_PORT"))
    uvicorn.run(app, host=host, port=port, log_level="info")

