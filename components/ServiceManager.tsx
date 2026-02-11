'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, DollarSign, Tag, Image as ImageIcon, Edit, Save, X } from 'lucide-react';
import ImageUpload from './ImageUpload';

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
        category: '',
        image: ''
    });

    const [categories, setCategories] = useState<{ id: number, name: string }[]>([]);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [showCategoryInput, setShowCategoryInput] = useState(false);

    // Editing State
    const [isEditing, setIsEditing] = useState<number | null>(null);
    const [editData, setEditData] = useState<Service | null>(null);

    useEffect(() => {
        fetchServices();
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const res = await fetch('/api/service-categories');
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
                // Set default category if none selected and categories exist
                if (data.length > 0 && !newService.category) {
                    setNewService(prev => ({ ...prev, category: data[0].name }));
                }
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;

        try {
            const res = await fetch('/api/service-categories', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: newCategoryName.trim() })
            });

            if (res.ok) {
                await fetchCategories();
                setNewCategoryName('');
                setShowCategoryInput(false);
            }
        } catch (error) {
            console.error('Error creating category:', error);
        }
    };

    const handleDeleteCategory = async (id: number) => {
        if (!confirm('¿Eliminar esta categoría?')) return;
        try {
            await fetch(`/api/service-categories?id=${id}`, { method: 'DELETE' });
            fetchCategories();
        } catch (error) {
            console.error(error);
        }
    };

    const fetchServices = async () => {
        try {
            const res = await fetch('/api/services');
            if (res.ok) {
                const data = await res.json();
                setServices(data);
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        // Use first category as default if empty
        const categoryToUse = newService.category || (categories.length > 0 ? categories[0].name : 'General');

        const res = await fetch('/api/services', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...newService, category: categoryToUse }),
        });
        if (res.ok) {
            setNewService({ title: '', description: '', price: '', category: categories.length > 0 ? categories[0].name : '', image: '' });
            fetchServices();
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Estás seguro de eliminar este servicio?')) return;
        const res = await fetch(`/api/services?id=${id}`, { method: 'DELETE' });
        if (res.ok) fetchServices();
    };

    // Edit Handlers
    const startEdit = (service: Service) => {
        setIsEditing(service.id);
        setEditData({ ...service });
    };

    const cancelEdit = () => {
        setIsEditing(null);
        setEditData(null);
    };

    const saveEdit = async () => {
        if (!editData) return;
        const res = await fetch('/api/services', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editData),
        });
        if (res.ok) {
            setIsEditing(null);
            setEditData(null);
            fetchServices();
        }
    };

    // const categories = ['Eventos', 'Shows', 'Multimedia', 'Clases', 'Otros']; // Replaced by dynamic state

    return (
        <div className="space-y-8 max-w-4xl text-white">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-2">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-purple-500">
                    Gestión de Servicios
                </span>
            </h2>

            {/* Add Form */}
            <form onSubmit={handleAdd} className="bg-zinc-900/50 p-6 rounded-xl border border-white/10 space-y-4 shadow-lg">
                <h3 className="text-xl font-semibold mb-4 text-pink-400">Nuevo Servicio</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input
                        type="text" placeholder="Título del Servicio" required
                        value={newService.title} onChange={e => setNewService({ ...newService, title: e.target.value })}
                        className="bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:ring-2 focus:ring-pink-500 outline-none"
                    />
                    <div className="relative">
                        <DollarSign className="absolute left-3 top-3 text-gray-400" size={18} />
                        <input
                            type="text" placeholder="Precio (ej. $500.000 COP)" required
                            value={newService.price} onChange={e => setNewService({ ...newService, price: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 pl-10 text-white focus:ring-2 focus:ring-pink-500 outline-none"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Tag className="absolute left-3 top-3 text-gray-400" size={18} />
                        <select
                            value={newService.category} onChange={e => setNewService({ ...newService, category: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded-lg p-3 pl-10 text-white appearance-none focus:ring-2 focus:ring-pink-500 outline-none mb-2"
                        >
                            {categories.map(cat => (
                                <option key={cat.id} value={cat.name} className="bg-zinc-900">{cat.name}</option>
                            ))}
                        </select>
                        <div className="flex gap-2">
                            <button type="button" onClick={() => setShowCategoryInput(!showCategoryInput)} className="text-xs text-pink-400 hover:text-pink-300 underline">
                                {showCategoryInput ? 'Cancelar' : '+ Nueva Categoría'}
                            </button>
                        </div>
                        {showCategoryInput && (
                            <div className="flex gap-2 mt-2">
                                <input
                                    type="text"
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Nombre de categoría"
                                    className="bg-black/50 border border-white/10 rounded px-2 py-1 text-sm flex-1"
                                />
                                <button type="button" onClick={handleAddCategory} className="bg-pink-600 px-3 py-1 rounded text-xs font-bold">
                                    OK
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="relative">
                        <ImageUpload
                            label="Imagen del Servicio"
                            value={newService.image}
                            onChange={(url) => setNewService({ ...newService, image: url })}
                        />
                    </div>
                </div>

                <textarea
                    placeholder="Descripción del servicio" required
                    value={newService.description} onChange={e => setNewService({ ...newService, description: e.target.value })}
                    className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white h-24 focus:ring-2 focus:ring-pink-500 outline-none"
                />

                <button type="submit" className="bg-gradient-to-r from-pink-600 to-purple-600 hover:opacity-90 text-white px-6 py-2 rounded-lg flex items-center gap-2 font-bold transition-all">
                    <Plus size={20} /> Agregar Servicio
                </button>
            </form>

            <div className="grid grid-cols-1 gap-6">
                {loading ? <p className="text-gray-500">Cargando...</p> : services.map((service) => (
                    <div key={service.id} className="bg-zinc-900 border border-white/10 p-6 rounded-xl flex flex-col md:flex-row gap-6 items-start hover:border-pink-500/30 transition-colors">

                        {/* Image Preview */}
                        <div className="w-full md:w-48 h-32 flex-shrink-0 bg-zinc-800 rounded-lg overflow-hidden border border-white/5 relative group">
                            {service.image ? (
                                <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-600">
                                    <ImageIcon size={32} />
                                </div>
                            )}
                        </div>

                        <div className="flex-grow w-full">
                            {isEditing === service.id ? (
                                // Edit Mode
                                <div className="space-y-3">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <input
                                            value={editData?.title}
                                            onChange={e => setEditData({ ...editData!, title: e.target.value })}
                                            className="bg-zinc-800 p-2 rounded border border-pink-500/50 outline-none w-full"
                                            placeholder="Título"
                                        />
                                        <input
                                            value={editData?.price}
                                            onChange={e => setEditData({ ...editData!, price: e.target.value })}
                                            className="bg-zinc-800 p-2 rounded border border-pink-500/50 outline-none w-full"
                                            placeholder="Precio"
                                        />
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        <select
                                            value={editData?.category}
                                            onChange={e => setEditData({ ...editData!, category: e.target.value })}
                                            className="bg-zinc-800 p-2 rounded border border-pink-500/50 outline-none w-full"
                                        >
                                            {categories.map(cat => <option key={cat.id} value={cat.name}>{cat.name}</option>)}
                                        </select>
                                        <div className="w-full">
                                            <ImageUpload
                                                label="Imagen"
                                                value={editData?.image || ''}
                                                onChange={(url) => setEditData({ ...editData!, image: url })}
                                            />
                                        </div>
                                    </div>
                                    <textarea
                                        value={editData?.description}
                                        onChange={e => setEditData({ ...editData!, description: e.target.value })}
                                        className="bg-zinc-800 p-2 rounded border border-pink-500/50 outline-none w-full min-h-[80px]"
                                        placeholder="Descripción"
                                    />
                                    <div className="flex gap-2 pt-2">
                                        <button onClick={saveEdit} className="flex items-center gap-1 bg-green-600 px-4 py-1.5 rounded-lg text-sm hover:bg-green-500 font-medium">
                                            <Save size={16} /> Guardar Cambios
                                        </button>
                                        <button onClick={cancelEdit} className="flex items-center gap-1 bg-gray-600 px-4 py-1.5 rounded-lg text-sm hover:bg-gray-500 font-medium">
                                            <X size={16} /> Cancelar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                // View Mode
                                <>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className="text-xs font-bold px-3 py-1 rounded-full bg-pink-500/20 text-pink-300 uppercase tracking-wider mb-2 inline-block">
                                                {service.category}
                                            </span>
                                            <h4 className="font-bold text-white text-xl">{service.title}</h4>
                                        </div>
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => startEdit(service)}
                                                className="p-2 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/40 transition-colors"
                                                title="Editar"
                                            >
                                                <Edit size={18} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(service.id)}
                                                className="p-2 bg-red-600/20 text-red-400 rounded-lg hover:bg-red-600/40 transition-colors"
                                                title="Eliminar"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                    <p className="text-pink-400 font-bold text-lg mb-3">{service.price}</p>
                                    <p className="text-gray-400 leading-relaxed text-sm">{service.description}</p>
                                </>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
