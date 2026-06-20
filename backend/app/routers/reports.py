"""Reports REST API router."""

from __future__ import annotations

from decimal import Decimal

from fastapi import APIRouter, Depends, HTTPException, Query, Response, status
from sqlalchemy import func
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Report, ReportStatus, ReportType
from app.schemas import (
    MetricItem,
    MetricsResponse,
    ReportCreate,
    ReportList,
    ReportResponse,
    ReportUpdate,
)

router = APIRouter(tags=["reports"])


def _report_not_found(report_id: int) -> HTTPException:
    return HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Report with id {report_id} not found",
    )


@router.get("/reports", response_model=ReportList)
def list_reports(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
) -> ReportList:
    """List reports with optional pagination."""
    query = db.query(Report).order_by(Report.created_at.desc())
    total = query.count()
    items = query.offset(skip).limit(limit).all()

    return ReportList(
        data=[ReportResponse.model_validate(item) for item in items],
        skip=skip,
        limit=limit,
        total=total,
    )


@router.post("/reports", response_model=ReportResponse, status_code=status.HTTP_201_CREATED)
def create_report(payload: ReportCreate, db: Session = Depends(get_db)) -> Report:
    """Create a new report."""
    report = Report(**payload.model_dump())
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.get("/reports/{report_id}", response_model=ReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db)) -> Report:
    """Retrieve a single report by id."""
    report = db.get(Report, report_id)
    if report is None:
        raise _report_not_found(report_id)
    return report


@router.put("/reports/{report_id}", response_model=ReportResponse)
def update_report(
    report_id: int,
    payload: ReportUpdate,
    db: Session = Depends(get_db),
) -> Report:
    """Update an existing report. Missing fields are left unchanged."""
    report = db.get(Report, report_id)
    if report is None:
        raise _report_not_found(report_id)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(report, field, value)

    db.commit()
    db.refresh(report)
    return report


@router.delete(
    "/reports/{report_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def delete_report(report_id: int, db: Session = Depends(get_db)) -> Response:
    """Delete a report by id."""
    report = db.get(Report, report_id)
    if report is None:
        raise _report_not_found(report_id)
    db.delete(report)
    db.commit()
    return Response(status_code=status.HTTP_204_NO_CONTENT)


@router.get("/metrics", response_model=MetricsResponse)
def get_metrics(db: Session = Depends(get_db)) -> MetricsResponse:
    """Return aggregated counts and totals grouped by status and report type."""

    def _build_group(
        group_col: object,
        label_prefix: str,
    ) -> list[MetricItem]:
        rows = (
            db.query(group_col, func.count(Report.id), func.coalesce(func.sum(Report.amount), Decimal("0")))
            .group_by(group_col)
            .order_by(group_col)
            .all()
        )
        return [
            MetricItem(
                group_key=label_prefix,
                group_value=str(value),
                count=count,
                total_amount=total,
            )
            for value, count, total in rows
        ]

    by_status = _build_group(Report.status, "status")
    by_type = _build_group(Report.report_type, "type")

    grand_total = (
        db.query(func.coalesce(func.sum(Report.amount), Decimal("0"))).scalar()
        or Decimal("0")
    )
    total_count = db.query(func.count(Report.id)).scalar() or 0

    return MetricsResponse(
        by_status=by_status,
        by_type=by_type,
        grand_total=grand_total,
        total_count=total_count,
    )
