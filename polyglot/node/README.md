# Node.js seed utility

Seeds the Nie Otchitame FastAPI backend with sample reports using the native
`fetch` API.

## Requirements

- Node.js 18+ (uses built-in `fetch`).

## Run

```bash
cd polyglot/node
npm start
```

Or directly:

```bash
node seed_reports.js
```

Override the backend URL with an environment variable:

```bash
API_URL=http://localhost:8080/api/v1/reports node seed_reports.js
```

## What it demonstrates

- Node.js CLI scripting.
- `fetch` POST requests to a REST API.
- JSON request/response handling.
- Graceful per-item error handling and summary counts.
