from fastapi import Depends, HTTPException, Request, APIRouter, Response
from sqlalchemy.orm import Session
from jose import JWTError

from app.auth.jwt import decode_access_token
from app.db import get_db
from schemas.user import UserResponse
from models.user import User

import uuid

router = APIRouter(prefix="/profile", tags=["profile"])
@router.get("/me")
def get_current_user(request: Request, db: Session = Depends(get_db)) -> UserResponse:
    token = request.cookies.get("access_token")
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        payload = decode_access_token(token)
        public_id = uuid.UUID(payload["sub"])
    except (JWTError, KeyError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid token")

    user = db.query(User).filter(User.public_id == public_id).first()
    if not user:
        raise HTTPException(status_code=401, detail="User not found")
    
    print("TOKEN:", token)

    return UserResponse.model_validate(user)

