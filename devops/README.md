# Nie Otchitame — DevOps Artifacts

This folder contains all infrastructure, deployment, and operational configuration for the **ПРОЕКТ-ДЖОБС / Nie Otchitame** demo.

## Folder layout

```text
devops/
├── README.md
├── nginx.conf                  # Reverse proxy: /api → backend, / → frontend
├── scripts/
│   ├── setup.sh                # One-time local setup (.env + docker network)
│   ├── migrate.sh              # Run Alembic migrations inside backend container
│   ├── deploy.sh               # docker-compose up/build helper
│   └── health-check.sh         # curl backend /health and frontend via nginx
├── k8s/
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml             # Template; replace base64 values
│   ├── deployment-backend.yaml
│   ├── deployment-frontend.yaml
│   ├── service-backend.yaml
│   ├── service-frontend.yaml
│   └── ingress.yaml            # Requires nginx-ingress (or adapt annotations)
└── systemd/
    └── nie-otchitame.service   # systemd unit for docker-compose stack
```

## Local run with Docker Compose

From the project root:

```bash
# 1. One-time setup (creates .env and docker network)
./devops/scripts/setup.sh

# 2. Build and start all services
./devops/scripts/deploy.sh --build

# 3. Run database migrations
./devops/scripts/migrate.sh

# 4. Verify everything responds
./devops/scripts/health-check.sh
```

Services:

| Service  | URL                          | Notes                                  |
|----------|------------------------------|----------------------------------------|
| Nginx    | http://localhost:80          | Reverse proxy + static SPA             |
| Frontend | http://localhost:3000         | Direct port if needed                  |
| Backend  | http://localhost:8000        | Direct API + `/health`                 |
| Postgres | localhost:5432               | Credentials from `.env`                |

Stop the stack:

```bash
./devops/scripts/deploy.sh --down
```

## Kubernetes deployment

Apply manifests in order. The `secret.yaml` contains placeholder base64 values and **must be replaced** with real credentials before applying in a real cluster.

```bash
kubectl apply -f devops/k8s/namespace.yaml
kubectl apply -f devops/k8s/configmap.yaml
kubectl apply -f devops/k8s/secret.yaml          # edit first
kubectl apply -f devops/k8s/deployment-backend.yaml
kubectl apply -f devops/k8s/deployment-frontend.yaml
kubectl apply -f devops/k8s/service-backend.yaml
kubectl apply -f devops/k8s/service-frontend.yaml
kubectl apply -f devops/k8s/ingress.yaml
```

Notes:
- Container images point to `registry.example.com/nie-otchitame-*:latest`; update to your registry.
- The ingress uses `host: nie-otchitame.local` and assumes an `nginx` ingress class.
- Add TLS by uncommenting the `tls` block in `ingress.yaml` and creating the referenced secret.

## CI/CD pipelines

### Azure DevOps — `azure-pipelines.yml`

Stages:
1. **Install & Lint** — backend `ruff` and frontend `eslint`.
2. **Test** — backend `pytest` and frontend Playwright E2E.
3. **Build** — Docker images for backend and frontend.
4. **Push** — push tagged images to a container registry (only on `main`).

Configure a service connection named `nie-otchitame-registry` in Azure DevOps.

### Jenkins — `Jenkinsfile`

Declarative pipeline with the same stages. Requires:
- `container-registry-url` credential.
- `registry-credentials-id` credential for `docker.withRegistry`.
- Python, Node, and Playwright dependencies on the agent.

## systemd service

Install on a Linux host that runs the compose stack directly:

```bash
sudo cp devops/systemd/nie-otchitame.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now nie-otchitame.service
```

The unit expects the project checked out at `/opt/nie-otchitame`. Adjust `WorkingDirectory` if needed.

## Design choices

- **Nginx reverse proxy** centralizes routing: `/api` goes to FastAPI, everything else to the React/Vite static SPA, matching the architecture in `PROJECT_PLAN.md`.
- **Database healthcheck** ensures `backend` only starts after Postgres is ready.
- **K8s manifests are explicit** rather than a Helm chart, keeping the demo readable without extra tooling.
- **CI pipelines only push on `main`** to avoid polluting the registry from pull-request builds.
- **Scripts use `docker compose`** (v2) and assume a local Linux/macOS/WSL environment; on Windows run them inside WSL or Git Bash.
