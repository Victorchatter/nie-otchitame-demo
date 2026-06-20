# Local Setup Guide

## Requirements

- Docker Engine 24.0+ and Docker Compose v2
- (Optional) Kubernetes cluster (kind, minikube, or a cloud-managed cluster)
- (Optional) Python 3.11+ and Node.js 20+ for native development

The fastest path is Docker Compose. It starts PostgreSQL, FastAPI, Nginx, and the built frontend with a single command.

---

## Quick Start with Docker Compose

```bash
# From the repository root
cd /c/Users/Victor/ПРОЕКТ-ДЖОБС
docker compose -f devops/docker-compose.yml up --build -d
```

After the containers start:

- Dashboard: http://localhost
- API docs: http://localhost/api/v1/docs
- Health check: http://localhost/health

### Stop the stack

```bash
docker compose -f devops/docker-compose.yml down -v
```

The `-v` flag removes the named PostgreSQL volume. Omit it to keep data between restarts.

---

## Kubernetes One-Liner

For a local Kubernetes cluster with `kubectl` and the manifest files in `devops/k8s/`:

```bash
kubectl apply -k devops/k8s/
```

This deploys:

- ConfigMap with non-secret configuration
- Secret with database credentials
- PostgreSQL StatefulSet and Service
- FastAPI Deployment and Service
- React/Nginx Deployment and Service
- Ingress on `/`

Expose locally with port-forward:

```bash
kubectl port-forward svc/nginx 8080:80
```

Then open http://localhost:8080.

---

## Native Development

### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

The backend runs on http://localhost:8000 and serves Swagger at http://localhost:8000/api/v1/docs.

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server runs on http://localhost:5173.

### Run tests

```bash
# Backend
cd backend
pytest

# Frontend E2E
cd frontend
npm run test:e2e
```

---

## Environment Variables

### Backend

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `DATABASE_URL` | yes | `postgresql://postgres:postgres@db:5432/nie_otchitame` | SQLAlchemy database URI |
| `API_V1_PREFIX` | no | `/api/v1` | API route prefix |
| `LOG_LEVEL` | no | `info` | Uvicorn/FastAPI log level |
| `CORS_ORIGINS` | no | `http://localhost,http://localhost:5173` | Allowed frontend origins |

### Frontend

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `VITE_API_BASE_URL` | no | `/api/v1` | Base path for API calls |

### PostgreSQL

| Variable | Required | Default | Purpose |
|----------|----------|---------|---------|
| `POSTGRES_USER` | yes | `postgres` | Database owner |
| `POSTGRES_PASSWORD` | yes | `postgres` | Database password |
| `POSTGRES_DB` | yes | `nie_otchitame` | Application database name |

### Docker Compose overrides

Create `devops/.env` to override defaults without changing tracked files:

```bash
POSTGRES_PASSWORD=change-me-in-production
LOG_LEVEL=debug
```

---

## First-Time Database Setup

When running with Docker Compose, migrations are executed automatically in an init container. If you need to run them manually:

```bash
docker compose -f devops/docker-compose.yml exec backend alembic upgrade head
```

To seed sample reports for a quick demo:

```bash
docker compose -f devops/docker-compose.yml exec backend python -m scripts.seed
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Port 80 already in use | Change the host port in `devops/docker-compose.yml` or stop the conflicting service. |
| Database connection refused | Wait for the `db` container to finish starting; the backend depends on it. |
| Frontend shows blank page | Check the browser console for CORS errors and verify `CORS_ORIGINS`. |
| Migrations fail | Ensure `alembic.ini` points to the same database as `DATABASE_URL`. |
