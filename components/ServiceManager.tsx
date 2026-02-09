'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign, Tag, Image as ImageIcon } from 'lucide-react';

interface Service {
    id: number;
    title: string;
    description: string;
    price: string;
    category: string;
    image: string;
}

export default function ServiceManager() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [newService, setNewService] = useState({
        title: '',
        description: '',
        price: '',
        category: 'Eventos',
        image: ''
    });

    useEffect(() => {
        fetchServices();
    }, []);

    const fetchServices = async () => {
        const res = await fetch('/api/services');
        const data = await res.json();
        setServices(data);
        setLoading(false);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        const res = await fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newService),
        });
        if (res.ok) {
            setNewService({ title: '', description: '', price: '', category: 'Eventos', image: '' });
            fetchServices();
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
        const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
        if (res.ok) fetchServices();
    };

    const categories = ['Eventos', 'Shows', 'Multimedia', 'Clases', 'Otros'];

    return (
        <div className="space-y-6 max-w-4xl">
            <h2 className="text-2xl font-bold text-white mb-6">Gestión de Servicios</h2>

            <form onSubmit={handleAdd} className="bg-zinc-900/50 p-6 rounded-xl border border-white/10 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text" placeholder="Título del Servicio" required
                        value={newService.title} onChange={e => setNewService({ ...newService, title: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded p-2 text-white"
                    />
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input
                            type="text" placeholder="Precio (ej. $500.000 COP)" required
                            value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded p-2 pl-10 text-white"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Tag className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <select
                            value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded p-2 pl-10 text-white appearance-none"
                        >
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                    <div className="relative">
                        <ImageIcon className="absolute left-3 top-2.5 text-gray-400" size={16} />
                        <input
                            type="text" placeholder="URL de Imagen (Opcional)"
                            value={newService.image} onChange={e => setNewService({ ...newService, image: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded p-2 pl-10 text-white"
                        />
                    </div>
                </div>

                <textarea
                    placeholder="Descripción del servicio" required
                    value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded p-2 text-white h-24"
                />

                <button type="submit" className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded flex items-center gap-2 text-sm font-medium">
                    <Plus size={16} /> Agregar Servicio
                </button>
            </form>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {loading ? <p className="text-gray-500">Cargando...</p> : services.map((service) => (
                    <div key={service.id} className="bg-zinc-900 border border-white/10 p-4 rounded-lg flex flex-col justify-between group hover:border-pink-500/30 transition-colors">
                        <div>
                            <div className="flex justify-between items-start mb-2">
                                <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/10 text-white/70">
                                    {service.category}
                                </span>
                                <button onClick={() => handleDelete(service.id)} className="text-gray-500 hover:text-red-400 transition-colors">
                                    <Trash2 size={18} />
                                </button>
                            </div>
                            <h4 className="font-bold text-white text-lg">{service.title}</h4>
                            <p className="text-pink-400 font-medium mb-2">{service.price}</p>
                            <p className="text-sm text-gray-400 line-clamp-3">{service.description}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
