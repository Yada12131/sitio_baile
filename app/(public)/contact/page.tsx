'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Contact() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus('loading');
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (res.ok) {
                setStatus('success');
                (e.target as HTMLFormElement).reset();
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    }

    return (
        <div className="bg-black min-h-screen text-white pt-10 pb-20 px-4">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Contact Info */}
                <div className="space-y-8">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-500 to-orange-500 bg-clip-text text-transparent">
                        Contáctenos
                    </h1>
                    <p className="text-gray-400 text-lg">
                        ¿Tienes preguntas sobre nuestros eventos, reservas VIP o quieres organizar una fiesta privada? Estamos aquí para ayudarte.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center space-x-4 text-gray-300">
                            <MapPin className="text-pink-500 w-6 h-6" />
                            <span>Calle 123 #45-67, Zona Rosa, Ciudad</span>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-300">
                            <Phone className="text-pink-500 w-6 h-6" />
                            <span>+57 300 123 4567</span>
                        </div>
                        <div className="flex items-center space-x-4 text-gray-300">
                            <Mail className="text-pink-500 w-6 h-6" />
                            <span>info@eliteclub.com</span>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="bg-zinc-900 p-8 rounded-2xl border border-white/10 shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Nombre</label>
                            <input type="text" name="name" required className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors" placeholder="Tu nombre" />
                        </div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-400 mb-2">Correo Electrónico</label>
                            <input type="email" name="email" required className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors" placeholder="tu@email.com" />
                        </div>
                        <div>
                            <label htmlFor="subject" className="block text-sm font-medium text-gray-400 mb-2">Asunto</label>
                            <input type="text" name="subject" required className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors" placeholder="Reserva / Información / Otro" />
                        </div>
                        <div>
                            <label htmlFor="message" className="block text-sm font-medium text-gray-400 mb-2">Mensaje</label>
                            <textarea name="message" rows={4} required className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors" placeholder="¿En qué podemos ayudarte?" />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            className="w-full bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2"
                        >
                            {status === 'loading' ? 'Enviando...' : <><Send size={18} /> Enviar Mensaje</>}
                        </button>

                        {status === 'success' && (
                            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-green-900/50 text-green-300 rounded-lg text-sm text-center">
                                ¡Mensaje enviado con éxito! Te contactaremos pronto.
                            </motion.div>
                        )}
                        {status === 'error' && (
                            <div className="p-3 bg-red-900/50 text-red-300 rounded-lg text-sm text-center">
                                Hubo un error al enviar el mensaje. Inténtalo de nuevo.
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
}
