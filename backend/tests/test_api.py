"""Integration tests for the Nie Otchitame REST API."""

from __future__ import annotations

from decimal import Decimal

import pytest
from fastapi.testclient import TestClient

from app.models import ReportStatus, ReportType


class TestHealth:
    def test_health(self, client: TestClient) -> None:
        response = client.get("/health")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


class TestCreateReport:
    def test_create_report_defaults_to_draft(self, client: TestClient) -> None:
        payload = {
            "title": "Monthly revenue",
            "report_type": "revenue",
            "amount": "12500.50",
            "date": "2026-06-20",
        }
        response = client.post("/api/v1/reports", json=payload)
        assert response.status_code == 201

        data = response.json()
        assert data["title"] == payload["title"]
        assert data["report_type"] == "revenue"
        assert Decimal(data["amount"]) == Decimal("12500.50")
        assert data["date"] == "2026-06-20"
        assert data["status"] == "draft"
        assert "id" in data
        assert "created_at" in data
        assert "updated_at" in data

    def test_create_report_explicit_status(self, client: TestClient) -> None:
        payload = {
            "title": "Q2 expense",
            "report_type": "expense",
            "amount": "3000.00",
            "date": "2026-03-31",
            "status": "approved",
        }
        response = client.post("/api/v1/reports", json=payload)
        assert response.status_code == 201
        assert response.json()["status"] == "approved"

    def test_create_report_invalid_type(self, client: TestClient) -> None:
        payload = {
            "title": "Bad",
            "report_type": "unknown",
            "amount": "100",
            "date": "2026-06-20",
        }
        response = client.post("/api/v1/reports", json=payload)
        assert response.status_code == 422

    def test_create_report_missing_title(self, client: TestClient) -> None:
        payload = {
            "report_type": "revenue",
            "amount": "100",
            "date": "2026-06-20",
        }
        response = client.post("/api/v1/reports", json=payload)
        assert response.status_code == 422


class TestListReports:
    @pytest.fixture(autouse=True)
    def seed(self, client: TestClient) -> None:
        """Create two reports before each test in this class."""
        for i in range(2):
            client.post(
                "/api/v1/reports",
                json={
                    "title": f"Report {i}",
                    "report_type": "revenue",
                    "amount": "1000.00",
                    "date": "2026-06-20",
                },
            )

    def test_list_reports(self, client: TestClient) -> None:
        response = client.get("/api/v1/reports")
        assert response.status_code == 200

        data = response.json()
        assert data["total"] == 2
        assert data["skip"] == 0
        assert data["limit"] == 100
        assert len(data["data"]) == 2

    def test_list_reports_pagination(self, client: TestClient) -> None:
        response = client.get("/api/v1/reports?skip=1&limit=1")
        data = response.json()
        assert data["total"] == 2
        assert len(data["data"]) == 1


class TestReadReport:
    def test_read_existing(self, client: TestClient) -> None:
        create_resp = client.post(
            "/api/v1/reports",
            json={
                "title": "Project milestone",
                "report_type": "project",
                "amount": "5000.00",
                "date": "2026-06-20",
            },
        )
        report_id = create_resp.json()["id"]

        response = client.get(f"/api/v1/reports/{report_id}")
        assert response.status_code == 200
        assert response.json()["id"] == report_id

    def test_read_not_found(self, client: TestClient) -> None:
        response = client.get("/api/v1/reports/9999")
        assert response.status_code == 404


class TestUpdateReport:
    def test_update_full(self, client: TestClient) -> None:
        create_resp = client.post(
            "/api/v1/reports",
            json={
                "title": "HR entry",
                "report_type": "hr",
                "amount": "1200.00",
                "date": "2026-06-20",
            },
        )
        report_id = create_resp.json()["id"]

        payload = {
            "title": "Updated HR entry",
            "report_type": "expense",
            "amount": "1500.00",
            "date": "2026-06-21",
            "status": "submitted",
        }
        response = client.put(f"/api/v1/reports/{report_id}", json=payload)
        assert response.status_code == 200

        data = response.json()
        assert data["title"] == payload["title"]
        assert data["report_type"] == "expense"
        assert Decimal(data["amount"]) == Decimal("1500.00")
        assert data["status"] == "submitted"

    def test_update_partial(self, client: TestClient) -> None:
        create_resp = client.post(
            "/api/v1/reports",
            json={
                "title": "Partial",
                "report_type": "revenue",
                "amount": "100.00",
                "date": "2026-06-20",
                "status": "draft",
            },
        )
        report_id = create_resp.json()["id"]

        response = client.put(
            f"/api/v1/reports/{report_id}",
            json={"status": "approved"},
        )
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "approved"
        assert data["title"] == "Partial"  # unchanged

    def test_update_not_found(self, client: TestClient) -> None:
        response = client.put("/api/v1/reports/9999", json={"status": "approved"})
        assert response.status_code == 404


class TestDeleteReport:
    def test_delete_existing(self, client: TestClient) -> None:
        create_resp = client.post(
            "/api/v1/reports",
            json={
                "title": "To delete",
                "report_type": "expense",
                "amount": "200.00",
                "date": "2026-06-20",
            },
        )
        report_id = create_resp.json()["id"]

        response = client.delete(f"/api/v1/reports/{report_id}")
        assert response.status_code == 204

        get_response = client.get(f"/api/v1/reports/{report_id}")
        assert get_response.status_code == 404

    def test_delete_not_found(self, client: TestClient) -> None:
        response = client.delete("/api/v1/reports/9999")
        assert response.status_code == 404


class TestMetrics:
    def test_metrics_aggregation(self, client: TestClient) -> None:
        # Seed a small dataset.
        records = [
            ("revenue", "approved", "1000.00"),
            ("revenue", "approved", "2000.00"),
            ("expense", "submitted", "500.00"),
            ("project", "draft", "300.00"),
        ]
        for report_type, status, amount in records:
            client.post(
                "/api/v1/reports",
                json={
                    "title": f"{report_type}-{status}",
                    "report_type": report_type,
                    "amount": amount,
                    "date": "2026-06-20",
                    "status": status,
                },
            )

        response = client.get("/api/v1/metrics")
        assert response.status_code == 200

        data = response.json()
        assert data["total_count"] == 4
        assert Decimal(data["grand_total"]) == Decimal("3800.00")

        approved = next(item for item in data["by_status"] if item["group_value"] == "approved")
        assert approved["count"] == 2
        assert Decimal(approved["total_amount"]) == Decimal("3000.00")

        revenue = next(item for item in data["by_type"] if item["group_value"] == "revenue")
        assert revenue["count"] == 2
        assert Decimal(revenue["total_amount"]) == Decimal("3000.00")
