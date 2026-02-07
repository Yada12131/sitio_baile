'use client';

import { useState } from 'react';
import { Star, Send } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Feedback() {
    const [rating, setRating] = useState(0);
    const [hover, setHover] = useState(0);
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (rating === 0) return; // Require rating

        setStatus('loading');
        const formData = new FormData(e.currentTarget);
        const comments = formData.get('comments');

        try {
            const res = await fetch('/api/feedback', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rating, comments }),
            });
            if (res.ok) {
                setStatus('success');
            } else {
                setStatus('error');
            }
        } catch (err) {
            setStatus('error');
        }
    }

    return (
        <div className="bg-black min-h-screen text-white pt-10 pb-20 px-4 flex items-center justify-center">
            <div className="max-w-lg w-full bg-zinc-900 p-8 rounded-2xl border border-white/10 shadow-2xl glass-panel relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-500 to-purple-500" />

                <h1 className="text-3xl font-bold text-center mb-2">Tu Opinión Importa</h1>
                <p className="text-gray-400 text-center mb-8">Ayúdanos a mejorar tu experiencia en Elite Club.</p>

                {status === 'success' ? (
                    <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-10">
                        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-400">
                            <Star className="w-10 h-10 fill-current" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">¡Gracias!</h3>
                        <p className="text-gray-400">Hemos recibido tus comentarios.</p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="flex justify-center space-x-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    className="focus:outline-none transition-transform hover:scale-110"
                                    onClick={() => setRating(star)}
                                    onMouseEnter={() => setHover(star)}
                                    onMouseLeave={() => setHover(rating)}
                                >
                                    <Star
                                        className={`w-10 h-10 ${star <= (hover || rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`}
                                    />
                                </button>
                            ))}
                        </div>

                        <div className="text-center text-sm text-gray-400 h-5">
                            {hover === 1 && "Muy malo"}
                            {hover === 2 && "Malo"}
                            {hover === 3 && "Regular"}
                            {hover === 4 && "Bueno"}
                            {hover === 5 && "¡Excelente!"}
                        </div>

                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-400 mb-2">Tu Nombre (Opcional)</label>
                            <input
                                type="text"
                                name="name"
                                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="Nombre"
                            />
                        </div>

                        <div>
                            <label htmlFor="comments" className="block text-sm font-medium text-gray-400 mb-2">Comentarios (Opcional)</label>
                            <textarea
                                name="comments"
                                rows={4}
                                className="w-full bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-purple-500 transition-colors"
                                placeholder="Cuéntanos más sobre tu experiencia..."
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={status === 'loading' || rating === 0}
                            className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {status === 'loading' ? 'Enviando...' : 'Enviar Evaluación'}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
