from fastapi import APIRouter, HTTPException, Request, Depends, Response
from fastapi.responses import RedirectResponse
from sqlalchemy.orm import Session

from app.auth.oauth import oauth
from app.auth.jwt import create_access_token
from app.db import get_db
from models.user import User
from app.helpers.emailstrip import parse_mfu_student_email
from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])

@router.get("/login")
async def login(request: Request):
    redirect_uri = request.url_for("auth_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)

@router.get("/callback", name="auth_callback")
async def auth_callback(request: Request, db: Session = Depends(get_db)):
    
    token = await oauth.google.authorize_access_token(request)
    userinfo = token["userinfo"]
    
    try:
        info = parse_mfu_student_email(userinfo["email"])
    except ValueError as e:
        raise HTTPException(status_code=403, detail=str(e))

    user = db.query(User).filter(User.google_id == userinfo["sub"]).first()
    if not user:
        user = User(
            google_id=userinfo["sub"],
            email=userinfo["email"],
            name=userinfo["name"],
            school=info.school,
            major=info.major,
            student_id=info.student_id,
        )
        db.add(user)
        db.commit()
        db.refresh(user)


    jwt_token = create_access_token({"sub": str(user.public_id)})

    response = RedirectResponse(url=settings.frontend_url)
    response.set_cookie(
        "access_token",
        jwt_token,
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 24 * 7,
    )
    return response


@router.post("/logout")
def logout(response: Response):
    response.delete_cookie(
        key="access_token",
        httponly=True,
        samesite="lax",
    )
    return {"detail": "Logged out"}
