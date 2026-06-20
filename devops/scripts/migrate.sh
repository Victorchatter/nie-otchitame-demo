#!/usr/bin/env bash
# Run Alembic migrations inside the backend container.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
BACKEND_CONTAINER="nie-otchitame-backend"

echo "==> Running Alembic migrations in ${BACKEND_CONTAINER}"

cd "${PROJECT_ROOT}"

docker compose exec "${BACKEND_CONTAINER}" alembic upgrade head

echo "==> Migrations applied."
