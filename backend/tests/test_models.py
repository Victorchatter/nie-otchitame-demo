"""Unit tests for Pydantic schemas and SQLAlchemy models."""

from __future__ import annotations

from datetime import date, datetime, timezone
from decimal import Decimal

import pytest
from pydantic import ValidationError

from app.models import Report, ReportStatus, ReportType
from app.schemas import ReportCreate, ReportUpdate


class TestReportEnums:
    def test_report_type_values(self) -> None:
        assert ReportType.REVENUE.value == "revenue"
        assert ReportType.EXPENSE.value == "expense"
        assert ReportType.PROJECT.value == "project"
        assert ReportType.HR.value == "hr"

    def test_report_status_values(self) -> None:
        assert ReportStatus.DRAFT.value == "draft"
        assert ReportStatus.SUBMITTED.value == "submitted"
        assert ReportStatus.APPROVED.value == "approved"


class TestReportCreateSchema:
    def test_valid_report_create(self) -> None:
        report = ReportCreate(
            title="Valid report",
            report_type="revenue",
            amount=Decimal("1234.56"),
            date=date(2026, 6, 20),
        )
        assert report.status == ReportStatus.DRAFT

    def test_invalid_report_type(self) -> None:
        with pytest.raises(ValidationError) as exc_info:
            ReportCreate(
                title="Bad type",
                report_type="magic",
                amount=Decimal("100"),
                date=date(2026, 6, 20),
            )
        assert "magic" in str(exc_info.value)

    def test_amount_rounds_to_two_decimals(self) -> None:
        report = ReportCreate(
            title="Rounding",
            report_type="expense",
            amount=Decimal("100.999"),
            date=date(2026, 6, 20),
        )
        assert report.amount == Decimal("101.00")

    def test_title_cannot_be_empty(self) -> None:
        with pytest.raises(ValidationError):
            ReportCreate(
                title="",
                report_type="revenue",
                amount=Decimal("100"),
                date=date(2026, 6, 20),
            )

    def test_amount_too_large(self) -> None:
        with pytest.raises(ValidationError):
            ReportCreate(
                title="Too large",
                report_type="revenue",
                amount=Decimal("1000000000000.00"),
                date=date(2026, 6, 20),
            )


class TestReportUpdateSchema:
    def test_empty_update_valid(self) -> None:
        update = ReportUpdate()
        assert update.model_dump(exclude_unset=True) == {}

    def test_partial_update(self) -> None:
        update = ReportUpdate(status="approved")
        assert update.status == ReportStatus.APPROVED
        assert update.title is None


class TestReportModel:
    def test_model_repr(self) -> None:
        report = Report(
            id=1,
            title="Test",
            report_type=ReportType.REVENUE,
            amount=Decimal("1000.00"),
            date=date(2026, 6, 20),
            status=ReportStatus.DRAFT,
            created_at=datetime.now(timezone.utc),
            updated_at=datetime.now(timezone.utc),
        )
        assert "Test" in repr(report)
        assert "revenue" in repr(report)
