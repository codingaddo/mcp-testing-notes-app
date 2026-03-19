"use client";

import React, { FormEvent, useEffect, useState } from "react";

interface NotesSearchProps {
  value: string;
  onChange: (value: string) => void;
  onSearch: (value: string) => void | Promise<void>;
}

export const NotesSearch: React.FC<NotesSearchProps> = ({
  value,
  onChange,
  onSearch,
}) => {
  const [internal, setInternal] = useState(value);

  useEffect(() => {
    setInternal(value);
  }, [value]);

  useEffect(() => {
    const handle = setTimeout(() => {
      onSearch(internal);
    }, 400);
    return () => clearTimeout(handle);
  }, [internal, onSearch]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSearch(internal);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center gap-2">
      <input
        type="search"
        value={internal}
        onChange={(e) => {
          setInternal(e.target.value);
          onChange(e.target.value);
        }}
        placeholder="Search notes..."
        className="flex-1 rounded-md border border-slate-300 px-3 py-2 text-sm shadow-sm focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
        aria-label="Search notes"
      />
      <button
        type="submit"
        className="rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50"
      >
        Search
      </button>
    </form>
  );
};
