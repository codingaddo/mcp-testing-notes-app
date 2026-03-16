from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from .. import models, schemas
from ..database import get_db, Base, engine

# Ensure tables are created
Base.metadata.create_all(bind=engine)

router = APIRouter(prefix="/notes", tags=["notes"])


@router.post("/", response_model=schemas.NoteOut, status_code=status.HTTP_201_CREATED)
def create_note(payload: schemas.NoteCreate, db: Session = Depends(get_db)):
    content = payload.content.strip()
    if not content:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Note content must not be empty.",
        )

    note = models.Note(content=content)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note


@router.get("/", response_model=List[schemas.NoteOut])
def list_notes(db: Session = Depends(get_db)):
    notes = db.query(models.Note).order_by(models.Note.created_at.desc()).all()
    return notes


@router.delete("/{note_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_note(note_id: int, db: Session = Depends(get_db)):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Note not found.",
        )

    db.delete(note)
    db.commit()
    return None
