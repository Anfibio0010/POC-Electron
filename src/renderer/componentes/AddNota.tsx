import { useState } from 'react';


type AddNotaProps = {
	onNotaAgregada?: () => void;
};

const AddNota: React.FC<AddNotaProps> = ({ onNotaAgregada }) => {
	const [titulo, setTitulo] = useState('');
	const [contenido, setContenido] = useState('');
	const [guardando, setGuardando] = useState(false);
	const [ultimaNota, setUltimaNota] = useState<{
		id: number;
		title: string;
		content: string;
	} | null>(null);
	const [error, setError] = useState('');

	const handleAddNota = async () => {
		if (!titulo.trim() || !contenido.trim()) {
			setError('La nota no puede estar vacia');
			return;
		}
		setError('');
		setGuardando(true);
		try {
			await window.notasAPI.guardarNota(titulo, contenido);
			const nuevaNota = {
				id: Date.now(),
				title: titulo,
				content: contenido,
			};
			setUltimaNota(nuevaNota);
			setTitulo('');
			setContenido('');
			if (onNotaAgregada) onNotaAgregada();
		} catch (e: unknown) {
			alert(e instanceof Error ? e.message : 'error');
		}
		setGuardando(false);
	};

	return (
		<div className="bg-white rounded-lg shadow-md p-6 mb-8">
			<h2 className="text-xl font-semibold text-gray-800 mb-4">Add New Note</h2>
					<div className="space-y-4">
								{error && (
									<div className="text-red-500 text-sm mb-2 transition-opacity duration-300 animate-fadeIn">{error}
										<style>{`
											@keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
											.animate-fadeIn { animation: fadeIn 0.3s; }
										`}</style>
									</div>
								)}
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
				<button
					onClick={handleAddNota}
					className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 font-medium"
					disabled={guardando}
				>
					{guardando ? 'Saving...' : 'Add Note'}
				</button>
			</div>
			
		</div>
	);
};

export default AddNota;
