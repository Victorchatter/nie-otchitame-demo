# Architecture Overview

## Project Purpose

**"Nie Otchitame"** is a minimal ERP-lite reporting module built as a full-stack demo for the КРИЕЙТИВ ДИДЖИТАЛ ЕНДЖИНИЕРС ООД software-developer role. It shows how a modern web product can be designed, implemented, tested, containerized, and delivered with production-grade DevOps practices.

The module lets users create, read, update, delete, and aggregate business reports (revenue, expense, project, HR) through a React dashboard backed by a Python FastAPI service and PostgreSQL.

## High-Level System

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                              Client Browser                              │
└─────────────────────────────────┬───────────────────────────────────────┘
                                  │ HTTPS / HTTP
                                  ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                              Nginx (reverse proxy)                       │
│   • Serves static React build under `/`                                  │
│   • Proxies `/api/v1` to FastAPI                                         │
└──────────────┬───────────────────────────────────────┬──────────────────┘
               │                                       │
               ▼                                       ▼
┌──────────────────────────┐            ┌───────────────────────────────┐
│   React + Vite + TypeScript│            │   Python FastAPI REST API     │
│   Dashboard SPA            │            │   `backend/app/main.py`       │
│   `frontend/src/App.tsx`   │            │   Pydantic validation           │
│   Playwright E2E tests     │            │   SQLAlchemy + Alembic          │
└──────────────────────────┘            │   Pytest unit tests           │
                                        └───────────────┬───────────────┘
                                                        │
                                                        │ SQLAlchemy
                                                        ▼
                                        ┌───────────────────────────────┐
                                        │   PostgreSQL 15+              │
                                        │   `devops/docker-compose.yml` │
                                        │   Alembic migrations          │
                                        └───────────────────────────────┘
```

## Component Responsibilities

| Component | Technology | Key File(s) | Responsibility |
|-----------|------------|-------------|----------------|
| Frontend | React 18, Vite, TypeScript | `frontend/src/main.tsx`, `frontend/src/App.tsx`, `frontend/src/api/reports.ts` | Interactive reporting dashboard, form validation, data fetching, E2E tests |
| Reverse Proxy | Nginx | `devops/nginx.conf` | TLS termination, static asset delivery, API routing, compression |
| Backend API | Python 3.11, FastAPI | `backend/app/main.py`, `backend/app/schemas.py`, `backend/app/crud.py` | REST endpoints, validation, business logic, OpenAPI generation |
| ORM / Migrations | SQLAlchemy, Alembic | `backend/app/models.py`, `backend/alembic/` | Declarative data model, schema versioning |
| Database | PostgreSQL 15+ | `devops/docker-compose.yml` | Persistent storage, JSON-compatible metadata, ACID transactions |
| Tests | Pytest, Playwright | `backend/tests/`, `frontend/e2e/` | Unit, integration, and browser-level regression coverage |
| Polyglot utilities | Java/Maven, PHP, Node | `polyglot/java-report-utils/`, `polyglot/php/`, `polyglot/node/` | Demonstrates multi-language fluency required by the posting |

## Data Model

### `reports` table

| Column | Type | Constraints | Notes |
|--------|------|-------------|-------|
| `id` | `SERIAL` | PRIMARY KEY | Auto-increment surrogate key |
| `title` | `VARCHAR(255)` | NOT NULL | Human-readable report title |
| `report_type` | `VARCHAR(32)` | NOT NULL, CHECK IN (`revenue`, `expense`, `project`, `hr`) | Domain discriminator |
| `amount` | `DECIMAL(12,2)` | | Optional monetary value |
| `date` | `DATE` | NOT NULL | Business date of the report |
| `status` | `VARCHAR(32)` | NOT NULL DEFAULT `draft`, CHECK IN (`draft`, `submitted`, `approved`) | Workflow state |
| `created_at` | `TIMESTAMP WITH TIME ZONE` | NOT NULL DEFAULT `now()` | Audit column |
| `updated_at` | `TIMESTAMP WITH TIME ZONE` | NOT NULL DEFAULT `now()` | Audit column, updated on mutation |

### Corresponding Pydantic schema

```python
class Report(BaseModel):
    id: int
    title: str
    report_type: Literal["revenue", "expense", "project", "hr"]
    amount: Decimal | None
    date: date
    status: Literal["draft", "submitted", "approved"]
    created_at: datetime
    updated_at: datetime
```

## Request Flow Example

### Creating a new report

```text
1. User clicks "Add Report" in the React dashboard.
2. `frontend/src/api/reports.ts` POSTs JSON to `/api/v1/reports`.
3. Nginx receives the request and proxies `/api/v1/*` to the FastAPI container.
4. FastAPI validates the body with Pydantic and inserts a row via SQLAlchemy.
5. PostgreSQL commits the transaction.
6. FastAPI returns `201 Created` with the serialized `Report` object.
7. React adds the new report to the local cache and re-renders the list.
```

### Health-check flow

```text
1. Load balancer or operator calls `/health`.
2. FastAPI responds `{ "status": "ok" }` without hitting the database.
3. Kubernetes liveness/readiness probes use this to manage pod lifecycle.
```

## Design Choices

- **Single-page application (SPA)** keeps frontend deployment simple while still demonstrating component architecture, routing, and async state management.
- **FastAPI** was chosen for automatic OpenAPI docs, high-performance async handling, and minimal boilerplate.
- **PostgreSQL** rather than SQLite shows readiness for concurrent production workloads.
- **Alembic migrations** make schema changes reviewable and reversible.
- **Nginx as the single entry point** lets the whole stack run on one host or scale horizontally behind a load balancer.
