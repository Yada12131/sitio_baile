'use client';

import { useState } from 'react';
import { Check, X, Send } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ServiceData {
    id: number;
    title: string;
    price: string;
}

interface ServiceRequestModalProps {
    selectedService: ServiceData | null;
    onClose: () => void;
}

export default function ServiceRequestModal({ selectedService, onClose }: ServiceRequestModalProps) {
    const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    async function handleRequest(e: React.FormEvent) {
        e.preventDefault();
        if (!selectedService) return;

        setStatus('loading');
        try {
            // Send to Contact API with specific subject
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    phone: formData.phone,
                    subject: `[Solicitud Servicio]: ${selectedService.title}`,
                    message: `Hola, estoy interesado en el servicio "${selectedService.title}" (${selectedService.price}). \n\nMensaje adicional: ${formData.message}`
                }),
            });

            if (res.ok) {
                setStatus('success');
                setFormData({ name: '', email: '', phone: '', message: '' });
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    }

    const handleClose = () => {
        setStatus('idle');
        onClose();
    };

    return (
        <AnimatePresence>
            {selectedService && (
                <motion.div
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-zinc-900 w-full max-w-md rounded-2xl border border-white/10 p-8 relative shadow-2xl"
                    >
                        <button
                            onClick={handleClose}
                            className="absolute top-4 right-4 text-gray-400 hover:text-white"
                        >
                            <X size={24} />
                        </button>

                        <h2 className="text-2xl font-bold mb-1 mr-6">Solicitar Servicio</h2>
                        <p className="font-semibold mb-6" style={{ color: 'var(--primary-color)' }}>{selectedService.title}</p>

                        {status === 'success' ? (
                            <div className="text-center py-8">
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="text-green-500" size={32} />
                                </div>
                                <h3 className="text-xl font-bold text-white mb-2">¡Solicitud Enviada!</h3>
                                <p className="text-gray-400">Te contactaremos pronto para darte más detalles.</p>
                                <button onClick={handleClose} className="mt-6 text-sm text-gray-400 underline">Cerrar</button>
                            </div>
                        ) : (
                            <form onSubmit={handleRequest} className="space-y-4">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Nombre Completo</label>
                                    <input
                                        type="text" required
                                        value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[var(--primary-color)] outline-none"
                                        placeholder="Tu nombre"
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Email</label>
                                        <input
                                            type="email" required
                                            value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })}
                                            className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[var(--primary-color)] outline-none"
                                            placeholder="tucorreo@ejemplo.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm text-gray-400 mb-1">Teléfono</label>
                                        <input
                                            type="tel" required
                                            value={formData.phone} onChange={e => setFormData({ ...formData, phone: e.target.value })}
                                            className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[var(--primary-color)] outline-none"
                                            placeholder="WhatsApp"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-1">Mensaje (Opcional)</label>
                                    <textarea
                                        rows={3}
                                        value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })}
                                        className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white focus:border-[var(--primary-color)] outline-none"
                                        placeholder="¿Tienes alguna pregunta específica?"
                                    />
                                </div>

                                {status === 'error' && <p className="text-red-500 text-sm text-center">Error al enviar. Intenta de nuevo.</p>}

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-3 font-bold rounded-lg hover:opacity-90 transition-opacity mt-4 flex items-center justify-center gap-2 text-white"
                                    style={{ background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))' }}
                                >
                                    {status === 'loading' ? 'Enviando...' : <><Send size={18} /> Solicitar Información</>}
                                </button>
                            </form>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
