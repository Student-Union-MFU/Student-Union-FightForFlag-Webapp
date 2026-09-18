from models.base import Base
from typing import TYPE_CHECKING

from sqlalchemy import String, ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

import datetime

if TYPE_CHECKING:
    from models.user import User
    from models.school import School

class Vote(Base):
    __tablename__ = "votes"

    id: Mapped[int] = mapped_column(primary_key=True)
    user_student_id: Mapped[str] = mapped_column(
        ForeignKey("users.student_id"), unique=True
    )
    school_id: Mapped[int] = mapped_column(ForeignKey("schools.id"))
    created_at: Mapped[datetime.datetime] = mapped_column(DateTime, server_default=func.now())

    user: Mapped["User"] = relationship(back_populates="votes")
    school: Mapped["School"] = relationship(back_populates="votes")