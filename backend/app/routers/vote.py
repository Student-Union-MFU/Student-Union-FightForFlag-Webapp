from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy import func
from jose import JWTError

from app.auth.jwt import decode_access_token
from app.db import get_db
from models.user import User
from models.vote import Vote
from models.school import School
from schemas.vote import VoteStatusResponse, VoteCountResponse

import uuid

router = APIRouter(prefix="/votes", tags=["votes"])

def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
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

    return user

@router.get("/status", response_model=VoteStatusResponse)
def get_vote_status(user: User = Depends(get_current_user), db: Session = Depends(get_db)) -> VoteStatusResponse:
    existing_vote = db.query(Vote).filter(Vote.user_student_id == user.student_id).first()

    return VoteStatusResponse(
        has_voted=existing_vote is not None,
        voted_school_code=existing_vote.school.code if existing_vote else None,
        own_school_id=user.school_id if hasattr(user, "school_id") else None,
    )

@router.get("/counts", response_model=list[VoteCountResponse])
def get_vote_counts(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
) -> list[VoteCountResponse]:
    
    results = (
        db.query(Vote.school_id, func.count(Vote.id).label("vote_count"))
        .group_by(Vote.school_id)
        .all()
    )
    counts_by_school = {school_id: count for school_id, count in results}

    schools = db.query(School).all()
    return [
        VoteCountResponse(
            school_id=school.id,
            school_code=school.code,
            school_name=school.name,
            vote_count=counts_by_school.get(school.id, 0),
            color=school.color
        )
        for school in schools
    ]

@router.post("/{school_code}")
def cast_vote(school_code: str, user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    school = db.query(School).filter(School.code == school_code).first()
    if not school:
        raise HTTPException(status_code=404, detail="School not found")

    if hasattr(user, "school_id") and user.school_id == school.id:
        raise HTTPException(status_code=403, detail="You can't vote for your own school")

    existing_vote = db.query(Vote).filter(Vote.user_student_id == user.student_id).first()
    if existing_vote:
        raise HTTPException(status_code=409, detail="You've already voted")

    vote = Vote(user_student_id=user.student_id, school_id=school.id)
    db.add(vote)
    db.commit()
    db.refresh(vote)

    return {"detail": "Vote cast", "school_id": school.id}