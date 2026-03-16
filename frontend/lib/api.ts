export interface Note {
  id: number;
  content: string;
  created_at: string;
}

const BASE_URL = 'http://localhost:8000/api/v1/notes';

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const error: any = new Error('Request failed');
    error.status = res.status;
    throw error;
  }
  return res.json();
}

export async function fetchNotes(): Promise<Note[]> {
  const res = await fetch(`${BASE_URL}/`, { cache: 'no-store' });
  return handleResponse<Note[]>(res);
}

export async function createNote(content: string): Promise<Note> {
  const res = await fetch(`${BASE_URL}/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  });
  return handleResponse<Note>(res);
}

export async function deleteNote(id: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    const error: any = new Error('Request failed');
    error.status = res.status;
    throw error;
  }
}
