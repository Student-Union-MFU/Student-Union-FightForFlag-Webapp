from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.auth.dependencies import require_admin
from app.db import get_db

from models.user import User
from models.vote import Vote
from models.school import School
from models.eventsetting import VotingSettings

from schemas.admin import (
    AdminDashboardResponse,
    SchoolVoteCount,
    VotingToggle,
)


router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
)


@router.get(
    "/dashboard",
    response_model=AdminDashboardResponse,
)
def get_dashboard(
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    voting = (
        db.query(VotingSettings)
        .filter(VotingSettings.id == 1)
        .first()
    )

    if not voting:
        raise HTTPException(
            status_code=404,
            detail="Voting settings not found",
        )

    total_users = db.query(User).count()
    total_votes = db.query(Vote).count()

    schools = (
        db.query(
            School.id,
            School.code,
            School.name,
            School.color,
            func.count(Vote.id).label("vote_count"),
        )
        .outerjoin(
            Vote,
            Vote.school_id == School.id,
        )
        .group_by(
            School.id,
            School.code,
            School.name,
            School.color,
        )
        .order_by(School.id)
        .all()
    )

    return AdminDashboardResponse(
        voting_open=voting.is_open,
        total_users=total_users,
        total_votes=total_votes,
        users_not_voted=total_users - total_votes,
        schools=[
            SchoolVoteCount(
                school_id=school.id,
                school_name=school.name,
                color=school.color,
                school_code=school.id,
                vote_count=school.vote
                
            )
            for school in schools
        ],
    )


@router.patch("/voting")
def toggle_voting(
    data: VotingToggle,
    db: Session = Depends(get_db),
    _: User = Depends(require_admin),
):
    voting = (
        db.query(VotingSettings)
        .filter(VotingSettings.id == 1)
        .first()
    )

    if not voting:
        voting = VotingSettings(
            id=1,
            is_open=data.is_open,
        )

        db.add(voting)

    else:
        voting.is_open = data.is_open

    db.commit()
    db.refresh(voting)

    return {
        "is_open": voting.is_open
    }
    
