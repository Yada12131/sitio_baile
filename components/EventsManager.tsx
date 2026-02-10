'use client';

import { useState } from 'react';
import { Trash2, Plus, Calendar, Image as ImageIcon, Edit, X, Save } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { useRouter } from 'next/navigation';

export default function EventsManager({ initialEvents }: { initialEvents: any[] }) {
    const [events, setEvents] = useState(initialEvents);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ title: '', date: '', description: '', image: '' });

    // Edit State
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editData, setEditData] = useState<any | null>(null);

    const router = useRouter();

    async function handleDelete(id: number) {
        if (!confirm('¿Estás seguro de eliminar este evento?')) return;

        const res = await fetch(`/api/events?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            setEvents(events.filter(e => e.id !== id));
            router.refresh();
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch('/api/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setIsAdding(false);
            setFormData({ title: '', date: '', description: '', image: '' });
            router.refresh();
            window.location.reload();
        }
    }

    // Edit Handlers
    const startEdit = (event: any) => {
        setIsEditing(event.id);
        setEditData({ ...event });
    };

    const cancelEdit = () => {
        setIsEditing(null);
        setEditData(null);
    };

    const saveEdit = async () => {
        if (!editData) return;
        const res = await fetch('/api/events', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData),
        });
        if (res.ok) {
            setIsEditing(null);
            setEditData(null);
            router.refresh();
            window.location.reload();
        }
    };

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
                            <ImageUpload
                                label="Imagen del Evento"
                                value={formData.image}
                                onChange={(url) => setFormData({ ...formData, image: url })}
                            />
                        </div>
                        <button type="submit" className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-gray-200">
                            Guardar Evento
                        </button>
                    </form>
                </div>
            )}

            <div className="space-y-6">
                {events.map((event) => (
                    <div key={event.id} className="bg-zinc-900 p-6 rounded-xl border border-white/10 flex flex-col md:flex-row gap-6 hover:border-pink-500/30 transition-colors">
                        <div className="w-full md:w-48 h-32 bg-zinc-800 rounded-lg flex-shrink-0 overflow-hidden relative">
                            {event.image ? (
                                <img src={event.image} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600"><ImageIcon size={32} /></div>
                            )}
                        </div>

                        <div className="flex-1">
                            {isEditing === event.id ? (
                                <div className="space-y-4">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            value={editData?.title}
                                            onChange={e => setEditData({ ...editData, title: e.target.value })}
                                            className="bg-zinc-800 p-2 rounded border border-pink-500/50 outline-none w-full text-white"
                                            placeholder="Título"
                                        />
                                        <input
                                            type="datetime-local"
                                            value={editData?.date}
                                            onChange={e => setEditData({ ...editData, date: e.target.value })}
                                            className="bg-zinc-800 p-2 rounded border border-pink-500/50 outline-none w-full text-white"
                                        />
                                    </div>
                                    <textarea
                                        rows={2}
                                        value={editData?.description}
                                        onChange={e => setEditData({ ...editData, description: e.target.value })}
                                        className="bg-zinc-800 p-2 rounded border border-pink-500/50 outline-none w-full text-white"
                                        placeholder="Descripción"
                                    />
                                    <ImageUpload
                                        label="Imagen"
                                        value={editData?.image || ''}
                                        onChange={(url) => setEditData({ ...editData, image: url })}
                                    />
                                    <div className="flex gap-2">
                                        <button onClick={saveEdit} className="flex items-center gap-1 bg-green-600 px-4 py-1.5 rounded-lg text-sm hover:bg-green-500 font-medium text-white">
                                            <Save size={16} /> Guardar
                                        </button>
                                        <button onClick={cancelEdit} className="flex items-center gap-1 bg-gray-600 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-500 font-medium text-white">
                                            <X size={16} /> Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="font-bold text-white text-xl">{event.title}</h3>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEdit(event)}
                                                className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 transition-colors"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(event.id)}
                                                className="p-2 bg-red-600/20 text-red-500 hover:bg-red-600/40 rounded-lg transition-colors"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm flex items-center gap-2 mb-2">
                                        <Calendar size={16} className="text-pink-500" />
                                        {new Date(event.date).toLocaleString()}
                                    </p>
                                    <p className="text-gray-300">{event.description}</p>
                                </>
                            )}
                        </div>
                    </div>
                ))}
                {events.length === 0 && !isAdding && (
                    <p className="text-center text-gray-500 py-10">No hay eventos registrados.</p>
                )}
            </div>
        </div>
    );
}
