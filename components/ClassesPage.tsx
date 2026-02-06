'use client';

import { useState } from 'react';
import { Users, Calendar, Clock, Check, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ClassData {
    id: number;
    name: string;
    instructor: string;
    schedule: string;
    capacity: number;
}

export default function ClassesPage({ classes }: { classes: ClassData[] }) {
    const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
    const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    async function handleRegister(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedClass) return;

        setStatus('loading');
        const res = await fetch('/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...formData, class_id: selectedClass.id }),
        });

        if (res.ok) {
            setStatus('success');
            setFormData({ name: '', email: '', phone: '' });
        } else {
            setStatus('error');
        }
    }

    return (
        <div className="bg-black min-h-screen text-white pt-10 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-8 text-center bg-gradient-to-r from-pink-500 to-green-500 bg-clip-text text-transparent">
                    Clases de Baile
                </h1>
                <p className="text-gray-400 text-center max-w-2xl mx-auto mb-16 text-lg">
                    Aprende a bailar con los mejores instructores. Ofrecemos clases para todos los niveles, desde principiantes hasta avanzados.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {classes.map((cls) => (
                        <div key={cls.id} className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 hover:border-green-500/50 transition-all group p-6 flex flex-col">
                            <h3 className="text-2xl font-bold text-white mb-2">{cls.name}</h3>
                            <p className="text-pink-500 font-semibold mb-4">{cls.instructor}</p>

                            <div className="space-y-3 mb-8 flex-1 text-gray-300">
                                <div className="flex items-center gap-3">
                                    <Calendar className="text-green-500" size={18} />
                                    <span>{cls.schedule}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Users className="text-green-500" size={18} />
                                    <span>Cupo limitado: {cls.capacity} personas</span>
                                </div>
                            </div>

                            <button
                                onClick={() => { setSelectedClass(cls); setStatus('idle'); }}
                                className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-green-400 transition-colors"
                            >
                                Inscribirme
                            </button>
                        </div>
                    ))}
                </div>

                {classes.length === 0 && (
                    <p className="text-center text-gray-500 text-xl mt-10">Muy pronto publicaremos nuestros horarios.</p>
                )}
            </div>

            {/* Registration Modal */}
            <AnimatePresence>
                {selectedClass && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-zinc-900 w-full max-w-md rounded-2xl border border-white/10 p-8 relative shadow-2xl"
                        >
                            <button
                                onClick={() => setSelectedClass(null)}
                                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                            >
                                <X size={24} />
                            </button>

                            <h2 className="text-2xl font-bold mb-1">Pre-inscripción</h2>
                            <p className="text-purple-400 font-semibold mb-6">{selectedClass.name}</p>

                            {status === 'success' ? (
                                <div className="text-center py-8">
                                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                        <Check className="text-green-500" size={32} />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">¡Inscripción Exitosa!</h3>
                                    <p className="text-gray-400">Te contactaremos pronto para confirmar tu cupo.</p>
                                    <button onClick={() => setSelectedClass(null)} className="mt-6 text-sm text-gray-400 underline">Cerrar</button>
                                </div>
                            ) : (
                                <form onSubmit={handleRegister} className="space-y-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Nombre Completo</label>
                                        <input
                                            type="text" required
                                            value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Correo Electrónico</label>
                                        <input
                                            type="email" required
                                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Teléfono (WhatsApp)</label>
                                        <input
                                            type="tel"
                                            value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white"
                                        />
                                    </div>

                                    {status === 'error' && <p className="text-red-500 text-sm text-center">Error al inscribir. Intenta de nuevo.</p>}

                                    <button
                                        type="submit"
                                        disabled={status === 'loading'}
                                        className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 font-bold rounded-lg hover:opacity-90 transition-opacity mt-4"
                                    >
                                        {status === 'loading' ? 'Procesando...' : 'Confirmar Inscripción'}
                                    </button>
                                </form>
                            )}
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
