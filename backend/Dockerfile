# syntax=docker/dockerfile:1

FROM python:3.11-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PYTHONFAULTHANDLER=1

# Create a non-root user to run the application.
RUN useradd --create-home appuser

# Set work directory
WORKDIR /app

# Install system dependencies required for compiling Python packages (psycopg2).
RUN apt-get update && apt-get install -y --no-install-recommends \
    gcc \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies.
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code.
COPY ./app ./app
COPY ./alembic ./alembic
COPY ./alembic.ini .

# Change ownership to the non-root user.
RUN chown -R appuser:appuser /app
USER appuser

# Expose the port the app runs on.
EXPOSE 8000

# Run migrations at container startup, then start the uvicorn server.
CMD ["sh", "-c", "alembic upgrade head && uvicorn app.main:app --host 0.0.0.0 --port 8000"]
