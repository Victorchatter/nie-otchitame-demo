# PHP health checker

A small PHP CLI utility for the Nie Otchitame demo. It calls the backend
`/health` endpoint and optionally scans a log file for ERROR lines.

## Requirements

- PHP 8.1 or newer (uses `str_starts_with` / `str_contains`).

## Run

```bash
cd polyglot/php

# health check only
php health_check.php --url=http://localhost:8000/health

# health check + log scan
php health_check.php --url=http://localhost:8000/health --log=../../backend/app.log
```

## What it demonstrates

- PHP CLI argument parsing.
- HTTP GET with native `file_get_contents` (no external dependencies).
- JSON parsing.
- File scanning for ERROR lines.
- Clean exit codes (0 healthy, 1 unhealthy).
