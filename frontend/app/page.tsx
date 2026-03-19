"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { NotesList } from "../components/NotesList";
import { NoteForm } from "../components/NoteForm";
import { NotesSearch } from "../components/NotesSearch";

export type Note = {
  id: string;
  title: string;
  content: string;
  created_at: string;
  updated_at: string;
};

const API_BASE = "http://localhost:8000";

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const fetchNotes = useCallback(async (search?: string) => {
    setLoading(true);
    setError(null);
    try {
      const url = new URL("/notes", API_BASE);
      const q = search ?? query;
      if (q.trim().length > 0) {
        url.searchParams.set("query", q.trim());
      }
      const res = await fetch(url.toString());
      if (!res.ok) {
        throw new Error(`Failed to load notes (${res.status})`);
      }
      const data: Note[] = await res.json();
      setNotes(data);
    } catch (e: any) {
      setError(e.message ?? "Failed to load notes");
    } finally {
      setLoading(false);
    }
  }, [query]);

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const handleCreate = useCallback(
    async (payload: { title: string; content: string }) => {
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/notes`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          const body = await res.json().catch(() => null);
          const detail = body?.detail;
          throw new Error(
            typeof detail === "string"
              ? detail
              : "Failed to create note. Please check your input."
          );
        }
        await fetchNotes("");
        setQuery("");
        return true;
      } catch (e: any) {
        setError(e.message ?? "Failed to create note");
        return false;
      }
    },
    [fetchNotes]
  );

  const handleSearchChange = useCallback((value: string) => {
    setQuery(value);
  }, []);

  const handleSearchSubmit = useCallback(
    async (value: string) => {
      await fetchNotes(value);
    },
    [fetchNotes]
  );

  const hasNotes = useMemo(() => notes.length > 0, [notes]);

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">Notes</h1>
        <p className="text-sm text-slate-600">
          Simple notes app wired to FastAPI backend at {API_BASE}/notes
        </p>
      </header>

      <section className="rounded-md bg-white p-4 shadow-sm">
        <h2 className="mb-3 text-lg font-medium">Create a new note</h2>
        <NoteForm onSubmit={handleCreate} />
      </section>

      <section className="rounded-md bg-white p-4 shadow-sm space-y-4">
        <div className="flex items-center justify-between gap-2">
          <h2 className="text-lg font-medium">Your notes</h2>
        </div>
        <NotesSearch
          value={query}
          onChange={handleSearchChange}
          onSearch={handleSearchSubmit}
        />

        {loading && <p className="text-sm text-slate-600">Loading notes...</p>}
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {!loading && !hasNotes && !error && (
          <p className="text-sm text-slate-600">No notes yet. Create your first note above.</p>
        )}

        {hasNotes && <NotesList notes={notes} />}
      </section>
    </div>
  );
}
