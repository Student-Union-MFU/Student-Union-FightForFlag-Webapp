from typing import TYPE_CHECKING

from models.base import Base

from sqlalchemy import String
from sqlalchemy.orm import Mapped, mapped_column, relationship

if TYPE_CHECKING:
    from models.vote import Vote


class School(Base):
    __tablename__ = "schools"

    id: Mapped[int] = mapped_column(primary_key=True)

    code: Mapped[str] = mapped_column(
        String(2),
        unique=True,
        index=True,
    )

    name: Mapped[str] = mapped_column(
        String,
        unique=True,
    )

    color: Mapped[str] = mapped_column(
        String(7),
        nullable=False,
    )

    votes: Mapped[list["Vote"]] = relationship(
        back_populates="school",
    )