'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Send, Star, Gift, Users } from 'lucide-react';

export default function AffiliatesPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus('loading');
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        const payload = {
            ...data,
            subject: `[Registro Afiliado]: ${data.name} - ${data.idNumber}`
        };

        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
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

    const benefits = [
        {
            icon: Star,
            title: "Descuentos Exclusivos",
            desc: "Accede a precios especiales en nuestras clases, eventos y alquiler de espacios."
        },
        {
            icon: Gift,
            title: "Beneficios en Cumpleaños",
            desc: "Celebra tu día con nosotros y recibe sorpresas especiales para ti y tus invitados."
        },
        {
            icon: Users,
            title: "Comunidad VIP",
            desc: "Sé parte de nuestro círculo cercano y entérate primero de todas las novedades."
        }
    ];

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20">
            {/* Hero Section */}
            <div className="container mx-auto px-4 mb-20">
                <div className="text-center max-w-4xl mx-auto">
                    <h1
                        className="text-5xl md:text-7xl font-black mb-6 tracking-tight inline-block"
                        style={{
                            backgroundImage: 'linear-gradient(to right, var(--primary-color), var(--accent-color))',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            display: 'inline-block'
                        }}
                    >
                        Sé Parte de la Familia
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto">
                        Únete a nuestro programa de afiliados y disfruta de beneficios únicos diseñados para recompensar tu pasión por el baile.
                    </p>
                </div>
            </div>

            {/* Benefits Grid */}
            <div className="container mx-auto px-4 mb-24">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {benefits.map((benefit, idx) => (
                        <div key={idx} className="bg-zinc-900/40 border border-white/10 p-8 rounded-2xl hover:border-pink-500/50 transition-all hover:-translate-y-2 group">
                            <benefit.icon className="w-12 h-12 text-pink-500 mb-6 group-hover:scale-110 transition-transform" />
                            <h3 className="text-2xl font-bold mb-3 text-white">{benefit.title}</h3>
                            <p className="text-gray-400">{benefit.desc}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Registration Form */}
            <div className="container mx-auto px-4">
                <div className="max-w-3xl mx-auto bg-zinc-900 border border-white/10 rounded-2xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
                    {/* decorative bg */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-pink-600/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none" />

                    <div className="relative z-10">
                        <div className="text-center mb-10">
                            <h2 className="text-3xl font-bold mb-4">Formulario de Afiliación</h2>
                            <p className="text-gray-400">Completa tus datos para iniciar el proceso de registro.</p>
                        </div>

                        {status === 'success' ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-green-500/10 border border-green-500/30 rounded-xl p-8 text-center"
                            >
                                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Check className="text-green-500" size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-white mb-2">¡Solicitud Recibida!</h3>
                                <p className="text-gray-300 mb-6">
                                    Hemos recibido tus datos correctamente. Nuestro equipo revisará tu solicitud y te contactará pronto para finalizar tu afiliación.
                                </p>
                                <button
                                    onClick={() => setStatus('idle')}
                                    className="text-sm text-gray-500 hover:text-white underline"
                                >
                                    Enviar otra solicitud
                                </button>
                            </motion.div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Nombre Completo</label>
                                        <input
                                            type="text" name="name" required
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                            placeholder="Tu nombre"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Cédula / ID</label>
                                        <input
                                            type="text" name="idNumber" required
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                            placeholder="Número de documento"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Correo Electrónico</label>
                                        <input
                                            type="email" name="email" required
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                            placeholder="tucorreo@email.com"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">Teléfono / WhatsApp</label>
                                        <input
                                            type="tel" name="phone" required
                                            className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                            placeholder="+57 300 123 4567"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Fecha de Nacimiento</label>
                                    <input
                                        type="date" name="birthdate" required
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Para recibir beneficios en tu cumpleaños.</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Mensaje Adicional (Opcional)</label>
                                    <textarea
                                        name="message" rows={3}
                                        className="w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all"
                                        placeholder="¿Cómo nos conociste? ¿Tienes alguna duda?"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-4 text-white font-bold rounded-xl hover:opacity-90 transition-all transform hover:scale-[1.01] shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 text-lg"
                                    style={{ background: 'linear-gradient(to right, var(--primary-color), var(--accent-color))' }}
                                >
                                    {status === 'loading' ? 'Enviando Solicitud...' : <><Send size={20} /> Enviar Solicitud de Afiliación</>}
                                </button>

                                {status === 'error' && (
                                    <p className="text-red-400 text-center text-sm">
                                        Hubo un error al enviar el formulario. Por favor intenta de nuevo.
                                    </p>
                                )}
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
