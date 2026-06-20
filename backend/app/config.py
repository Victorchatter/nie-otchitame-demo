"""Application configuration.

Loads settings from environment variables via Pydantic Settings.
All secrets and per-environment values must be supplied through
env vars or an optional ``.env`` file (never committed).
"""

from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Base directory of the backend package (one level up from this file).
_BASE_DIR = Path(__file__).resolve().parent.parent


class Settings(BaseSettings):
    """Runtime settings for the Nie Otchitame backend."""

    model_config = SettingsConfigDict(
        env_file=str(_BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # Application metadata
    app_name: str = "Nie Otchitame API"
    app_version: str = "1.0.0"
    debug: bool = False

    # Database
    # Example: postgresql://postgres:postgres@localhost:5432/nie_otchitame
    database_url: str = "sqlite:///./nie_otchitame.db"

    # CORS (space-separated list of origins, default allows nothing in prod)
    cors_origins: str = "http://localhost:3000 http://localhost:5173"

    @property
    def cors_origin_list(self) -> list[str]:
        """Return CORS origins as a list."""
        return [origin.strip() for origin in self.cors_origins.split() if origin.strip()]


@lru_cache
def get_settings() -> Settings:
    """Return a cached Settings instance.

    The cache ensures that environment variables are read once per process,
    avoiding repeated filesystem access during tests or reloads.
    """
    return Settings()
