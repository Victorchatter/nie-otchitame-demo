"""SQLAlchemy database setup.

Uses SQLAlchemy 2.0 style with typed ``Mapped`` attributes.
"""

from __future__ import annotations

from collections.abc import Generator
from contextlib import contextmanager

from sqlalchemy import create_engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from app.config import get_settings


class Base(DeclarativeBase):
    """Declarative base for all ORM models."""

    pass


settings = get_settings()

# Engine configuration tuned for both PostgreSQL and SQLite.
# ``connect_args`` is required for SQLite in-memory mode.
if settings.database_url.startswith("sqlite"):
    engine = create_engine(
        settings.database_url,
        connect_args={"check_same_thread": False},
        echo=settings.debug,
    )
else:
    engine = create_engine(
        settings.database_url,
        pool_pre_ping=True,
        echo=settings.debug,
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """Yield a transactional database session for FastAPI dependency injection.

    FastAPI natively supports generator dependencies: the code before ``yield``
    runs on request start, and the ``finally`` block runs after the response
    is sent. Unhandled exceptions trigger a rollback before re-raising.
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


@contextmanager
def get_db_context() -> Generator[Session, None, None]:
    """Context-manager variant of ``get_db`` for scripts and non-FastAPI code.

    Usage::

        with get_db_context() as db:
            db.add(...)
    """
    db = SessionLocal()
    try:
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise
    finally:
        db.close()
