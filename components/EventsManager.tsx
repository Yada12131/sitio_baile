'use client';

import { useState } from 'react';
import { Trash2, Plus, Calendar, Image as ImageIcon } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function EventsManager({ initialEvents }: { initialEvents: any[] }) {
    const [events, setEvents] = useState(initialEvents);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ title: '', date: '', description: '', image: '' });
    const router = useRouter();

    async function handleDelete(id: number) {
        if (!confirm('¿Estás seguro de eliminar este evento?')) return;

        await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
        setEvents(events.filter(e => e.id !== id));
        router.refresh();
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            const newEvent = await res.json(); // Usually returns success, we reload or push
            // Simple reload to get ID and normalized data
            setIsAdding(false);
            setFormData({ title: '', date: '', description: '', image: '' });
            router.refresh();
            // Optimistic update or waiting for refresh. 
            // Since we use router.refresh, the server component will re-render and pass new props, but strictly reacting to props change needs useEffect. 
            // For simplicity, we can fetch all again or just reload page.
            window.location.reload();
        }
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-white">Gestión de Eventos</h1>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors"
                >
                    {isAdding ? 'Cancelar' : <><Plus size={20} /> Nuevo Evento</>}
                </button>
            </div>

            {isAdding && (
                <div className="bg-zinc-900 p-6 rounded-xl border border-white/10 mb-8 animate-fade-in-up">
                    <h2 className="text-xl font-bold text-white mb-4">Agregar Nuevo Evento</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Título</label>
                                <input
                                    type="text" required
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white"
                                />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Fecha y Hora</label>
                                <input
                                    type="datetime-local" required
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Descripción</label>
                            <textarea
                                rows={3}
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white"
                            />
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">URL de Imagen (Opcional)</label>
                            <input
                                type="text"
                                value={formData.image}
                                onChange={e => setFormData({ ...formData, image: e.target.value })}
                                className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white"
                                placeholder="https://ejemplo.com/imagen.jpg"
                            />
                        </div>
                        <button type="submit" className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-gray-200">
                            Guardar Evento
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-4">
                {events.map((event) => (
                    <div key={event.id} className="bg-zinc-900 p-4 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center gap-4 hover:border-pink-500/30 transition-colors">
                        <div className="w-16 h-16 bg-zinc-800 rounded-lg flex-shrink-0 overflow-hidden">
                            {event.image ? (
                                <img src={event.image} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon size={24} /></div>
                            )}
                        </div>

                        <div className="flex-1">
                            <h3 className="font-bold text-white text-lg">{event.title}</h3>
                            <p className="text-gray-400 text-sm flex items-center gap-2">
                                <Calendar size={14} />
                                {new Date(event.date).toLocaleString()}
                            </p>
                        </div>

                        <button
                            onClick={() => handleDelete(event.id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Eliminar"
                        >
                            <Trash2 size={20} />
                        </button>
                    </div>
                ))}
                {events.length === 0 && !isAdding && (
                    <p className="text-center text-gray-500 py-10">No hay eventos registrados.</p>
                )}
            </div>
        </div>
    );
}
