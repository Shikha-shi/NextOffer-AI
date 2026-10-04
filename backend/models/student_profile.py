from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from database.database import Base


class StudentProfile(Base):
    __tablename__ = "student_profiles"

    id: Mapped[int] = mapped_column(
        Integer,
        primary_key=True,
        index=True
    )

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id", ondelete="CASCADE"),
        unique=True,
        nullable=False,
        index=True
    )

    phone: Mapped[str | None] = mapped_column(
        String(15),
        nullable=True
    )

    location: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    college: Mapped[str | None] = mapped_column(
        String(200),
        nullable=True
    )

    degree: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    branch: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    graduation_year: Mapped[int | None] = mapped_column(
        Integer,
        nullable=True
    )

    target_role: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    preferred_industry: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    preferred_location: Mapped[str | None] = mapped_column(
        String(150),
        nullable=True
    )

    work_mode: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True
    )

    technical_skills: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    soft_skills: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    experience_level: Mapped[str | None] = mapped_column(
        String(100),
        nullable=True
    )

    projects: Mapped[str | None] = mapped_column(
        Text,
        nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow
    )

    user = relationship(
        "User",
        back_populates="student_profile"
    )