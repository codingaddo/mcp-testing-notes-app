"use client";

import { useEffect, useState } from 'react';
import { createNote, deleteNote, fetchNotes, Note } from '../lib/api';
import NotesForm from './NotesForm';
import NotesList from './NotesList';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchNotes();
        setNotes(data);
      } catch (err) {
        console.error(err);
        setError('Failed to load notes. Please ensure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const handleCreate = async (content: string) => {
    setError(null);
    setCreating(true);
    try {
      const newNote = await createNote(content);
      setNotes((prev) => [newNote, ...prev]);
    } catch (err) {
      console.error(err);
      setError('Failed to create note. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: number) => {
    setError(null);
    setDeletingId(id);
    const previousNotes = notes;
    setNotes((prev) => prev.filter((n) => n.id !== id));
    try {
      await deleteNote(id);
    } catch (err: any) {
      console.error(err);
      if (err?.status === 404) {
        setError('Note was already deleted.');
      } else {
        setError('Failed to delete note. Restoring previous state.');
        setNotes(previousNotes);
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-primary-400 sm:text-4xl">
            Notes App
          </h1>
          <p className="mt-2 text-sm text-slate-300">
            Create quick notes. Backend must be running on{' '}
            <code className="rounded bg-slate-900 px-1 py-0.5 text-xs text-primary-300">
              http://localhost:8000
            </code>
            .
          </p>
        </header>

        <section className="mb-6 rounded-lg border border-slate-800 bg-slate-900/60 p-4 shadow-lg">
          <NotesForm onCreate={handleCreate} creating={creating} />
        </section>

        {error && (
          <div
            role="alert"
            className="mb-4 rounded-md border border-red-500/40 bg-red-950/60 px-3 py-2 text-sm text-red-200"
          >
            {error}
          </div>
        )}

        <section className="rounded-lg border border-slate-800 bg-slate-900/60 p-4 shadow-lg">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-100">Your Notes</h2>
            {loading && (
              <span className="text-xs text-slate-400">Loading notes...</span>
            )}
          </div>
          <NotesList
            notes={notes}
            onDelete={handleDelete}
            deletingId={deletingId}
            loading={loading}
          />
        </section>
      </div>
    </main>
  );
}
