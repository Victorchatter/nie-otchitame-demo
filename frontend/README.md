# Nie Otchitame Frontend

React + Vite + TypeScript dashboard for the **Nie Otchitame** reporting API.

## Requirements

- Node.js 20+
- npm or compatible package manager
- Backend running on `http://localhost:8000` (handled automatically via Vite proxy)

## Install

```bash
cd frontend
npm install
```

## Development

```bash
npm run dev
```

The dev server starts on `http://localhost:5173`. API requests to `/api` are proxied to `http://localhost:8000` via `vite.config.ts`.

## Build

```bash
npm run build
```

Static output is written to `dist/`. You can preview it with:

```bash
npm run preview
```

## End-to-end tests

Install Playwright browsers (first time only):

```bash
npx playwright install
```

Run the e2e suite against `http://localhost:5173`:

```bash
npm run test:e2e
```

Tests cover Chromium, Firefox, and WebKit. The Playwright config automatically starts the dev server before tests.

## Docker

Build and run the production image:

```bash
docker build -t nie-otchitame-frontend .
docker run -p 8080:80 nie-otchitame-frontend
```

The multi-stage Dockerfile compiles the app in a `node:20-alpine` builder stage and serves it with `nginx:alpine`.

## Environment variables

- `VITE_API_URL` — overrides the API base path (default: `/api/v1`). Used only in the built app; during dev the Vite proxy handles `/api`.

## Project layout

```text
frontend/
├── e2e/
│   ├── playwright.config.ts
│   └── tests/
│       └── dashboard.spec.ts
├── src/
│   ├── api/
│   │   └── client.ts
│   ├── components/
│   │   ├── Metrics.tsx
│   │   ├── ReportForm.tsx
│   │   └── ReportList.tsx
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── types.ts
├── Dockerfile
├── index.html
├── package.json
├── README.md
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts
```
