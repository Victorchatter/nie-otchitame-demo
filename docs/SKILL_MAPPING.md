# Skill Mapping

The table below maps every skill from the **"Разработчик софтуерни продукти и системи, проект Ние Отчитаме"** job posting to the exact file(s) or folders in this repository that demonstrate it.

## Core Development Skills

| Job Posting Skill | Evidence in Repository | Notes |
|-------------------|------------------------|-------|
| Python | `backend/app/main.py`, `backend/app/models.py`, `backend/app/schemas.py`, `backend/app/crud.py`, `backend/tests/` | FastAPI service with Pydantic, SQLAlchemy, and pytest coverage. |
| JavaScript / TypeScript | `frontend/src/main.tsx`, `frontend/src/App.tsx`, `frontend/src/api/reports.ts`, `frontend/e2e/` | React SPA built with Vite; strongly typed components and API clients. |
| Java | `polyglot/java-report-utils/pom.xml`, `polyglot/java-report-utils/src/main/java/` | Maven-based utility demonstrating Java build tooling and report calculations. |
| PHP | `polyglot/php/` | Standalone PHP script for report transformation or export. |
| Node.js | `polyglot/node/`, `frontend/package.json` | CLI/scripting use plus frontend toolchain. |
| HTML / CSS / DOM | `frontend/src/App.tsx`, `frontend/src/index.css`, `frontend/index.html` | Modern component-based UI styling. |

## Data & Persistence

| Job Posting Skill | Evidence in Repository | Notes |
|-------------------|------------------------|-------|
| PostgreSQL / SQL | `backend/app/models.py`, `backend/alembic/`, `devops/docker-compose.yml`, `devops/k8s/base/postgres-deployment.yaml` | Declarative model, migrations, persistent volume, and SQL queries via SQLAlchemy. |
| Data modeling | `docs/ARCHITECTURE.md`, `backend/app/models.py`, `backend/app/schemas.py` | Normalized `reports` table with enums, audit columns, and validation. |
| Migrations | `backend/alembic/`, `backend/alembic.ini` | Alembic revision files for schema versioning. |

## Testing & Quality

| Job Posting Skill | Evidence in Repository | Notes |
|-------------------|------------------------|-------|
| Unit tests | `backend/tests/`, `polyglot/java-report-utils/src/test/java/` | Pytest and JUnit test suites. |
| UI / E2E tests | `frontend/e2e/`, `frontend/playwright.config.ts` | Playwright browser tests covering CRUD flows. |
| Cross-platform compatibility | `.gitignore`, Dockerfiles, `devops/docker-compose.yml` | Runs on Windows, macOS, and Linux via containers. |
| Test automation in CI | `devops/azure-pipelines.yml`, `devops/Jenkinsfile` | Backend, frontend, and E2E tests run on every commit. |

## Version Control & Collaboration

| Job Posting Skill | Evidence in Repository | Notes |
|-------------------|------------------------|-------|
| Git | `.gitignore`, branch structure (`main`), conventional commit-friendly layout | Clean repo with language-specific ignores. |
| Code review / PR workflow | `devops/azure-pipelines.yml` triggers on PRs | CI gates every pull request before merge. |

## DevOps & Infrastructure

| Job Posting Skill | Evidence in Repository | Notes |
|-------------------|------------------------|-------|
| Docker / containerization | `devops/Dockerfile.backend`, `devops/Dockerfile.frontend`, `devops/docker-compose.yml`, `.dockerignore` | Multi-stage builds and local orchestration. |
| Kubernetes | `devops/k8s/base/`, `devops/k8s/overlays/staging/`, `devops/k8s/overlays/production/` | Kustomize manifests for namespace, deployments, services, ingress. |
| Azure DevOps | `devops/azure-pipelines.yml` | Full build-test-deploy pipeline for ACR and AKS. |
| Jenkins | `devops/Jenkinsfile` | Declarative pipeline for on-premise Jenkins. |
| Linux / Server administration | `devops/systemd/nie-otchitame.service`, `devops/scripts/*.sh` | systemd unit and Bash helper scripts. |
| Hyper-V / VMware | Documented in `docs/SETUP.md` and `docs/DEVOPS.md` | Jenkins agents and deployment VMs can run on these hypervisors. |
| Networking / OS administration | `devops/nginx.conf`, `devops/k8s/base/ingress.yaml`, `devops/k8s/base/configmap.yaml` | Reverse proxy, routing, DNS, and port configuration. |
| Maven | `polyglot/java-report-utils/pom.xml` | Java build, dependency management, and test execution. |
| Bash scripting | `devops/scripts/*.sh` | Helper scripts for setup, backups, and health checks. |

## Methodology & Domain

| Job Posting Skill | Evidence in Repository | Notes |
|-------------------|------------------------|-------|
| Agile / DevOps mindset | CI/CD pipelines, incremental deliverables, `PROJECT_PLAN.md` folder ownership | Continuous integration and environment promotion. |
| ERP / business systems | Domain model and dashboard for revenue, expense, project, and HR reports | Real-world ERP-lite reporting module. |
| Agentic coding / vibe coding / Claude / MCP | `docs/AGENTS.md`, `PROJECT_PLAN.md` | Entire demo built with Claude Code and subagents; MCP tools used conceptually for deployment and documentation. |

## How to Verify a Skill

1. Pick a row above.
2. Open the listed file(s).
3. Read the inline comments or run the associated command from `docs/SETUP.md`.
4. Check `docs/ARCHITECTURE.md` for how the component fits into the system.
