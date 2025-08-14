import { useState } from 'react';

interface EditNotaProps {
  nota: {
    id: number;
    title: string;
    content: string;
  };
  onGuardar: (titulo: string, contenido: string) => void;
  onCancelar: () => void;
}

const EditNota: React.FC<EditNotaProps> = ({ nota, onGuardar, onCancelar }) => {
  const [titulo, setTitulo] = useState(nota.title);
  const [contenido, setContenido] = useState(nota.content);
  const [guardando, setGuardando] = useState(false);

  const handleGuardar = async () => {
    if (!titulo.trim() || !contenido.trim()) return;
    setGuardando(true);
    if (titulo !== nota.title) {
      await window.notasAPI.eliminarNota(nota.title);
    }
    await window.notasAPI.guardarNota(titulo, contenido);
    setGuardando(false);
    onGuardar(titulo, contenido);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Editar Nota</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Note title..."
          value={titulo}
          onChange={e => setTitulo(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <textarea
          placeholder="Note content..."
          value={contenido}
          onChange={e => setContenido(e.target.value)}
          rows={4}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none"
        />
        <div className="flex gap-2">
          <button
            onClick={handleGuardar}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
            disabled={guardando}
          >
            {guardando ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            onClick={onCancelar}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditNota;
