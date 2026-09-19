from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.auth.dependencies import get_current_user
from app.config import settings
from app.db import get_db
from models.user import User
from models.eventsetting import VotingSettings
from schemas.eventsetting import (
    VotingSettingsResponse,
    VotingSettingsUpdate,
)

router = APIRouter(prefix="/voting", tags=["Voting"])


@router.get(
    "/status",
    response_model=VotingSettingsResponse,
)
def get_voting_status(
    db: Session = Depends(get_db),
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

    return voting


@router.patch(
    "/settings",
    response_model=VotingSettingsResponse,
)
def update_voting_settings(
    data: VotingSettingsUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    if current_user.student_id != settings.admin_id:
        raise HTTPException(
            status_code=403,
            detail="Not authorized",
        )

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

    return voting