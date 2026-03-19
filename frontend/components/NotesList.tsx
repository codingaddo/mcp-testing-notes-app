import React from "react";
import type { Note } from "../app/page";

interface NotesListProps {
  notes: Note[];
}

export const NotesList: React.FC<NotesListProps> = ({ notes }) => {
  return (
    <ul className="divide-y divide-slate-200">
      {notes.map((note) => {
        const snippet =
          note.content.length > 120
            ? note.content.slice(0, 117) + "..."
            : note.content;
        return (
          <li key={note.id} className="py-3">
            <h3 className="text-base font-semibold text-slate-900">
              {note.title}
            </h3>
            <p className="mt-1 text-sm text-slate-700 whitespace-pre-line">
              {snippet}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              Updated {new Date(note.updated_at).toLocaleString()}
            </p>
          </li>
        );
      })}
    </ul>
  );
};
