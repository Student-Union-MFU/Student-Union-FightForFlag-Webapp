from models.base import Base
from typing import TYPE_CHECKING
from sqlalchemy import ForeignKey, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column, relationship
import datetime

if TYPE_CHECKING:
    from models.user import User
    from models.school import School


class Vote(Base):
    __tablename__ = "votes"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_student_id: Mapped[str] = mapped_column(
        ForeignKey("users.student_id"),
        unique=True,
        nullable=False,
    )

    school_id: Mapped[int] = mapped_column(
        ForeignKey("schools.id"),
        nullable=False,
    )

    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime,
        server_default=func.now(),
        nullable=False,
    )

    user: Mapped["User"] = relationship(
        back_populates="votes"
    )

    school: Mapped["School"] = relationship(
        back_populates="votes"
    )