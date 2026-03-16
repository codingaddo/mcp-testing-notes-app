"use client";

import { Note } from '../lib/api';

interface NotesListProps {
  notes: Note[];
  onDelete: (id: number) => void;
  deletingId: number | null;
  loading: boolean;
}

function formatDate(iso: string) {
  const date = new Date(iso);
  return date.toLocaleString();
}

export default function NotesList({
  notes,
  onDelete,
  deletingId,
  loading,
}: NotesListProps) {
  if (loading && notes.length === 0) {
    return (
      <p className="text-sm text-slate-400" aria-live="polite">
        Loading notes...
      </p>
    );
  }

  if (!loading && notes.length === 0) {
    return (
      <p className="text-sm text-slate-400" aria-live="polite">
        No notes yet. Create your first note above.
      </p>
    );
  }

  return (
    <ul className="space-y-3" aria-label="Notes list">
      {notes.map((note) => (
        <li
          key={note.id}
          className="flex items-start justify-between rounded-md border border-slate-800 bg-slate-950/60 px-3 py-2 text-sm shadow-sm"
        >
          <div>
            <p className="whitespace-pre-wrap text-slate-100">{note.content}</p>
            <p className="mt-1 text-xs text-slate-500">
              Created at {formatDate(note.created_at)}
            </p>
          </div>
          <button
            type="button"
            onClick={() => onDelete(note.id)}
            disabled={deletingId === note.id}
            className="ml-3 inline-flex h-8 items-center justify-center rounded-md border border-red-500/40 bg-red-900/40 px-2 text-xs font-medium text-red-100 transition hover:bg-red-800/70 disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={`Delete note created at ${formatDate(note.created_at)}`}
          >
            {deletingId === note.id ? 'Deleting...' : 'Delete'}
          </button>
        </li>
      ))}
    </ul>
  );
}
