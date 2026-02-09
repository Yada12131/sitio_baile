'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, Image as ImageIcon } from 'lucide-react';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    description: string;
    image: string;
}

export default function TeamManager() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [newMember, setNewMember] = useState({ name: '', role: '', description: '', image: '' });
    const [editData, setEditData] = useState<TeamMember | null>(null);

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = () => {
        fetch('/api/team')
            .then(res => res.json())
            .then(data => setMembers(data));
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        await fetch('/api/team', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMember),
        });
        setNewMember({ name: '', role: '', description: '', image: '' });
        fetchMembers();
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este miembro?')) return;
        await fetch(`/api/team?id=${id}`, { method: 'DELETE' });
        fetchMembers();
    };

    const startEdit = (member: TeamMember) => {
        setIsEditing(member.id);
        setEditData(member);
    };

    const cancelEdit = () => {
        setIsEditing(null);
        setEditData(null);
    };

    const saveEdit = async () => {
        if (!editData) return;
        await fetch('/api/team', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData),
        });
        setIsEditing(null);
        setEditData(null);
        fetchMembers();
    };

    return (
        <div className="space-y-8 text-white relative z-10">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                    Gestión del Equipo
                </span>
            </h2>

            {/* Add Member Form */}
            <form onSubmit={handleAdd} className="bg-zinc-900/50 p-6 rounded-xl border border-white/10 space-y-4">
                <h3 className="text-xl font-semibold mb-4 text-pink-400">Agregar Nuevo Miembro</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        placeholder="Nombre Completo"
                        value={newMember.name}
                        onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                        className="bg-zinc-800 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 outline-none"
                        required
                    />
                    <input
                        placeholder="Rol / Cargo"
                        value={newMember.role}
                        onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                        className="bg-zinc-800 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 outline-none"
                        required
                    />
                    <input
                        placeholder="URL de la Foto (Ej: /images/foto.jpg)"
                        value={newMember.image}
                        onChange={e => setNewMember({ ...newMember, image: e.target.value })}
                        className="bg-zinc-800 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 outline-none md:col-span-2"
                    />
                    <textarea
                        placeholder="Descripción corta"
                        value={newMember.description}
                        onChange={e => setNewMember({ ...newMember, description: e.target.value })}
                        className="bg-zinc-800 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 outline-none md:col-span-2 min-h-[100px]"
                        required
                    />
                </div>
                <button type="submit" className="flex items-center gap-2 bg-gradient-to-r from-pink-600 to-purple-600 px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity">
                    <Plus size={20} /> Agregar Miembro
                </button>
            </form>

            <div className="grid grid-cols-1 gap-6">
                {members.map(member => (
                    <div key={member.id} className="bg-zinc-900/40 border border-white/10 p-6 rounded-xl flex flex-col md:flex-row gap-6 items-start hover:border-pink-500/30 transition-colors">

                        {/* Image Preview */}
                        <div className="w-24 h-24 flex-shrink-0 bg-zinc-800 rounded-full overflow-hidden border-2 border-white/10">
                            {member.image ? (
                                <img src={member.image} alt={member.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-500">
                                    <ImageIcon size={32} />
                                </div>
                            )}
                        </div>

                        <div className="flex-grow space-y-2 w-full">
                            {isEditing === member.id ? (
                                // Edit Mode
                                <div className="grid gap-3">
                                    <input
                                        value={editData?.name}
                                        onChange={e => setEditData({ ...editData!, name: e.target.value })}
                                        className="bg-zinc-800 p-2 rounded border border-pink-500/50 outline-none"
                                        placeholder="Nombre"
                                    />
                                    <input
                                        value={editData?.role}
                                        onChange={e => setEditData({ ...editData!, role: e.target.value })}
                                        className="bg-zinc-800 p-2 rounded border border-pink-500/50 outline-none"
                                        placeholder="Rol"
                                    />
                                    <input
                                        value={editData?.image}
                                        onChange={e => setEditData({ ...editData!, image: e.target.value })}
                                        className="bg-zinc-800 p-2 rounded border border-pink-500/50 outline-none"
                                        placeholder="URL Imagen"
                                    />
                                    <textarea
                                        value={editData?.description}
                                        onChange={e => setEditData({ ...editData!, description: e.target.value })}
                                        className="bg-zinc-800 p-2 rounded border border-pink-500/50 outline-none min-h-[80px]"
                                        placeholder="Descripción"
                                    />
                                    <div className="flex gap-2 mt-2">
                                        <button onClick={saveEdit} className="flex items-center gap-1 bg-green-600 px-3 py-1 rounded text-sm hover:bg-green-500">
                                            <Save size={16} /> Guardar
                                        </button>
                                        <button onClick={cancelEdit} className="flex items-center gap-1 bg-gray-600 px-3 py-1 rounded text-sm hover:bg-gray-500">
                                            <X size={16} /> Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <>
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="text-xl font-bold text-white">{member.name}</h3>
                                            <p className="text-pink-400 text-sm font-semibold uppercase">{member.role}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEdit(member)}
                                                className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 transition-colors"
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(member.id)}
                                                className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/40 transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm leading-relaxed">{member.description}</p>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
