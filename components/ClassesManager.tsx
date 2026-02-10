'use client';

import { useState } from 'react';
import { Trash2, Plus, Users, Calendar, User, Edit, Save, X, Image as ImageIcon } from 'lucide-react';
import ImageUpload from './ImageUpload';
import { useRouter } from 'next/navigation';

export default function ClassesManager({ initialClasses }: { initialClasses: any[] }) {
    const [classes, setClasses] = useState(initialClasses);
    const [isAdding, setIsAdding] = useState(false);
    const [formData, setFormData] = useState({ name: '', instructor: '', schedule: '', capacity: 20, image: '' });

    // Edit State
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editData, setEditData] = useState<any | null>(null);

    const router = useRouter();

    async function handleDelete(id: number) {
        if (!confirm('¿Seguro que deseas eliminar esta clase?')) return;
        const res = await fetch(`/api/classes?id=${id}`, { method: 'DELETE' });
        if (res.ok) {
            setClasses(classes.filter(c => c.id !== id));
            router.refresh();
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        const res = await fetch('/api/classes', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData),
        });

        if (res.ok) {
            setIsAdding(false);
            setFormData({ name: '', instructor: '', schedule: '', capacity: 20, image: '' });
            router.refresh();
            window.location.reload();
        }
    }

    // Edit Handlers
    const startEdit = (cls: any) => {
        setIsEditing(cls.id);
        setEditData({ ...cls });
    };

    const cancelEdit = () => {
        setIsEditing(null);
        setEditData(null);
    };

    const saveEdit = async () => {
        if (!editData) return;
        const res = await fetch('/api/classes', {
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
                <h1 className="text-3xl font-bold text-white">Gestión de Clases</h1>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-bold transition-colors"
                >
                    {isAdding ? 'Cancelar' : <><Plus size={20} /> Nueva Clase</>}
                </button>
            </div>

            {isAdding && (
                <div className="bg-zinc-900 p-6 rounded-xl border border-white/10 mb-8 animate-fade-in-up">
                    <h2 className="text-xl font-bold text-white mb-4">Agregar Nueva Clase</h2>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Nombre de la Clase</label>
                                <input type="text" required value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white" placeholder="Ej: Salsa Casino" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Instructor</label>
                                <input type="text" required value={formData.instructor} onChange={e => setFormData({ ...formData, instructor: e.target.value })} className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white" placeholder="Ej: Juan Pérez" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Horario</label>
                                <input type="text" required value={formData.schedule} onChange={e => setFormData({ ...formData, schedule: e.target.value })} className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white" placeholder="Ej: Lunes y Miércoles 7pm" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Capacidad Máxima</label>
                                <input type="number" required value={formData.capacity} onChange={e => setFormData({ ...formData, capacity: parseInt(e.target.value) })} className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white" />
                            </div>
                            <div className="md:col-span-2">
                                <ImageUpload
                                    label="Imagen de la Clase"
                                    value={formData.image}
                                    onChange={(url) => setFormData({ ...formData, image: url })}
                                />
                            </div>
                        </div>
                        <button type="submit" className="bg-white text-black font-bold px-6 py-2 rounded-lg hover:bg-gray-200">Guardar Clase</button>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {classes.map((cls) => (
                    <div key={cls.id} className="bg-zinc-900 p-6 rounded-xl border border-white/10 hover:border-pink-500/30 transition-all">
                        {isEditing === cls.id ? (
                            <div className="space-y-3">
                                <input
                                    value={editData?.name}
                                    onChange={e => setEditData({ ...editData, name: e.target.value })}
                                    className="bg-zinc-800 p-2 rounded border border-pink-500/50 outline-none w-full text-white"
                                    placeholder="Nombre de Clase"
                                />
                                <input
                                    value={editData?.instructor}
                                    onChange={e => setEditData({ ...editData, instructor: e.target.value })}
                                    className="bg-zinc-800 p-2 rounded border border-pink-500/50 outline-none w-full text-white"
                                    placeholder="Instructor"
                                />
                                <input
                                    value={editData?.schedule}
                                    onChange={e => setEditData({ ...editData, schedule: e.target.value })}
                                    className="bg-zinc-800 p-2 rounded border border-pink-500/50 outline-none w-full text-white"
                                    placeholder="Horario"
                                />
                                <input
                                    type="number"
                                    value={editData?.capacity}
                                    onChange={e => setEditData({ ...editData, capacity: parseInt(e.target.value) })}
                                    className="bg-zinc-800 p-2 rounded border border-pink-500/50 outline-none w-full text-white"
                                    placeholder="Capacidad"
                                />
                                <ImageUpload
                                    label="Imagen"
                                    value={editData?.image || ''}
                                    onChange={(url) => setEditData({ ...editData, image: url })}
                                />
                                <div className="flex gap-2 pt-2">
                                    <button onClick={saveEdit} className="w-full bg-green-600 py-1.5 rounded-lg text-sm hover:bg-green-500 font-medium text-white flex justify-center items-center gap-1">
                                        <Save size={16} /> Guardar
                                    </button>
                                    <button onClick={cancelEdit} className="w-full bg-gray-600 py-1.5 rounded-lg text-sm hover:bg-gray-500 font-medium text-white flex justify-center items-center gap-1">
                                        <X size={16} /> Cancelar
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <div className="flex justify-between items-start mb-4">
                                    <h3 className="text-xl font-bold text-white">{cls.name}</h3>
                                    <div className="flex gap-2">
                                        <button onClick={() => startEdit(cls)} className="text-blue-400 hover:text-blue-300">
                                            <Edit size={18} />
                                        </button>
                                        <button onClick={() => handleDelete(cls.id)} className="text-red-500 hover:text-red-400">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>

                                <div className="space-y-2 text-gray-300 text-sm">
                                    <div className="flex items-center gap-2"><User size={16} className="text-pink-500" /> <span>{cls.instructor}</span></div>
                                    <div className="flex items-center gap-2"><Calendar size={16} className="text-pink-500" /> <span>{cls.schedule}</span></div>
                                    <div className="flex items-center gap-2"><Users size={16} className="text-pink-500" /> <span>Cupo: {cls.capacity}</span></div>
                                </div>

                                {cls.image && (
                                    <div className="mt-4 h-32 w-full rounded-lg overflow-hidden border border-white/10">
                                        <img src={cls.image} alt={cls.name} className="w-full h-full object-cover" />
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                ))}
                {classes.length === 0 && !isAdding && (
                    <p className="text-gray-500 col-span-full text-center py-10">No hay clases registradas.</p>
                )}
            </div>
        </div>
    );
}
