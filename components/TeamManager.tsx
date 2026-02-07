'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Users } from 'lucide-react';

interface TeamMember {
    id: number;
    name: string;
    role: string;
    description: string;
}

export default function TeamManager() {
    const [members, setMembers] = useState<TeamMember[]>([]);
    const [loading, setLoading] = useState(true);
    const [newMember, setNewMember] = useState({ name: '', role: '', description: '' });

    useEffect(() => {
        fetchMembers();
    }, []);

    const fetchMembers = async () => {
        const res = await fetch('/api/team');
        const data = await res.json();
        setMembers(data);
        setLoading(false);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/team', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newMember),
        });
        if (res.ok) {
            setNewMember({ name: '', role: '', description: '' });
            fetchMembers();
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar a este miembro del equipo?')) return;
        const res = await fetch(`/api/team?id=${id}`, { method: 'DELETE' });
        if (res.ok) fetchMembers();
    };

    return (
        <div className="space-y-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-white mb-6">Gestión del Equipo</h2>

            <form onSubmit={handleAdd} className="bg-zinc-900/50 p-6 rounded-xl border border-white/10 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text" placeholder="Nombre" required
                        value={newMember.name} onChange={e => setNewMember({ ...newMember, name: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded p-2 text-white"
                    />
                    <input
                        type="text" placeholder="Rol (ej. Fundador, Bartender)" required
                        value={newMember.role} onChange={e => setNewMember({ ...newMember, role: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded p-2 text-white"
                    />
                </div>
                <textarea
                    placeholder="Descripción breve" required
                    value={newMember.description} onChange={e => setNewMember({ ...newMember, description: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-white h-20"
                />
                <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm">
                    <Plus size={16} /> Agregar Miembro
                </button>
            </form>

            <div className="space-y-2">
                {loading ? <p className="text-gray-500">Cargando...</p> : members.map((member) => (
                    <div key={member.id} className="bg-zinc-900 border border-white/10 p-4 rounded-lg flex justify-between items-center">
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center">
                                <Users size={20} className="text-gray-400" />
                            </div>
                            <div>
                                <h4 className="font-bold text-white">{member.name}</h4>
                                <p className="text-sm text-pink-500">{member.role}</p>
                            </div>
                        </div>
                        <button onClick={() => handleDelete(member.id)} className="text-red-400 hover:text-red-300">
                            <Trash2 size={18} />
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
}
