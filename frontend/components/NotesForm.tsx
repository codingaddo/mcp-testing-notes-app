"use client";

import { FormEvent, useState } from 'react';

interface NotesFormProps {
  onCreate: (content: string) => Promise<void> | void;
  creating: boolean;
}

const MAX_LENGTH = 500;

export default function NotesForm({ onCreate, creating }: NotesFormProps) {
  const [content, setContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const remaining = MAX_LENGTH - content.length;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = content.trim();
    if (!trimmed) {
      setError('Note cannot be empty.');
      return;
    }
    if (trimmed.length > MAX_LENGTH) {
      setError(`Note cannot exceed ${MAX_LENGTH} characters.`);
      return;
    }
    setError(null);
    await onCreate(trimmed);
    setContent('');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3" aria-label="Create note form">
      <label className="block text-sm font-medium text-slate-200" htmlFor="note-content">
        New Note
      </label>
      <textarea
        id="note-content"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        maxLength={MAX_LENGTH + 50}
        rows={4}
        className="w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-sm text-slate-50 shadow-sm outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
        placeholder="Type your note here..."
      />
      <div className="flex items-center justify-between text-xs">
        <span className={remaining < 0 ? 'text-red-400' : 'text-slate-400'}>
          {remaining >= 0
            ? `${remaining} characters remaining`
            : `${-remaining} characters over the limit`}
        </span>
        {error && <span className="text-red-400">{error}</span>}
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          disabled={creating}
          className="inline-flex items-center rounded-md bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-primary-500 disabled:cursor-not-allowed disabled:bg-primary-800"
        >
          {creating ? 'Saving...' : 'Add Note'}
        </button>
      </div>
    </form>
  );
}
