type Nota = {
  title: string;
  content: string;
};
export function AddNota({
  newNote,
  setNewNote,
  addNote,
}: {
  newNote: Nota;
  setNewNote: (note: Nota) => void;
  addNote: () => void;
}) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Note</h2>
      <div className="space-y-4">
        <input
          type="text"
          placeholder="Note title..."
          value={newNote.title}
          onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
        />
        <textarea
          placeholder="Note content..."
          value={newNote.content}
          onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
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
  );
}
