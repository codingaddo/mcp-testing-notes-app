# MCP Testing Notes App

Backend and frontend for a simple Notes application used to test MCP integrations.

## Backend (FastAPI)

The backend is implemented with FastAPI and SQLite.

### Setup

We use [uv](https://github.com/astral-sh/uv) to manage the Python environment and dependencies.

```bash
uv sync
```

### Run the backend server

```bash
uv run uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

### Run backend tests

```bash
uv run pytest
```

### Notes API

Base path: `http://localhost:8000/api/v1/notes`

- `POST /api/v1/notes/` – Create a note. Body: `{ "content": "your note" }` (max 500 chars, non-empty after trimming).
- `GET /api/v1/notes/` – List notes ordered by `created_at` descending.
- `DELETE /api/v1/notes/{note_id}` – Delete a note by ID. Returns 404 if not found.

## Frontend (Next.js + TypeScript)

The frontend lives in the [`frontend/`](frontend/README.md) directory and is built with Next.js, TypeScript, and Tailwind CSS.

### Quick start

```bash
cd frontend
npm install
npm run dev
```

The frontend will be available at `http://localhost:3000` and expects the backend to be running at `http://localhost:8000`.

### Frontend tests

```bash
cd frontend
npm test
```

For more details, see [frontend/README.md](frontend/README.md).
