# Notes App Frontend

This is the Next.js + TypeScript frontend for the MCP Testing Notes App.

The frontend talks to the FastAPI backend running at `http://localhost:8000` and uses the `/api/v1/notes` endpoints.

## Prerequisites

- Node.js 18+
- pnpm, npm, or yarn (examples below use `npm`)
- Backend running locally (see root README for backend setup)

## Install dependencies

```bash
cd frontend
npm install
```

## Run the development server

```bash
cd frontend
npm run dev
```

The app will be available at http://localhost:3000.

## Run frontend tests

```bash
cd frontend
npm test
```

This runs the Jest + React Testing Library test suite.
