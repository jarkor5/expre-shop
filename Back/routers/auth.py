import os
from dotenv import load_dotenv
from datetime import datetime, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status, Body, BackgroundTasks
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session
from email_utils import send_recovery_email
from schemas import Token, TokenData, UserCreate, UserResponse
from models import UserDB
from database import get_db
load_dotenv()

router = APIRouter()

# Configuración para JWT y passlib
SECRET_KEY = os.environ["SECRET_KEY"]
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

# Función para verificar contraseñas
def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

# Función para obtener una contraseña hasheada
def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

# Función para obtener un usuario por username desde la BD
def get_user(db: Session, username: str) -> Optional[UserDB]:
    return db.query(UserDB).filter(UserDB.username == username).first()

def get_user_by_email(db: Session, email: str) -> Optional[UserDB]:
    return db.query(UserDB).filter(UserDB.email == email).first()


# Función para autenticar al usuario
def authenticate_user(db: Session, username: str, password: str) -> Optional[UserDB]:
    user = get_user(db, username)
    if not user or not verify_password(password, user.hashed_password):
        return None
    return user

# Función para crear un token de acceso JWT
def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

# Endpoint: Login para obtener token
@router.post("/login", response_model=Token)
async def login(
    form_data: OAuth2PasswordRequestForm = Depends(), 
    db: Session = Depends(get_db)
):
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Usuario o contraseña incorrectos",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username, "role": user.role},
        expires_delta=access_token_expires,
    )
    return {"access_token": access_token, "token_type": "bearer"}

# Endpoint: Registrar un nuevo usuario
@router.post("/users", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # Validar username duplicado
    if get_user(db, user.username):
        raise HTTPException(status_code=400, detail="El usuario ya existe")

    # Validar email duplicado
    if get_user_by_email(db, user.email):
        raise HTTPException(status_code=400, detail="El email ya está en uso")

    hashed_password = get_password_hash(user.password)
    new_user = UserDB(
        username=user.username,
        full_name=user.full_name,
        email=user.email,
        hashed_password=hashed_password,
        disabled=False,
        role=user.role or "user",
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return UserResponse.from_orm(new_user)


# Endpoint: Eliminar usuario por username
@router.delete("/users/{username}", response_model=dict)
def delete_user(username: str, db: Session = Depends(get_db)):
    user = get_user(db, username)
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")
    db.delete(user)
    db.commit()
    return {"detail": "Usuario eliminado correctamente"}

# TODO: Agregar endpoint para actualizar datos del usuario (PATCH/PUT)


@router.post("/password-recovery")
async def password_recovery(
    background_tasks: BackgroundTasks, 
    email: str = Body(...),   
    db: Session = Depends(get_db)
):
    user = db.query(UserDB).filter(UserDB.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    token = create_access_token({"sub": user.email}, timedelta(hours=1))

    # Enviar en segundo plano
    background_tasks.add_task(send_recovery_email, email, token)

    return {"message": "Se ha enviado un enlace de recuperación al correo"}


@router.post("/reset-password")
def reset_password(
    token: str = Body(...),
    new_password: str = Body(...),
    db: Session = Depends(get_db)
):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
    except JWTError:
        raise HTTPException(status_code=400, detail="Token inválido o expirado")

    user = db.query(UserDB).filter(UserDB.email == email).first()
    if not user:
        raise HTTPException(status_code=404, detail="Usuario no encontrado")

    user.hashed_password = get_password_hash(new_password)
    db.commit()
    return {"message": "Contraseña actualizada correctamente"}

@router.get("/test-email")
async def test_email(background_tasks: BackgroundTasks):
    test_email = "jacoor626@gmail.com"
    token = create_access_token({"sub": test_email}, timedelta(hours=1))
    background_tasks.add_task(send_recovery_email, test_email, token)
    return {"message": f"Correo de prueba enviado a {test_email}"}

