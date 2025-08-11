import { useState, useEffect } from 'react';

function App() {
  const [versions, setVersions] = useState({});
  const [notes, setNotes] = useState([
    { id: 1, title: 'Welcome', content: 'Welcome to your notes app!' },
    {
      id: 2,
      title: 'Sample Note',
      content: 'This is a sample note with some content.',
    },
  ]);
  const [newNote, setNewNote] = useState({ title: '', content: '' });

  useEffect(() => {
    // Get versions from preload script
    if (window.versions) {
      setVersions({
        node: window.versions.node(),
        chrome: window.versions.chrome(),
        electron: window.versions.electron(),
      });
    }
  }, []);

  const addNote = () => {
    if (newNote.title.trim() && newNote.content.trim()) {
      const note = {
        id: Date.now(),
        title: newNote.title,
        content: newNote.content,
      };
      setNotes([...notes, note]);
      setNewNote({ title: '', content: '' });
    }
  };

  const deleteNote = (id) => {
    setNotes(notes.filter((note) => note.id !== id));
  };

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
              <span>Node: {versions.node}</span>
              <span>Chrome: {versions.chrome}</span>
              <span>Electron: {versions.electron}</span>
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
          {notes.map((note) => (
            <div
              key={note.id}
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
            >
              <div className="flex justify-between items-start mb-3">
                <h3 className="text-lg font-semibold text-gray-800 truncate flex-1">
                  {note.title}
                </h3>
                <button
                  onClick={() => deleteNote(note.id)}
                  className="text-red-500 hover:text-red-700 ml-2 p-1"
                  title="Delete note"
                >
                  ✕
                </button>
              </div>
              <p className="text-gray-600 line-clamp-4">{note.content}</p>
            </div>
          ))}
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
