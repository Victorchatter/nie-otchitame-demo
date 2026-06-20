#!/usr/bin/env bash
# Docker Compose build/up helper for Nie Otchitame.
# Usage:
#   deploy.sh           # bring up all services, building if needed
#   deploy.sh --build   # force rebuild images before starting
#   deploy.sh --down    # stop and remove containers

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "${SCRIPT_DIR}/../.." && pwd)"

cd "${PROJECT_ROOT}"

BUILD=false
DOWN=false

for arg in "$@"; do
    case "${arg}" in
        --build) BUILD=true ;;
        --down)  DOWN=true ;;
        *)
            echo "Unknown option: ${arg}"
            echo "Usage: $0 [--build|--down]"
            exit 1
            ;;
    esac
done

if [[ "${DOWN}" == true ]]; then
    echo "==> Stopping and removing Nie Otchitame containers"
    docker compose down --volumes --remove-orphans
    exit 0
fi

if [[ "${BUILD}" == true ]]; then
    echo "==> Building images and starting Nie Otchitame"
    docker compose up --build -d
else
    echo "==> Starting Nie Otchitame"
    docker compose up -d
fi

echo "==> Waiting a moment for services to come up..."
sleep 5

"${SCRIPT_DIR}/health-check.sh"
