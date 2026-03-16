from fastapi import FastAPI

from .routers import notes

app = FastAPI(title="MCP Testing Notes App API", version="1.0.0")

app.include_router(notes.router, prefix="/api/v1")


@app.get("/health")
async def health_check():
    return {"status": "ok"}
