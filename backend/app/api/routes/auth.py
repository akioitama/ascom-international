from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_user_by_email
from app.core.security import create_access_token, hash_password, verify_password
from app.db.session import get_db
from app.models import User
from app.schemas.inputs import LoginRequest, PasswordChange
from app.services.present import user_dict
from app.utils.rate_limit import RateLimiter

router = APIRouter()
limiter = RateLimiter(limit=8, window_seconds=600)


@router.post("/auth/login")
def login(body: LoginRequest, request: Request, db: Session = Depends(get_db)):
    client = request.client.host if request.client else "unknown"
    if not limiter.allow(client):
        raise HTTPException(status_code=429, detail="Too many sign-in attempts. Please wait and try again.")
    user = get_user_by_email(db, body.email)
    if user is None or not user.is_active or not verify_password(body.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Email or password is incorrect")
    token = create_access_token(user.id, user.role)
    return {"data": {"access_token": token, "token_type": "bearer", "user": user_dict(user)}}


@router.get("/auth/me")
def me(user: User = Depends(get_current_user)):
    return {"data": user_dict(user)}


@router.post("/auth/password")
def change_password(body: PasswordChange, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    if not verify_password(body.current_password, user.password_hash):
        raise HTTPException(status_code=400, detail="Current password is incorrect")
    user.password_hash = hash_password(body.new_password)
    db.commit()
    return {"data": {"updated": True}}
