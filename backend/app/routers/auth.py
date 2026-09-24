from datetime import datetime,timedelta,timezone

import jwt
from fastapi import APIRouter ,Depends , HTTPException,status
from fastapi.security import HTTPBearer ,HTTPAuthorizationCredentials
from pwdlib import PasswordHash
from sqlalchemy.orm import Session

from app.schemas.auth import (
    RegisterRequest,
    RegisterResponse,
    LoginRequest ,
      LoginResponse,
        UserResponse)
from app.settings import settings
from database.database import get_db
from models.users import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


password_hash=PasswordHash.recommended()
security = HTTPBearer()

def create_access_token(user_id:int):
    expire= datetime.now(timezone.utc)+timedelta(hours=24)

    payload = {
        "sub": str(user_id),
        'exp':expire
     }

    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm=settings.JWT_ALGORITHM
     )

def get_current_user(
      credentials:HTTPAuthorizationCredentials=Depends(security),
      db:Session=Depends(get_db)
):
    token= credentials.credentials
    try:
        payload = jwt.decode(
            token,
            settings.JWT_SECRET_KEY,
            algorithms=[settings.JWT_ALGORITHM]
        )

        user_id = payload.get("sub")

        if not user_id:
            raise HTTPException(
                status_code=401,
                detail="Invalid token"
            )

    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired token"
        )
    user = db.query(User).filter(
    User.id == int (user_id)
   ).first()

    if not user:
      raise HTTPException(
        status_code = 401,
        detail="User not found"
    )
    return user


@router.post("/register", response_model=RegisterResponse, status_code=201)
def register(
    register_data: RegisterRequest,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(
        User.email == register_data.email
    ).first()

    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    hashed_password = password_hash.hash(register_data.password)

    new_user = User(
        name=register_data.name,
        email=register_data.email,
        password_hash=hashed_password
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "id": new_user.id,
        "name": new_user.name,
        "email": new_user.email
    }

@router.post("/login",response_model = LoginResponse)
def login(
        login_data:LoginRequest,
        db:Session =Depends(get_db)
):
    user = db.query(User).filter(
        User.email == login_data.email
    ).first()

    if not user:
        raise HTTPException(
            status_code = status.HTTP_401_UNAUTHORIZED,
            detail ="Invalid email or password"
        )

    if not password_hash.verify(
        login_data.password,
        user.password_hash
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )
    access_token=create_access_token(user.id)


    return{
        "access_token": access_token,
        "token_type":"bearer",
        "user_id":user.id,
        "name":user.name,
        "email":user.email
    }

@router.get("/me",response_model=UserResponse)
def get_me(
        current_user:User = Depends(get_current_user)
):
    return current_user


