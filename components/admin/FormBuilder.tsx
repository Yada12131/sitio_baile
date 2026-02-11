'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, Save, X, MoveUp, MoveDown } from 'lucide-react';

interface FormField {
    id: number;
    label: string;
    name: string;
    type: string;
    required: boolean;
    order_index: number;
    options?: string;
}

export default function FormBuilder() {
    const [fields, setFields] = useState<FormField[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState<Partial<FormField>>({});

    const [newField, setNewField] = useState({
        label: '',
        name: '',
        type: 'text',
        required: true,
        options: ''
    });

    useEffect(() => {
        fetchFields();
    }, []);

    const fetchFields = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/form-fields?type=affiliate');
            if (res.ok) {
                const data = await res.json();
                setFields(data);
            }
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddField = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const maxOrder = fields.length > 0 ? Math.max(...fields.map(f => f.order_index)) : 0;
            const res = await fetch('/api/form-fields', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...newField,
                    form_type: 'affiliate',
                    order_index: maxOrder + 1
                })
            });

            if (res.ok) {
                setNewField({ label: '', name: '', type: 'text', required: true, options: '' });
                fetchFields();
                alert('Campo agregado correctamente');
            } else {
                const err = await res.json();
                alert('Error al agregar campo: ' + (err.error || 'Unknown error'));
            }
        } catch (error) {
            console.error(error);
            alert('Error de conexión o servidor');
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('¿Eliminar este campo? Los datos antiguos asociados podrían dejar de ser visibles.')) return;
        await fetch(`/api/form-fields?id=${id}`, { method: 'DELETE' });
        fetchFields();
    };

    const startEdit = (field: FormField) => {
        setEditingId(field.id);
        setEditForm(field);
    };

    const cancelEdit = () => {
        setEditingId(null);
        setEditForm({});
    };

    const saveEdit = async () => {
        await fetch('/api/form-fields', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(editForm)
        });
        setEditingId(null);
        fetchFields();
    };

    const moveField = async (id: number, direction: 'up' | 'down') => {
        const index = fields.findIndex(f => f.id === id);
        if (index === -1) return;
        if (direction === 'up' && index === 0) return;
        if (direction === 'down' && index === fields.length - 1) return;

        const otherIndex = direction === 'up' ? index - 1 : index + 1;
        const currentField = fields[index];
        const swapField = fields[otherIndex];

        // Swap order_index locally then save both
        const newOrderCurrent = swapField.order_index;
        const newOrderSwap = currentField.order_index;

        await Promise.all([
            fetch('/api/form-fields', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...currentField, order_index: newOrderCurrent })
            }),
            fetch('/api/form-fields', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ ...swapField, order_index: newOrderSwap })
            })
        ]);

        fetchFields();
    };

    // Auto-generate name from label if empty
    const handleLabelChange = (val: string) => {
        setNewField(prev => ({
            ...prev,
            label: val,
            name: prev.name ? prev.name : val.toLowerCase().replace(/\s+/g, '_').replace(/á/g, 'a').replace(/é/g, 'e').replace(/í/g, 'i').replace(/ó/g, 'o').replace(/ú/g, 'u').replace(/ñ/g, 'n')
        }));
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form Preview / List */}
            <div className="lg:col-span-2 space-y-4">
                <h3 className="text-xl font-bold mb-4 text-pink-400">Campos del Formulario</h3>
                <div className="bg-zinc-900/50 border border-white/10 rounded-xl overflow-hidden">
                    {loading ? (
                        <div className="p-8 text-center text-gray-500">Cargando campos...</div>
                    ) : fields.length === 0 ? (
                        <div className="p-8 text-center text-gray-500">No hay campos configurados.</div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {fields.map((field, idx) => (
                                <div key={field.id} className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-3">
                                        <div className="flex flex-col gap-1 text-gray-600">
                                            <button onClick={() => moveField(field.id, 'up')} disabled={idx === 0} className="hover:text-white disabled:opacity-20"><MoveUp size={14} /></button>
                                            <button onClick={() => moveField(field.id, 'down')} disabled={idx === fields.length - 1} className="hover:text-white disabled:opacity-20"><MoveDown size={14} /></button>
                                        </div>
                                        <div className="bg-zinc-800 px-3 py-1 rounded text-xs font-mono text-gray-400 w-8 text-center">{field.order_index}</div>

                                        {editingId === field.id ? (
                                            <div className="flex flex-col gap-2">
                                                <input
                                                    value={editForm.label}
                                                    onChange={e => setEditForm({ ...editForm, label: e.target.value })}
                                                    className="bg-zinc-800 p-1 rounded border border-pink-500/50 outline-none text-sm"
                                                    placeholder="Etiqueta"
                                                />
                                                <div className="flex gap-2">
                                                    <input
                                                        value={editForm.name}
                                                        onChange={e => setEditForm({ ...editForm, name: e.target.value })}
                                                        className="bg-zinc-800 p-1 rounded border border-pink-500/50 outline-none text-xs font-mono"
                                                        placeholder="variable_name"
                                                    />
                                                    <select
                                                        value={editForm.type}
                                                        onChange={e => setEditForm({ ...editForm, type: e.target.value })}
                                                        className="bg-zinc-800 p-1 rounded border border-pink-500/50 outline-none text-xs"
                                                    >
                                                        <option value="text">Texto</option>
                                                        <option value="email">Email</option>
                                                        <option value="tel">Teléfono</option>
                                                        <option value="number">Número</option>
                                                        <option value="date">Fecha</option>
                                                        <option value="textarea">Comentarios</option>
                                                        <option value="select">Lista (Select)</option>
                                                    </select>
                                                </div>
                                            </div>
                                        ) : (
                                            <div>
                                                <p className="font-bold text-white">{field.label} {field.required && <span className="text-red-500">*</span>}</p>
                                                <p className="text-xs text-gray-500 font-mono">name: {field.name} | type: {field.type}</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        {editingId === field.id ? (
                                            <>
                                                <button onClick={saveEdit} className="p-2 bg-green-600/20 text-green-400 rounded hover:bg-green-600/40"><Save size={16} /></button>
                                                <button onClick={cancelEdit} className="p-2 bg-gray-600/20 text-gray-400 rounded hover:bg-gray-600/40"><X size={16} /></button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEdit(field)} className="p-2 bg-blue-600/20 text-blue-400 rounded hover:bg-blue-600/40 opacity-0 group-hover:opacity-100 transition-opacity"><Edit size={16} /></button>
                                                <button onClick={() => handleDelete(field.id)} className="p-2 bg-red-600/20 text-red-400 rounded hover:bg-red-600/40 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16} /></button>
                                            </>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Add New Field Form */}
            <div className="bg-zinc-900/50 p-6 rounded-xl border border-white/10 h-fit space-y-4">
                <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <Plus size={20} className="text-green-500" /> Nuevo Campo
                </h3>
                <form onSubmit={handleAddField} className="space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Etiqueta visible</label>
                        <input
                            type="text" required
                            value={newField.label}
                            onChange={e => handleLabelChange(e.target.value)}
                            className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm focus:border-pink-500 outline-none block"
                            placeholder="Ej. Instagram"
                        />
                    </div>
                    <div>
                        <label className="block text-xs text-gray-400 mb-1">Nombre variable (interno)</label>
                        <input
                            type="text" required
                            value={newField.name}
                            onChange={e => setNewField({ ...newField, name: e.target.value })}
                            className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm font-mono text-gray-300 focus:border-pink-500 outline-none block"
                            placeholder="ej. instagram_user"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Tipo de Dato</label>
                            <select
                                value={newField.type}
                                onChange={e => setNewField({ ...newField, type: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm focus:border-pink-500 outline-none block"
                            >
                                <option value="text">Texto Corto</option>
                                <option value="email">Email</option>
                                <option value="tel">Teléfono</option>
                                <option value="number">Número</option>
                                <option value="date">Fecha</option>
                                <option value="textarea">Texto Largo</option>
                                <option value="select">Lista Desplegable</option>
                            </select>
                        </div>
                        <div className="flex items-end pb-2">
                            <label className="flex items-center gap-2 text-sm cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={newField.required}
                                    onChange={e => setNewField({ ...newField, required: e.target.checked })}
                                    className="w-4 h-4 rounded accent-pink-500"
                                />
                                Obligatorio
                            </label>
                        </div>
                    </div>

                    {newField.type === 'select' && (
                        <div>
                            <label className="block text-xs text-gray-400 mb-1">Opciones (separadas por coma)</label>
                            <input
                                type="text"
                                value={newField.options}
                                onChange={e => setNewField({ ...newField, options: e.target.value })}
                                className="w-full bg-black/50 border border-white/10 rounded px-3 py-2 text-sm focus:border-pink-500 outline-none block"
                                placeholder="Opción A, Opción B, ..."
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity mt-4"
                    >
                        Agregar Campo
                    </button>
                </form>
            </div>
        </div>
    );
}
