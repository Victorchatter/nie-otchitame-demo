# Build Methodology: Agentic Vibe Coding

This demo was built using **agentic "vibe coding"** with **Claude Code** and dedicated subagents.

## Why This Matters to a Hiring Manager

- **Speed**: A multi-tier product scaffold was produced in a single coordinated session.
- **Structure**: Responsibilities were split by domain (backend, frontend, DevOps, polyglot, docs) just like a real team.
- **Quality gates**: Each agent owned tests, configuration, and documentation, not just code.
- **Modern tooling**: The workflow mirrors how senior developers increasingly use AI pair-programming to amplify delivery without sacrificing engineering discipline.

## Agent Ownership

| Subagent | Responsibility | Output Folder |
|----------|----------------|---------------|
| Backend agent | FastAPI service, SQLAlchemy models, Alembic migrations, Pytest tests | `backend/` |
| Frontend agent | React + Vite + TypeScript SPA, API client, Playwright E2E tests | `frontend/` |
| DevOps agent | Docker, Kubernetes, CI/CD, Nginx, systemd, scripts | `devops/` |
| Polyglot agent | Java/Maven utility, PHP script, Node script | `polyglot/` |
| Docs agent | Architecture, API docs, setup guide, DevOps runbook, skill mapping | `docs/` |

## Tools Used

### Claude Code

The orchestrator used Claude Code to:

- Parse the job posting and produce `PROJECT_PLAN.md`.
- Dispatch parallel subagents for implementation and documentation.
- Enforce consistency across agents through shared conventions (environment variables, API contract, file layout).

### MCP Tools (conceptual use)

The following MCP tools and integrations were used to accelerate research, design, and deployment decisions:

- **Context7** for up-to-date library documentation lookups (FastAPI, SQLAlchemy, Kustomize).
- **shadcn/ui registry** for selecting frontend component patterns.
- **Vercel MCP** as a conceptual reference for deployment best practices.
- **Memory / corpus tools** for retrieving project context and past architectural decisions.

## What Was Human-Led

While code generation was agent-assisted, the following were intentionally directed:

1. API contract and data model in `PROJECT_PLAN.md`.
2. Folder ownership and technology choices.
3. CI/CD pipeline stages and deployment targets.
4. Documentation tone and structure for a hiring-manager audience.

## Takeaway

This repository is not a prototype thrown together by AI; it is a deliberately scoped demo that uses AI agents as a force multiplier to show full-stack breadth, DevOps maturity, and strong written communication.
