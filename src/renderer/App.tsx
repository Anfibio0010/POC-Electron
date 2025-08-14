import { useState, useEffect } from 'react';
import { Nota } from './componentes/Nota.js'; // Import the Nota component
import { AddNota } from './componentes/AddNota.js';
import { ToggleAdd } from './componentes/ToggleAdd.js';

// Define types
interface VersionsInfo {
  node: string;
  chrome: string;
  electron: string;
}

interface Note {
  id: number;
  title: string;
  content: string;
}

interface NewNote {
  title: string;
  content: string;
}

function App() {
  const [addBtn, setAddBtn] = useState(false);
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: 'Welcome', content: 'Bienvenido a la app de notas!' },
    {
      id: 2,
      title: 'Sample Note',
      content: 'Esta es una nota de ejemplo con algo de contenido.',
    },
  ]);
  const [newNote, setNewNote] = useState<NewNote>({ title: '', content: '' });
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);

  const addNote = (): void => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note: Note = {
        id: Date.now(),
        title: newNote.title,
        content: newNote.content,
      };
      setNotes([...notes, note]);
      setNewNote({ title: '', content: '' });
    }
  };

  const deleteNote = (id: number) => {
    setNotes(notes.filter((note) => note.id !== id));
  };
  const notasEnComponente = notes.map((nota) => {
    return (
      <Nota
        key={nota.id}
        id={nota.id}
        title={nota.title}
        content={nota.content}
        editarClick={() => console.log(`Edit note ${nota.id}`)}
        eliminarClick={deleteNote}
      />
    );
  });
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 grid grid-cols-[1fr_auto_1fr] items-center">
          {/* Empty left spacer to allow perfect centering */}
          <div></div>
          <h1 className="text-4xl font-bold text-center text-gray-800">
            📝 Nota Fácil
          </h1>
          <div className="justify-self-end">
            <ToggleAdd addBtn={addBtn} setAddBtn={setAddBtn} />
          </div>
        </div>
        {addBtn && (
          <div className="mb-5">
            <AddNota
              newNote={newNote}
              setNewNote={setNewNote}
              addNote={() => {
                addNote();
                setAddBtn(false);
              }}
            />
          </div>
        )}

        {/* Notes grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notasEnComponente}
        </div>

        {notes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No notes yet. Create your first note above!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
