import { useState, useEffect } from 'react';
import { Nota } from './componentes/Nota';
import AddNota from './componentes/AddNota';

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
  const [notes, setNotes] = useState<Note[]>([]);
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
    
    cargarNotas();
  }, []);

  const cargarNotas = async () => {
    try {
      const notas = await window.notasAPI.leerNotas();
      
      setNotes(
        notas.map((n, idx) => ({
          id: Date.now() + idx,
          title: n.titulo,
          content: n.contenido,
        }))
      );
    } catch (e) {
      setNotes([]);
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
        
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            📝 Notes App
          </h1>
          <p className="text-gray-600">
            Built with Electron + React + Vite + Tailwind
          </p>

          
          {Object.keys(versions).length > 0 && (
            <div className="mt-4 text-sm text-gray-500 space-x-4">
              <span>Node: {(versions as VersionsInfo).node}</span>
              <span>Chrome: {(versions as VersionsInfo).chrome}</span>
              <span>Electron: {(versions as VersionsInfo).electron}</span>
            </div>
          )}
        </div>

        
        <AddNota onNotaAgregada={cargarNotas} />

        
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
