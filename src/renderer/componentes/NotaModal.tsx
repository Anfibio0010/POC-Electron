import React from 'react';

interface NotaModalProps {
  nota: {
    title: string;
    content: string;
  };
  onClose: () => void;
}

const NotaModal: React.FC<NotaModalProps> = ({ nota, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 transition-opacity duration-300 animate-fadeIn">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-lg w-full relative transition-transform duration-300 animate-modalIn">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl font-bold"
          aria-label="Cerrar"
        >
          ×
        </button>
        <h2 className="text-2xl font-bold mb-4 text-gray-800">{nota.title}</h2>
        <div className="max-h-96 overflow-y-auto">
          <p className="text-gray-700 whitespace-pre-line break-words">{nota.content}</p>
        </div>
      </div>
      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .animate-fadeIn { animation: fadeIn 0.3s; }
        @keyframes modalIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
        .animate-modalIn { animation: modalIn 0.3s; }
      `}</style>
    </div>
  );
};

export default NotaModal;
