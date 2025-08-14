interface ToggleAddProps {
  addBtn: boolean;
  setAddBtn: (val: boolean) => void;
}

export function ToggleAdd({ addBtn, setAddBtn }: ToggleAddProps) {
  return (
    <button
      type="button"
      onClick={() => setAddBtn(!addBtn)}
      className={`inline-flex items-center gap-2 rounded-lg border-2 border-blue-600 font-semibold bg-blue-600 px-4 py-2 text-white hover:bg-blue-100 hover:text-blue-600 transition-colors justify-self-end`}
    >
      {addBtn ? 'Cancelar' : 'Nueva nota +'}
    </button>
  );
}
