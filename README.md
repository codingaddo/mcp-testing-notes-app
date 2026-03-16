# MCP Testing Notes App - Backend

This repository contains the backend implementation for the MCP Testing Notes App v1, built with FastAPI and SQLite.

## Backend Setup

This project is configured to use [uv](https://github.com/astral-sh/uv) as the Python package manager.

### Prerequisites

- Python 3.11+
- `uv` installed (`pip install uv` or follow the official docs)

### Install dependencies

```bash
uv sync
```

### Run the API server

```bash
uv run uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`.

### Run tests

```bash
uv run pytest
```

### Notes API Base URL

All Notes endpoints are available under:

- Base URL: `http://localhost:8000`
- Notes path prefix: `/api/v1/notes`

Example endpoints:

- `POST /api/v1/notes/` – create a note
- `GET /api/v1/notes/` – list notes
- `DELETE /api/v1/notes/{note_id}` – delete a note
