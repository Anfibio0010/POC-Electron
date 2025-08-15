type NotaProps = {
  id: number;
  title: string;
  content: string;
  editarClick: (id: number) => void;
  eliminarClick: (id: number) => void;
  onClick?: () => void;
};

export function Nota({
  id,
  title,
  content,
  editarClick,
  eliminarClick,
  onClick,
}: NotaProps) {
  return (
    <div
      key={id}
      className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg h-40 transition-shadow duration-200 cursor-pointer"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-3">
        <h3 className="text-lg font-semibold text-gray-800 truncate flex-1">
          {title}
        </h3>
        <button
          onClick={(e) => {
            e.stopPropagation();
            editarClick(id);
          }}
          className="text-blue-500 hover:text-blue-700 p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1"
          title="Editar nota"
          aria-label="Editar nota"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <path d="M11 5H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h11a2 2 0 0 0 2-2v-5" />
            <path d="M18.375 2.625a1.767 1.767 0 0 1 2.5 2.5L12 14l-4 1 1-4 9.375-8.375Z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            eliminarClick(id);
          }}
          className="text-red-500 hover:text-red-700 ml-2 p-1 rounded focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-1"
          title="Eliminar nota"
          aria-label="Eliminar nota"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-5 h-5"
          >
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>
      </div>
      <p className="text-gray-600 line-clamp-4">{content}</p>
    </div>
  );
}
