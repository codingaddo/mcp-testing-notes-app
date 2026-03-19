from __future__ import annotations

from typing import List, Optional

from fastapi import APIRouter, HTTPException, Query, status

from app.repositories import notes_repository
from app.schemas import NoteCreate, NoteRead, NoteUpdate

router = APIRouter()


@router.post("/", response_model=NoteRead, status_code=status.HTTP_201_CREATED)
async def create_note(note_in: NoteCreate) -> NoteRead:
    note = notes_repository.create(note_in)
    return NoteRead.model_validate(note.__dict__)


@router.get("/", response_model=List[NoteRead])
async def list_notes(query: Optional[str] = Query(default=None, alias="query")) -> List[NoteRead]:
    notes = notes_repository.list(query=query)
    return [NoteRead.model_validate(n.__dict__) for n in notes]


@router.get("/{note_id}", response_model=NoteRead)
async def get_note(note_id: int) -> NoteRead:
    note = notes_repository.get(note_id)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return NoteRead.model_validate(note.__dict__)


@router.put("/{note_id}", response_model=NoteRead)
@router.patch("/{note_id}", response_model=NoteRead)
async def update_note(note_id: int, note_in: NoteUpdate) -> NoteRead:
    if note_in.title is None and note_in.content is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one of 'title' or 'content' must be provided",
        )
    note = notes_repository.update(note_id, note_in)
    if not note:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
    return NoteRead.model_validate(note.__dict__)


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_note(note_id: int) -> None:
    deleted = notes_repository.delete(note_id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Note not found")
