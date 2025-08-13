import { useState, useEffect } from 'react';
import { Nota } from './componentes/Nota.js'; // Import the Nota component

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
  const [versions, setVersions] = useState<VersionsInfo | {}>({});
  const [notes, setNotes] = useState<Note[]>([
    { id: 1, title: 'Welcome', content: 'Bienvenido a la app de notas!' },
    {
      id: 2,
      title: 'Sample Note',
      content: 'Esta es una nota de ejemplo con algo de contenido.',
    },
  ]);
  const [newNote, setNewNote] = useState<NewNote>({ title: '', content: '' });

  useEffect(() => {
    // Get versions from preload script
    if (window.versions) {
      setVersions({
        node: window.versions.node(),
        chrome: window.versions.chrome(),
        electron: window.versions.electron(),
      } as VersionsInfo);
    }
  }, []);

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
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📝 Notes App
          </h1>
          <p className="text-gray-600">
            Built with Electron + React + Vite + Tailwind
          </p>

          {/* Version info */}
          {Object.keys(versions).length > 0 && (
            <div className="mt-4 text-sm text-gray-500 space-x-4">
              <span>Node: {(versions as VersionsInfo).node}</span>
              <span>Chrome: {(versions as VersionsInfo).chrome}</span>
              <span>Electron: {(versions as VersionsInfo).electron}</span>
            </div>
          )}
        </div>

        {/* Add new note form */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add New Note
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Note title..."
              value={newNote.title}
              onChange={(e) =>
                setNewNote({ ...newNote, title: e.target.value })
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
            <textarea
              placeholder="Note content..."
              value={newNote.content}
              onChange={(e) =>
                setNewNote({ ...newNote, content: e.target.value })
              }
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
            />
            <button
              onClick={addNote}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
            >
              Add Note
            </button>
          </div>
        </div>

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
