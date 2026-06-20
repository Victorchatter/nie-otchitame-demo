"""SQLAlchemy ORM models for the Nie Otchitame reporting domain."""

from __future__ import annotations

import datetime as dt
from decimal import Decimal
from enum import Enum as PyEnum

from sqlalchemy import Date, DateTime, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class ReportType(str, PyEnum):
    """Allowed business categories for a report."""

    REVENUE = "revenue"
    EXPENSE = "expense"
    PROJECT = "project"
    HR = "hr"


class ReportStatus(str, PyEnum):
    """Lifecycle status of a report."""

    DRAFT = "draft"
    SUBMITTED = "submitted"
    APPROVED = "approved"


class Report(Base):
    """A single ERP-lite reporting record.

    Represents revenue, expenses, project milestones or HR entries.
    Timestamps are stored as UTC (application-side convention).
    """

    __tablename__ = "reports"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    title: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
        comment="Human-readable title of the report.",
    )

    report_type: Mapped[ReportType] = mapped_column(
        String(20),
        nullable=False,
        comment="Business domain: revenue, expense, project, hr.",
    )

    amount: Mapped[Decimal] = mapped_column(
        Numeric(precision=14, scale=2),
        nullable=False,
        comment="Monetary or numeric value with two-decimal precision.",
    )

    date: Mapped[dt.date] = mapped_column(
        Date,
        nullable=False,
        comment="Business date of the report entry.",
    )

    status: Mapped[ReportStatus] = mapped_column(
        String(20),
        nullable=False,
        default=ReportStatus.DRAFT,
        comment="Lifecycle status: draft, submitted, approved.",
    )

    created_at: Mapped[dt.datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=dt.datetime.utcnow,
        comment="Record creation timestamp (UTC).",
    )

    updated_at: Mapped[dt.datetime] = mapped_column(
        DateTime(timezone=True),
        nullable=False,
        default=dt.datetime.utcnow,
        onupdate=dt.datetime.utcnow,
        comment="Last update timestamp (UTC).",
    )

    def __repr__(self) -> str:
        return (
            f"<Report(id={self.id}, title={self.title!r}, "
            f"type={self.report_type.value}, status={self.status.value}, "
            f"amount={self.amount})>"
        )
