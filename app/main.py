from fastapi import FastAPI
from app.routers.notes import router as notes_router

app = FastAPI(title="MCP Testing Notes App")


@app.get("/health")
async def health_check() -> dict:
    return {"status": "ok"}


app.include_router(notes_router, prefix="/notes", tags=["notes"])
