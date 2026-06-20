#!/usr/bin/env bash
# One-time local setup for ПРОЕКТ-ДЖОБС / Nie Otchitame
# Creates .env from template and the docker bridge network.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"
ENV_FILE="${PROJECT_ROOT}/.env"

echo "==> Running local setup for Nie Otchitame"

# Create .env if missing
if [[ ! -f "${ENV_FILE}" ]]; then
    cat > "${ENV_FILE}" <<'EOF'
# Local environment for Nie Otchitame (docker-compose)
POSTGRES_USER=nie_otchitame
POSTGRES_PASSWORD=nie_otchitame_dev
POSTGRES_DB=nie_otchitame
DATABASE_URL=postgresql+asyncpg://nie_otchitame:nie_otchitame_dev@db:5432/nie_otchitame
BACKEND_PORT=8000
EOF
    echo "Created ${ENV_FILE} with defaults."
else
    echo "${ENV_FILE} already exists; leaving untouched."
fi

# Ensure docker network exists (compose also creates this automatically)
NETWORK_NAME="nie-otchitame-net"
if ! docker network inspect "${NETWORK_NAME}" >/dev/null 2>&1; then
    echo "Creating docker network: ${NETWORK_NAME}"
    docker network create "${NETWORK_NAME}"
else
    echo "Docker network ${NETWORK_NAME} already exists."
fi

echo "==> Setup complete. Next steps:"
echo "    1. Review ${ENV_FILE}"
echo "    2. Run: ${SCRIPT_DIR}/deploy.sh"
