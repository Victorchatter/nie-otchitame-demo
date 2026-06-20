# Nie Otchitame Demo — Documentation

Welcome to the documentation for the **"Nie Otchitame"** demo project, built for the КРИЕЙТИВ ДИДЖИТАЛ ЕНДЖИНИЕРС ООД software-developer role.

This is a concise, production-oriented demo: a full-stack ERP-lite reporting module with Python, React, PostgreSQL, Docker, Kubernetes, and CI/CD pipelines. The docs below explain the system, how to run it, and how every required skill maps to a concrete file in the repository.

## Documentation Index

| Document | What you will find |
|----------|-------------------|
| [ARCHITECTURE.md](./ARCHITECTURE.md) | System overview, component diagram, data model, request flow, and design rationale. |
| [API.md](./API.md) | Complete REST API contract with endpoints, request/response examples, and error formats. |
| [SETUP.md](./SETUP.md) | Docker Compose quick start, Kubernetes one-liner, native dev commands, and environment variables. |
| [DEVOPS.md](./DEVOPS.md) | CI/CD with Azure DevOps and Jenkins, K8s deployment strategy, and systemd service setup. |
| [SKILL_MAPPING.md](./SKILL_MAPPING.md) | Table mapping every job-posting skill to the exact file(s) that demonstrate it. |
| [AGENTS.md](./AGENTS.md) | Note on how the project was built using Claude Code subagents and agentic "vibe coding". |

## Quick Orientation

- **Frontend**: React + Vite + TypeScript dashboard — `frontend/`
- **Backend**: Python FastAPI REST service — `backend/`
- **Database**: PostgreSQL with Alembic migrations — `backend/alembic/`
- **DevOps**: Docker, K8s, CI/CD, Nginx, systemd — `devops/`
- **Polyglot utilities**: Java/Maven, PHP, Node — `polyglot/`
- **Project plan**: High-level blueprint — `PROJECT_PLAN.md` (repo root)

## Start the Demo

```bash
cd /c/Users/Victor/ПРОЕКТ-ДЖОБС
docker compose -f devops/docker-compose.yml up --build -d
```

Then open http://localhost.

---

*For questions or clarifications, the inline comments and OpenAPI docs at `/api/v1/docs` provide the source of truth.*
