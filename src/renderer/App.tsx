import { useState, useEffect } from 'react';
import { Nota } from './componentes/Nota';
import AddNota from './componentes/AddNota';
import EditNota from './componentes/EditNota';
import NotaModal from './componentes/NotaModal';
import { ToggleAdd } from './componentes/ToggleAdd';

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
  const [isClosingAddNota, setIsClosingAddNota] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [deletingIds, setDeletingIds] = useState<Set<number>>(new Set());
  const [newNote, setNewNote] = useState<NewNote>({ title: '', content: '' });
  const [editingNoteId, setEditingNoteId] = useState<number | null>(null);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  useEffect(() => {
    //Carga las notas
    cargarNotas();
  }, []);

  // ...existing code...
  const cargarNotas = async () => {
    try {
      const notas = await window.notasAPI.leerNotas();

      setNotes(
        notas.map((n, idx) => ({
          id: Date.now() + idx * 1000, // Ensure unique IDs by adding more spacing
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
    const handleEliminarConAnimacion = (id: number) => {
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.add(id);
        return next;
      });
      setTimeout(async () => {
        await deleteNote(id);
        setDeletingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }, 200);
    };
    return (
      <div
        key={nota.id}
        className={`${
          deletingIds.has(nota.id) ? 'animate-noteOut pointer-events-none' : ''
        }`}
      >
        <Nota
          id={nota.id}
          title={nota.title}
          content={nota.content}
          editarClick={() => setEditingNoteId(nota.id)}
          eliminarClick={handleEliminarConAnimacion}
          onClick={() => setSelectedNote(nota)}
        />
      </div>
    );
  });

  const handleOpenAddNota = () => {
    setAddBtn(true);
    setIsClosingAddNota(false);
  };

  const handleCloseAddNota = () => {
    setIsClosingAddNota(true);
    setTimeout(() => {
      setAddBtn(false);
      setIsClosingAddNota(false);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header with toggle button layout from Componetizo */}
        <div className="mb-8">
          {/* Mobile layout */}
          <div className="block sm:hidden">
            <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
              📝 Nota Fácil
            </h1>
            <div className="flex justify-center">
              <button
                type="button"
                onClick={() => {
                  if (addBtn) {
                    setIsClosingAddNota(true);
                    setTimeout(() => {
                      setAddBtn(false);
                      setIsClosingAddNota(false);
                    }, 200);
                  } else {
                    setAddBtn(true);
                    setIsClosingAddNota(false);
                  }
                }}
                className={`inline-flex items-center gap-2 rounded-lg border-2 border-blue-600 font-semibold bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-100 hover:text-blue-600 transition-colors`}
              >
                {addBtn ? 'Cancelar' : 'Nueva nota +'}
              </button>
            </div>
          </div>

          {/* Desktop layout */}
          <div className="hidden sm:grid grid-cols-[1fr_auto_1fr] items-center">
            {/* Empty left spacer to allow perfect centering */}
            <div></div>
            <h1 className="text-4xl font-bold text-center text-gray-800">
              📝 Nota Fácil
            </h1>
            <div className="justify-self-end">
              <button
                type="button"
                onClick={() => {
                  if (addBtn) {
                    setIsClosingAddNota(true);
                    setTimeout(() => {
                      setAddBtn(false);
                      setIsClosingAddNota(false);
                    }, 200);
                  } else {
                    setAddBtn(true);
                    setIsClosingAddNota(false);
                  }
                }}
                className={`inline-flex items-center gap-2 rounded-lg border-2 border-blue-600 font-semibold bg-blue-600 px-4 py-2 text-white hover:bg-blue-100 hover:text-blue-600 transition-colors justify-self-end`}
              >
                {addBtn ? 'Cancelar' : 'Nueva nota +'}
              </button>
            </div>
          </div>
        </div>

        {addBtn && (
          <div
            className={`mb-5 transition-all duration-200 animate-modalInOut ${
              isClosingAddNota
                ? 'animate-modalOut opacity-0 pointer-events-none'
                : 'animate-modalIn opacity-100'
            }`}
          >
            <AddNota
              onNotaAgregada={() => {
                cargarNotas();
                handleCloseAddNota();
              }}
              notasExistentes={notes.map((n) => n.title)}
              onClose={handleCloseAddNota}
              isClosing={isClosingAddNota}
            />
            <style>{`
              @keyframes modalIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
              @keyframes modalOut { from { opacity: 1; transform: translateY(0); } to { opacity: 0; transform: translateY(20px); } }
              .animate-modalIn { animation: modalIn 0.2s; }
              .animate-modalOut { animation: modalOut 0.2s; }
            `}</style>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notasEnComponente}
        </div>
        <style>{`
          @keyframes noteOut { from { opacity: 1; } to { opacity: 0; } }
          .animate-noteOut { animation: noteOut 0.2s ease forwards; }
        `}</style>
        {selectedNote && (
          <NotaModal
            nota={selectedNote}
            onClose={() => setSelectedNote(null)}
          />
        )}

        {notes.length === 0 && (
          <div className="text-center py-16">
            <p className="text-gray-500 text-lg">
              No hay notas todavía. Haz clic en "Nueva nota +" para empezar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
