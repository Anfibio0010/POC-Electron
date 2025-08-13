import React from 'react';

type NotaProps = {
  id: number;
  title: string;
  content: string;
  editarClick: (id: number) => void;
  eliminarClick: (id: number) => void;
};

export function Nota({
  id,
  title,
  content,
  editarClick,
  eliminarClick,
}: NotaProps) {
  return (
    <div
      key={id}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow duration-200"
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 truncate flex-1">
          {title}
        </h3>
        <button
          onClick={() => eliminarClick(id)}
          className="text-red-500 hover:text-red-700 ml-2 p-1"
          title="Delete note"
        >
          ✕
        </button>
      </div>
      <p className="text-gray-600 line-clamp-4">{content}</p>
    </div>
  );
}
