# API Documentation

## Base URL

All endpoints are prefixed with `/api/v1`. In production the stack is exposed through Nginx, so a local call looks like:

```
http://localhost/api/v1/reports
```

## Authentication

This demo uses no authentication to stay lightweight. A production fork would add OAuth2 / JWT via FastAPI dependencies and store users in a `users` table.

## Content Type

Every request body must be `Content-Type: application/json`.

---

## Endpoints

### Health Check

```text
GET /health
```

Lightweight probe used by load balancers, Kubernetes, and monitoring.

#### Example response

```json
{
  "status": "ok"
}
```

#### Status codes

| Code | Meaning |
|------|---------|
| 200 | API is reachable |

---

### List Reports

```text
GET /api/v1/reports?skip={skip}&limit={limit}
```

Returns a paginated list of reports ordered by `created_at` descending.

#### Query parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `skip` | integer | `0` | Number of records to skip |
| `limit` | integer | `100` | Maximum number of records to return (max `500`) |

#### Example request

```bash
curl -s "http://localhost/api/v1/reports?skip=0&limit=10"
```

#### Example response

```json
{
  "total": 142,
  "items": [
    {
      "id": 142,
      "title": "Q2 HR onboarding",
      "report_type": "hr",
      "amount": null,
      "date": "2026-06-18",
      "status": "submitted",
      "created_at": "2026-06-18T14:22:00Z",
      "updated_at": "2026-06-18T14:22:00Z"
    },
    {
      "id": 141,
      "title": "Server renewal",
      "report_type": "expense",
      "amount": 2450.00,
      "date": "2026-06-15",
      "status": "approved",
      "created_at": "2026-06-15T09:10:00Z",
      "updated_at": "2026-06-16T11:05:00Z"
    }
  ]
}
```

#### Status codes

| Code | Meaning |
|------|---------|
| 200 | Successful list |
| 422 | Invalid query parameter format |

---

### Create Report

```text
POST /api/v1/reports
```

Creates a new business report.

#### Request body

| Field | Type | Required | Constraints |
|-------|------|----------|-------------|
| `title` | string | yes | 1-255 characters |
| `report_type` | string | yes | One of `revenue`, `expense`, `project`, `hr` |
| `amount` | number | no | Decimal, two places suggested |
| `date` | string (ISO 8601 date) | yes | `YYYY-MM-DD` |
| `status` | string | no | Defaults to `draft`; one of `draft`, `submitted`, `approved` |

#### Example request

```bash
curl -s -X POST "http://localhost/api/v1/reports" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Monthly revenue",
    "report_type": "revenue",
    "amount": 12500.50,
    "date": "2026-06-20",
    "status": "approved"
  }'
```

#### Example response

```json
{
  "id": 143,
  "title": "Monthly revenue",
  "report_type": "revenue",
  "amount": 12500.50,
  "date": "2026-06-20",
  "status": "approved",
  "created_at": "2026-06-20T09:00:00Z",
  "updated_at": "2026-06-20T09:00:00Z"
}
```

#### Status codes

| Code | Meaning |
|------|---------|
| 201 | Report created |
| 422 | Validation error (missing field, bad enum, malformed date) |

---

### Get Single Report

```text
GET /api/v1/reports/{id}
```

#### Example request

```bash
curl -s "http://localhost/api/v1/reports/143"
```

#### Example response

```json
{
  "id": 143,
  "title": "Monthly revenue",
  "report_type": "revenue",
  "amount": 12500.50,
  "date": "2026-06-20",
  "status": "approved",
  "created_at": "2026-06-20T09:00:00Z",
  "updated_at": "2026-06-20T09:00:00Z"
}
```

#### Status codes

| Code | Meaning |
|------|---------|
| 200 | Report found |
| 404 | Report not found |
| 422 | Invalid ID format |

---

### Update Report

```text
PUT /api/v1/reports/{id}
```

Full replacement of a report. Omitted optional fields reset to `null` or default values. Use `PATCH` in a real product for partial updates.

#### Example request

```bash
curl -s -X PUT "http://localhost/api/v1/reports/143" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Monthly revenue - revised",
    "report_type": "revenue",
    "amount": 13200.00,
    "date": "2026-06-20",
    "status": "approved"
  }'
```

#### Example response

```json
{
  "id": 143,
  "title": "Monthly revenue - revised",
  "report_type": "revenue",
  "amount": 13200.00,
  "date": "2026-06-20",
  "status": "approved",
  "created_at": "2026-06-20T09:00:00Z",
  "updated_at": "2026-06-20T10:15:00Z"
}
```

#### Status codes

| Code | Meaning |
|------|---------|
| 200 | Report updated |
| 404 | Report not found |
| 422 | Validation error |

---

### Delete Report

```text
DELETE /api/v1/reports/{id}
```

#### Example request

```bash
curl -s -X DELETE "http://localhost/api/v1/reports/143"
```

#### Example response

```json
{
  "deleted": true
}
```

#### Status codes

| Code | Meaning |
|------|---------|
| 200 | Report deleted |
| 404 | Report not found |
| 422 | Invalid ID format |

---

### Aggregated Metrics

```text
GET /api/v1/metrics
```

Returns high-level totals and counts for dashboard widgets.

#### Example request

```bash
curl -s "http://localhost/api/v1/metrics"
```

#### Example response

```json
{
  "total_reports": 142,
  "by_type": {
    "revenue": 38,
    "expense": 45,
    "project": 34,
    "hr": 25
  },
  "by_status": {
    "draft": 12,
    "submitted": 30,
    "approved": 100
  },
  "total_amount": 284790.55,
  "average_amount": 2005.57
}
```

#### Status codes

| Code | Meaning |
|------|---------|
| 200 | Metrics returned |

---

## Error Format

All validation and client errors follow the standard FastAPI / Pydantic error shape:

```json
{
  "detail": [
    {
      "loc": ["body", "report_type"],
      "msg": "value is not a valid enumeration member; permitted: 'revenue', 'expense', 'project', 'hr'",
      "type": "type_error.enum"
    }
  ]
}
```

## OpenAPI / Swagger UI

When the backend is running, interactive docs are available at:

```
http://localhost/api/v1/docs
```

This is generated automatically from FastAPI route definitions and Pydantic models.
