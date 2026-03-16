from datetime import datetime

from pydantic import BaseModel, Field


class NoteCreate(BaseModel):
    content: str = Field(..., max_length=500, description="Content of the note (max 500 characters)")


class NoteOut(BaseModel):
    id: int
    content: str
    created_at: datetime

    class Config:
        orm_mode = True
