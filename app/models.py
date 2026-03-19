from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime, timezone
from typing import Optional


@dataclass
class Note:
    id: int
    title: str
    content: str
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))

    def update(self, *, title: Optional[str] = None, content: Optional[str] = None) -> None:
        if title is not None:
            self.title = title
        if content is not None:
            self.content = content
        self.updated_at = datetime.now(timezone.utc)
