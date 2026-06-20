# Nie Otchitame Demo — ПРОЕКТ-ДЖОБС

A full-stack, DevOps-ready demo application built to demonstrate the competencies required for the **"Разработчик софтуерни продукти и системи, проект Ние Отчитаме"** position at **КРИЕЙТИВ ДИДЖИТАЛ ЕНДЖИНИЕРС ООД**.

It is a lightweight ERP-lite reporting module where users can create, manage and analyse business reports (revenue, expenses, projects, HR). The project intentionally touches as many of the advertised required and bonus skills as possible, from Python and JavaScript to Docker, Kubernetes, CI/CD, automated testing and Linux administration.

---

## Quick start

```bash
# 1. Copy the example environment and stand up the stack
cd "C:\Users\Victor\ПРОЕКТ-ДЖОБС"
./devops/scripts/setup.sh
docker compose up --build -d

# 2. Run migrations
./devops/scripts/migrate.sh

# 3. Seed sample data (optional)
cd polyglot/node && npm start

# 4. Open the dashboard
open http://localhost
```

> On Windows without WSL, run the equivalent commands from PowerShell or use Docker Desktop with WSL2.

---

## Repository structure

```text
.
├── backend/              # Python FastAPI + SQLAlchemy + PostgreSQL + pytest
├── frontend/             # React + Vite + TypeScript + Playwright
├── devops/               # Docker, K8s, Azure DevOps, Jenkins, nginx, systemd, scripts
├── polyglot/             # Java/Maven, PHP and Node.js utilities
├── docs/                 # Architecture, API docs, setup and skill mapping
├── PROJECT_PLAN.md       # Original plan and API contract
├── docker-compose.yml    # Full local stack
├── azure-pipelines.yml   # Azure DevOps CI/CD
├── Jenkinsfile           # Jenkins CI/CD alternative
└── README.md             # This file
```

---

## Technology stack

| Layer | Technology |
|-------|------------|
| Backend | Python 3.11, FastAPI, SQLAlchemy 2.0, Pydantic v2, Alembic |
| Frontend | React 18, Vite, TypeScript, plain CSS |
| Database | PostgreSQL 16 (production), SQLite (tests) |
| Testing | pytest (unit + integration), JUnit 5, Playwright (cross-browser UI) |
| Containers | Docker, Docker Compose |
| Orchestration | Kubernetes manifests in `devops/k8s/` |
| CI/CD | Azure DevOps (`azure-pipelines.yml`) and Jenkins (`Jenkinsfile`) |
| Reverse proxy | nginx |
| Admin / OS | systemd service, Bash scripts, Linux daemon concepts |
| Extras | Java 17 + Maven, PHP CLI, Node.js seed script |

---

## Job-posting skill coverage

| Job requirement | Where it is demonstrated |
|-------------------|--------------------------|
| Vibe coding / Claude / MCP agents | This repo was built with Claude Code subagents; see `docs/AGENTS.md` |
| Python | `backend/` |
| JavaScript / TypeScript | `frontend/`, `polyglot/node/` |
| Java | `polyglot/java-report-utils/` |
| PHP / Node.js (bonus) | `polyglot/php/`, `polyglot/node/` |
| PostgreSQL / SQL | `backend/app/models.py`, `backend/alembic/`, `docker-compose.yml` |
| Unit / UI / cross-platform tests | `backend/tests/`, `frontend/e2e/`, `polyglot/java-report-utils/src/test/` |
| Git | `.gitignore`, conventional repo layout |
| Azure DevOps | `azure-pipelines.yml` |
| Kubernetes | `devops/k8s/*.yaml` |
| Docker / containerization | `docker-compose.yml`, `backend/Dockerfile`, `frontend/Dockerfile` |
| Hyper-V / VMware | Documented as supported host platforms in `docs/SETUP.md` |
| Maven / Jenkins | `polyglot/java-report-utils/pom.xml`, `Jenkinsfile` |
| Linux / Daemons / Bash | `devops/scripts/*.sh`, `devops/systemd/nie-otchitame.service` |
| Networking / OS admin | `devops/nginx.conf`, K8s services/ingress |
| DevOps / Agile | `docs/DEVOPS.md`, CI/CD pipelines, iterative subagent delivery |
| ERP domain | Reporting module, dashboard and metrics |

---

## Running tests

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate        # Windows
# source .venv/bin/activate   # Linux/macOS
pip install -r requirements.txt
pytest
```

### Frontend

```bash
cd frontend
npm install
npm run build
npm run test:e2e
```

### Java utility

```bash
cd polyglot/java-report-utils
mvn test
```

---

## Deployment options

- **Local:** `docker compose up --build` (see `devops/scripts/`)
- **Kubernetes:** `kubectl apply -f devops/k8s/` (fill in `devops/k8s/secret.yaml` first)
- **CI/CD:** push to `main` triggers `azure-pipelines.yml` or `Jenkinsfile`

Detailed instructions are in `docs/SETUP.md` and `docs/DEVOPS.md`.

---

## Documentation

- [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) — system design and data model
- [`docs/API.md`](docs/API.md) — REST API reference
- [`docs/SETUP.md`](docs/SETUP.md) — installation and runbook
- [`docs/DEVOPS.md`](docs/DEVOPS.md) — CI/CD and deployment
- [`docs/SKILL_MAPPING.md`](docs/SKILL_MAPPING.md) — exhaustive mapping to the job posting
- [`docs/AGENTS.md`](docs/AGENTS.md) — how the project was built with AI agents

---

## Notes

- This is a demonstrative project, not a production ERP. The goal is to show breadth and working knowledge across the advertised stack.
- All external integrations (container registry, K8s ingress host, secrets) use placeholder values that are easy to replace for a real environment.
- English is the working language for code and documentation, matching the job-posting requirement for excellent English.

---

Built with agentic coding in Claude Code for **КРИЕЙТИВ ДИДЖИТАЛ ЕНДЖИНИЕРС ООД** — *Nie Otchitame* demo.
