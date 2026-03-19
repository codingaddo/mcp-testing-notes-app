from __future__ import annotations

from dataclasses import asdict
from threading import Lock
from typing import Dict, List, Optional

from app.models import Note
from app.schemas import NoteCreate, NoteUpdate


class NotesRepository:
    """In-memory repository for managing notes.

    This is intentionally simple for Sprint 1 and can be swapped for a real
    database-backed implementation later while keeping the same interface.
    """

    def __init__(self) -> None:
        self._notes: Dict[int, Note] = {}
        self._next_id: int = 1
        self._lock = Lock()

    def create(self, note_in: NoteCreate) -> Note:
        with self._lock:
            note_id = self._next_id
            self._next_id += 1
        note = Note(id=note_id, title=note_in.title, content=note_in.content)
        self._notes[note.id] = note
        return note

    def list(self, query: Optional[str] = None) -> List[Note]:
        notes = list(self._notes.values())
        if query:
            q = query.lower()
            notes = [
                n
                for n in notes
                if q in n.title.lower() or q in n.content.lower()
            ]
        # Sort by updated_at descending
        notes.sort(key=lambda n: n.updated_at, reverse=True)
        return notes

    def get(self, note_id: int) -> Optional[Note]:
        return self._notes.get(note_id)

    def update(self, note_id: int, note_in: NoteUpdate) -> Optional[Note]:
        note = self._notes.get(note_id)
        if not note:
            return None
        note.update(title=note_in.title, content=note_in.content)
        return note

    def delete(self, note_id: int) -> bool:
        return self._notes.pop(note_id, None) is not None


# Singleton-style repository instance for the simple app lifecycle
notes_repository = NotesRepository()
