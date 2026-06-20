# DevOps & CI/CD Guide

This project demonstrates a complete delivery pipeline: automated builds, container images, Kubernetes manifests, and a systemd service for bare-metal or VM deployments.

## Container Strategy

Each tier has a dedicated Dockerfile in `devops/`:

- `devops/Dockerfile.backend` — multi-stage Python image based on `python:3.11-slim`
- `devops/Dockerfile.frontend` — Vite build stage + Nginx static serving
- `devops/nginx.conf` — reverse-proxy configuration used by the frontend container in production
- `devops/docker-compose.yml` — local orchestration of backend, frontend, Nginx, and PostgreSQL

Images are kept small by separating build and runtime stages and by using `.dockerignore` files in each tier.

## Azure DevOps Pipeline

File: `devops/azure-pipelines.yml`

The pipeline runs on every push and pull request and implements a standard build-test-deploy workflow.

```text
Trigger: main branch, pull requests to main

Stages:
  1. Build
     - Checkout source
     - Run backend tests in a container (pytest)
     - Run frontend unit tests (npm test)
     - Run frontend E2E tests (Playwright)
     - Build Docker images and push to Azure Container Registry (ACR)

  2. Deploy to Staging
     - Update image tags in k8s/overlays/staging
     - Apply manifests to the staging AKS cluster
     - Run smoke tests against staging URL

  3. Deploy to Production (manual approval gate)
     - Promote staging image tags
     - Apply manifests to the production AKS cluster
     - Run health checks and notify via Teams/Slack webhook
```

Key features:

- Secrets are stored in Azure DevOps Library variable groups and injected as K8s Secrets.
- Playwright tests execute against the containerized stack to catch integration regressions.
- The Java utility is built with Maven in a separate job to demonstrate polyglot CI capability.

## Jenkins Pipeline

File: `devops/Jenkinsfile`

A declarative Jenkinsfile is provided for organizations using on-premise Jenkins.

```groovy
pipeline {
    agent any

    stages {
        stage('Checkout') {
            steps { checkout scm }
        }
        stage('Backend Tests') {
            steps {
                dir('backend') {
                    sh 'pip install -r requirements.txt'
                    sh 'pytest --junitxml=report.xml'
                }
            }
        }
        stage('Build Images') {
            steps {
                sh 'docker compose -f devops/docker-compose.yml build'
            }
        }
        stage('Push to Registry') {
            when { branch 'main' }
            steps {
                sh 'docker tag nie-otchitame-backend registry.example.com/nie-otchitame-backend:$BUILD_NUMBER'
                sh 'docker push registry.example.com/nie-otchitame-backend:$BUILD_NUMBER'
            }
        }
        stage('Deploy to K8s') {
            when { branch 'main' }
            steps {
                sh 'kubectl set image deployment/backend backend=registry.example.com/nie-otchitame-backend:$BUILD_NUMBER -n nie-otchitame'
                sh 'kubectl rollout status deployment/backend -n nie-otchitame'
            }
        }
    }

    post {
        always {
            junit 'backend/report.xml'
        }
    }
}
```

Jenkins agents can run on Hyper-V or VMware VMs, matching the virtualization experience listed in the job posting.

## Kubernetes Deployment

Folder: `devops/k8s/`

The Kubernetes setup is organized as a Kustomize base with environment overlays.

```text
devops/k8s/
├── base/
│   ├── namespace.yaml
│   ├── configmap.yaml
│   ├── secret.yaml          # placeholders; real values injected by CI/CD
│   ├── postgres-pvc.yaml
│   ├── postgres-deployment.yaml
│   ├── postgres-service.yaml
│   ├── backend-deployment.yaml
│   ├── backend-service.yaml
│   ├── frontend-deployment.yaml
│   ├── frontend-service.yaml
│   └── ingress.yaml
└── overlays/
    ├── staging/
    │   └── kustomization.yaml
    └── production/
        └── kustomization.yaml
```

### Deployment flow

```text
1. CI/CD builds images and pushes them to a registry.
2. Image tags are patched into the overlay kustomization.
3. kubectl apply -k devops/k8s/overlays/<env> rolls out new pods.
4. Kubernetes readiness probes hit /health before routing traffic.
5. Rollout status is monitored; on failure, kubectl rollout undo reverts.
```

### Production hardening (planned)

- NetworkPolicy restricting ingress between namespaces
- PodSecurityContext with read-only root filesystem and non-root users
- Resource requests/limits on every workload
- HorizontalPodAutoscaler for backend and frontend
- TLS via cert-manager and Ingress annotations

## systemd Service

File: `devops/systemd/nie-otchitame.service`

For bare-metal or VM deployments that do not use Kubernetes, the project ships a systemd unit that runs the Docker Compose stack as a system service.

```ini
[Unit]
Description=Nie Otchitame Reporting Demo
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/opt/nie-otchitame
ExecStart=/usr/bin/docker compose -f devops/docker-compose.yml up -d
ExecStop=/usr/bin/docker compose -f devops/docker-compose.yml down

[Install]
WantedBy=multi-user.target
```

### Install the service

```bash
sudo cp devops/systemd/nie-otchitame.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now nie-otchitame.service
```

### Check status

```bash
sudo systemctl status nie-otchitame.service
sudo journalctl -u nie-otchitame.service -f
```

## Summary of DevOps Competencies Shown

| Competency | Evidence in this project |
|------------|--------------------------|
| Containerization | `devops/Dockerfile.backend`, `devops/Dockerfile.frontend`, `devops/docker-compose.yml` |
| CI/CD | `devops/azure-pipelines.yml`, `devops/Jenkinsfile` |
| Kubernetes | `devops/k8s/` Kustomize manifests |
| Linux service management | `devops/systemd/nie-otchitame.service`, `devops/scripts/*.sh` |
| Reverse proxy / networking | `devops/nginx.conf` |
| Secrets management | K8s Secret placeholders, Docker Compose `.env` pattern |
| Testing in CI | Pytest, Playwright E2E, Maven test phases |
