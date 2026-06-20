#!/usr/bin/env bash
# Health check for Nie Otchitame local services.
# Verifies Nginx, backend /health, and frontend index.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

NGINX_URL="http://localhost:80"
BACKEND_DIRECT_URL="http://localhost:8000/health"

echo "==> Checking service health"

# Backend direct health endpoint
if curl -fsS "${BACKEND_DIRECT_URL}" >/dev/null; then
    echo "  OK: backend ${BACKEND_DIRECT_URL}"
else
    echo "  FAIL: backend ${BACKEND_DIRECT_URL}"
    exit 1
fi

# Nginx frontend
if curl -fsS "${NGINX_URL}" >/dev/null; then
    echo "  OK: frontend via nginx ${NGINX_URL}"
else
    echo "  FAIL: frontend via nginx ${NGINX_URL}"
    exit 1
fi

# Nginx API proxy
if curl -fsS "${NGINX_URL}/api/health" >/dev/null; then
    echo "  OK: API proxy via nginx ${NGINX_URL}/api/health"
else
    echo "  FAIL: API proxy via nginx ${NGINX_URL}/api/health"
    exit 1
fi

echo "==> All health checks passed."
