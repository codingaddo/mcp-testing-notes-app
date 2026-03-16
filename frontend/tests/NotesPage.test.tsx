import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import NotesPage from '../components/NotesPage';
import * as api from '../lib/api';

jest.mock('../lib/api');

const mockedApi = api as jest.Mocked<typeof api>;

describe('NotesPage', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('renders notes from API', async () => {
    mockedApi.fetchNotes.mockResolvedValueOnce([
      { id: 1, content: 'Test note', created_at: new Date().toISOString() },
    ]);

    render(<NotesPage />);

    expect(screen.getByText(/loading notes/i)).toBeInTheDocument();

    const note = await screen.findByText('Test note');
    expect(note).toBeInTheDocument();
  });

  it('creates a note via the form', async () => {
    mockedApi.fetchNotes.mockResolvedValueOnce([]);
    mockedApi.createNote.mockResolvedValueOnce({
      id: 2,
      content: 'New note',
      created_at: new Date().toISOString(),
    });

    render(<NotesPage />);

    const textarea = await screen.findByLabelText(/new note/i);
    fireEvent.change(textarea, { target: { value: 'New note' } });

    const button = screen.getByRole('button', { name: /add note/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockedApi.createNote).toHaveBeenCalledWith('New note');
    });

    expect(await screen.findByText('New note')).toBeInTheDocument();
  });

  it('deletes a note when delete is clicked', async () => {
    const createdAt = new Date().toISOString();
    mockedApi.fetchNotes.mockResolvedValueOnce([
      { id: 3, content: 'Delete me', created_at: createdAt },
    ]);
    mockedApi.deleteNote.mockResolvedValueOnce();

    render(<NotesPage />);

    const deleteButton = await screen.findByRole('button', { name: /delete/i });
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockedApi.deleteNote).toHaveBeenCalledWith(3);
    });
  });
});
