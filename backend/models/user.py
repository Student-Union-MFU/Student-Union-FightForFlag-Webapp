from models.base import Base

from typing import TYPE_CHECKING

from sqlalchemy import String, ForeignKey, Uuid
from sqlalchemy.orm import Mapped, mapped_column, relationship

import uuid

if TYPE_CHECKING:
    from models.vote import Vote

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String, unique=True)
    name: Mapped[str] = mapped_column(String)
    school: Mapped[str] = mapped_column(String)
    school_id: Mapped[int | None] = mapped_column(ForeignKey("schools.id"))
    major: Mapped[str] = mapped_column(String)
    google_id: Mapped[str] = mapped_column(String, unique=True)
    public_id: Mapped[uuid.UUID] = mapped_column(Uuid, unique=True, index=True, default=uuid.uuid4)
    student_id: Mapped[str] = mapped_column(String, unique=True)

    votes: Mapped[list["Vote"]] = relationship(back_populates="user")