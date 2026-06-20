"""FastAPI application factory for Nie Otchitame."""

from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_settings
from app.routers import reports


def create_app() -> FastAPI:
    """Create and configure the FastAPI application."""
    settings = get_settings()

    app = FastAPI(
        title=settings.app_name,
        version=settings.app_version,
        debug=settings.debug,
        description="ERP-lite reporting API for Nie Otchitame.",
    )

    # CORS: frontend runs on Vite dev server in local development.
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Health check (outside versioned API for load balancers).
    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    # Versioned API.
    app.include_router(reports.router, prefix="/api/v1")

    return app


app = create_app()
