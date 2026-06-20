# ПРОЕКТ-ДЖОБС / Nie Otchitame Demo

Demo project built to demonstrate the full stack and DevOps competencies required by the **"Разработчик софтуерни продукти и системи, проект Ние Отчитаме"** job posting from КРИЕЙТИВ ДИДЖИТАЛ ЕНДЖИНИЕРС ООД.

## Architecture

```text
┌─────────────────┐      ┌──────────────────┐      ┌──────────────┐
│   React/Vite    │──────▶   FastAPI (PY)   │──────▶  PostgreSQL  │
│   Dashboard     │      │   REST API       │      │   (Alembic)  │
└─────────────────┘      └──────────────────┘      └──────────────┘
        │                         │
        └─────────Nginx───────────┘   (reverse proxy + static files)
```

## Domain

A minimal ERP-lite reporting module called **"Nie Otchitame"**.
A `Report` represents a business record such as revenue, expense, project milestone or HR entry.

## API Contract (v1)

Base path: `/api/v1`

| Method | Path | Description |
|--------|------|-------------|
| GET | `/health` | `{ "status": "ok" }` |
| GET | `/api/v1/reports` | List reports (`skip`, `limit` query params) |
| POST | `/api/v1/reports` | Create a report |
| GET | `/api/v1/reports/{id}` | Read a single report |
| PUT | `/api/v1/reports/{id}` | Update a report |
| DELETE | `/api/v1/reports/{id}` | Delete a report |
| GET | `/api/v1/metrics` | Aggregated totals / counts |

### Report schema

```json
{
  "id": 1,
  "title": "Monthly revenue",
  "report_type": "revenue",
  "amount": 12500.50,
  "date": "2026-06-20",
  "status": "approved",
  "created_at": "2026-06-20T09:00:00Z",
  "updated_at": "2026-06-20T09:00:00Z"
}
```

Allowed values:
- `report_type`: `revenue`, `expense`, `project`, `hr`
- `status`: `draft`, `submitted`, `approved`

## Folder Ownership

| Folder | Owner agent | Purpose |
|--------|-------------|---------|
| `backend/` | Backend agent | Python FastAPI service, models, migrations, tests |
| `frontend/` | Frontend agent | React + Vite + TypeScript SPA, Playwright tests |
| `devops/` | DevOps agent | Docker, K8s, CI/CD, nginx, systemd, scripts |
| `polyglot/` | Polyglot agent | Java/Maven utility, PHP script, Node script |
| `docs/` | Docs agent | Architecture, runbooks, skill mapping |

## Skill Mapping (job posting → artifact)

- Vibe coding / Claude / MCP → this project itself is built with agentic coding via Claude Code; documented in README.
- Python → `backend/`
- JavaScript / TypeScript → `frontend/`
- Java → `polyglot/java-report-utils/`
- PHP / Node.js → `polyglot/`
- PostgreSQL / SQL → `backend/` models + migrations + `devops/docker-compose.yml`
- Unit tests / UI tests / Cross-platform → `backend/tests/` + `frontend/e2e/`
- Git → `.gitignore`, conventional commit-friendly structure.
- Azure DevOps → `devops/azure-pipelines.yml`
- Kubernetes → `devops/k8s/`
- Docker / containerization → `devops/docker-compose.yml`, Dockerfiles.
- Hyper-V / VMware → documented as supported host platforms in README.
- Maven / Jenkins → `polyglot/java-report-utils/pom.xml`, `devops/Jenkinsfile`
- Linux / Daemons / Bash → `devops/scripts/*.sh`, `devops/systemd/nie-otchitame.service`
- Networking / OS admin → `devops/nginx.conf`, `devops/k8s/`, README.
- DevOps / Agile → CI/CD pipelines, README section.
- ERP domain → reporting module domain model and dashboard.
