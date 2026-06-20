# Nie Otchitame — Backend

FastAPI + SQLAlchemy backend for the **Nie Otchitame** reporting ERP-lite demo.

## Quick start

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows PowerShell
# source .venv/bin/activate    # Linux/macOS
pip install -r requirements.txt
```

Create a `.env` file (optional in dev):

```dotenv
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nie_otchitame
# CORS_ORIGINS=http://localhost:5173 http://localhost:3000
```

Run the application:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

Health check: `GET http://localhost:8000/health`

## Run migrations (Alembic)

The included initial migration creates the `reports` table.

```bash
# SQLite (default, no extra setup)
alembic upgrade head

# PostgreSQL
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/nie_otchitame
alembic upgrade head

# Generate a new migration after model changes
alembic revision --autogenerate -m "add users table"
```

## Run tests

Tests use an SQLite in-memory database and the FastAPI `TestClient`; no external services are required.

```bash
pytest
```

## API endpoints

Base path: `/api/v1`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | Health check: `{ "status": "ok" }` |
| GET | `/api/v1/reports` | List reports (`skip`, `limit`) |
| POST | `/api/v1/reports` | Create a report |
| GET | `/api/v1/reports/{id}` | Read a report |
| PUT | `/api/v1/reports/{id}` | Update a report (partial/full) |
| DELETE | `/api/v1/reports/{id}` | Delete a report |
| GET | `/api/v1/metrics` | Aggregated totals by status and type |

## Docker

Build and run:

```bash
docker build -t nie-otchitame-backend .
docker run -p 8000:8000 -e DATABASE_URL=postgresql://... nie-otchitame-backend
```

## Environment variables

| Variable | Default | Description |
|----------|---------|-------------|
| `DATABASE_URL` | `sqlite:///./nie_otchitame.db` | SQLAlchemy database URL |
| `CORS_ORIGINS` | `http://localhost:3000 http://localhost:5173` | Allowed CORS origins |
| `DEBUG` | `False` | SQLAlchemy query echo |

## Project notes

- SQLAlchemy 2.0 `Mapped` / `mapped_column` syntax.
- Pydantic v2 request/response models.
- Alembic migrations live in `alembic/versions/`.
- SQLite is used for local dev and tests; production target is PostgreSQL.
