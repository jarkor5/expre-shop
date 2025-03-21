from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

SQLALCHEMY_DATABASE_URL = "postgresql+psycopg2://postgres:jacobo2253@localhost:5432/expre_shop"

engine = create_engine(SQLALCHEMY_DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)



Base = declarative_base()

# TODO: Considerar agregar funciones de conexión/reconexión


def get_db():
    """Dependencia para obtener una sesión de base de datos."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
