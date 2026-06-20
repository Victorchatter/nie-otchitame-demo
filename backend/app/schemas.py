"""Pydantic v2 request/response models for the Nie Otchitame API."""

from __future__ import annotations

import datetime as dt
from decimal import Decimal, ROUND_HALF_UP

from pydantic import BaseModel, ConfigDict, Field, field_validator

from app.models import ReportStatus, ReportType

# Amount bounds mirror the database column (Numeric(14,2)).
_MIN_AMOUNT = Decimal("-999999999999.99")
_MAX_AMOUNT = Decimal("999999999999.99")


def _normalize_amount(value: Decimal) -> Decimal:
    """Round to two decimals and enforce numeric bounds.

    Pydantic v2 has a known issue applying ``max_digits``/``decimal_places``
    on optional ``Decimal`` union fields, so we validate manually for
    consistent behaviour in both create and update schemas.
    """
    rounded = value.quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)
    if rounded < _MIN_AMOUNT or rounded > _MAX_AMOUNT:
        raise ValueError(f"amount must be between {_MIN_AMOUNT} and {_MAX_AMOUNT}")
    return rounded


class ReportBase(BaseModel):
    """Common fields shared by create/update request schemas."""

    model_config = ConfigDict(str_strip_whitespace=True)

    title: str = Field(..., min_length=1, max_length=255)
    report_type: ReportType
    amount: Decimal = Field(..., ge=_MIN_AMOUNT, le=_MAX_AMOUNT)
    date: dt.date
    status: ReportStatus = ReportStatus.DRAFT

    @field_validator("report_type", "status", mode="before")
    @classmethod
    def coerce_enum_strings(cls, value: object) -> object:
        """Allow lower-case string inputs to be accepted as enum values."""
        if isinstance(value, str):
            return value.strip().lower()
        return value

    @field_validator("amount", mode="after")
    @classmethod
    def validate_amount(cls, value: Decimal) -> Decimal:
        """Round amount to two decimal places and enforce bounds."""
        return _normalize_amount(value)


class ReportCreate(ReportBase):
    """Payload required to create a new report."""

    pass


class ReportUpdate(BaseModel):
    """Payload for a partial or full update of a report.

    All fields are optional, enabling PATCH-like semantics from a PUT call.
    """

    model_config = ConfigDict(str_strip_whitespace=True)

    title: str | None = Field(default=None, min_length=1, max_length=255)
    report_type: ReportType | None = None
    amount: Decimal | None = Field(default=None, ge=_MIN_AMOUNT, le=_MAX_AMOUNT)
    date: dt.date | None = None
    status: ReportStatus | None = None

    @field_validator("report_type", "status", mode="before")
    @classmethod
    def coerce_enum_strings(cls, value: object) -> object:
        """Allow lower-case string inputs to be accepted as enum values."""
        if isinstance(value, str):
            return value.strip().lower()
        return value

    @field_validator("amount", mode="after")
    @classmethod
    def validate_amount(cls, value: Decimal | None) -> Decimal | None:
        """Round optional amount to two decimal places and enforce bounds."""
        if value is None:
            return None
        return _normalize_amount(value)


class ReportResponse(ReportBase):
    """Report representation returned by the API."""

    model_config = ConfigDict(from_attributes=True)

    id: int
    created_at: dt.datetime
    updated_at: dt.datetime


class ReportList(BaseModel):
    """Paginated list of reports."""

    data: list[ReportResponse]
    skip: int
    limit: int
    total: int


class MetricItem(BaseModel):
    """A single aggregation bucket for the metrics endpoint."""

    group_key: str
    group_value: str
    count: int
    total_amount: Decimal


class MetricsResponse(BaseModel):
    """Aggregated totals grouped by status and report type."""

    by_status: list[MetricItem]
    by_type: list[MetricItem]
    grand_total: Decimal
    total_count: int
