import { useState, useEffect } from 'react';
import { Nota } from './componentes/Nota';
import AddNota from './componentes/AddNota';
import EditNota from './componentes/EditNota';
import NotaModal from './componentes/NotaModal';
import { ToggleAdd } from './componentes/ToggleAdd';

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
  const [addBtn, setAddBtn] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState<NewNote>({ title: '', content: '' });
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

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

  

  const deleteNote = async (id: number) => {
    const nota = notes.find((note) => note.id === id);
    if (!nota) return;
    const result = await window.notasAPI.eliminarNota(nota.title);
    await cargarNotas();
  };
  const notasEnComponente = notes.map((nota) => {
    if (editingNoteId === nota.id) {
      return (
        <EditNota
          key={nota.id}
          nota={nota}
          onGuardar={async (titulo, contenido) => {
            await window.notasAPI.guardarNota(titulo, contenido);
            setEditingNoteId(null);
            await cargarNotas();
          }}
          onCancelar={() => setEditingNoteId(null)}
        />
      );
    }
    return (
      <Nota
        key={nota.id}
        id={nota.id}
        title={nota.title}
        content={nota.content}
        editarClick={() => setEditingNoteId(nota.id)}
        eliminarClick={deleteNote}
        onClick={() => setSelectedNote(nota)}
      />
    );
  });
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with toggle button layout from Componetizo */}
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
        
        {/* Version info from main branch */}
        {Object.keys(versions).length > 0 && (
          <div className="mb-4 text-center text-sm text-gray-500 space-x-4">
            <span>Node: {(versions as VersionsInfo).node}</span>
            <span>Chrome: {(versions as VersionsInfo).chrome}</span>
            <span>Electron: {(versions as VersionsInfo).electron}</span>
          </div>
        )}
        
        {/* Add note section with toggle functionality */}
        {addBtn && (
          <div className="mb-5">
            <AddNota onNotaAgregada={() => {
              cargarNotas();
              setAddBtn(false);
            }} />
          </div>
        )}

        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notasEnComponente}
        </div>
        {selectedNote && (
          <NotaModal nota={selectedNote} onClose={() => setSelectedNote(null)} />
        )}

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
