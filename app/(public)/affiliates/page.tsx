'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check, Send, Star, Gift, Users } from 'lucide-react';

interface FormField {
    id: number;
    label: string;
    name: string;
    type: string;
    required: boolean;
    options?: string;
    order_index: number;
}

export default function AffiliatesPage() {
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [fields, setFields] = useState<FormField[]>([]);
    const [loadingFields, setLoadingFields] = useState(true);

    useEffect(() => {
        fetch('/api/form-fields?type=affiliate')
            .then(res => res.json())
            .then(data => {
                setFields(data);
                setLoadingFields(false);
            })
            .catch(err => {
                console.error(err);
                setLoadingFields(false);
            });
    }, []);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setStatus('loading');
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData);

        // Add subject for internal reference if needed, though API handles it
        const payload = {
            ...data,
            subject: `[Registro Afiliado] Nuevo registro`
        };

        try {
            const res = await fetch('/api/affiliates', {
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

    const renderField = (field: FormField) => {
        const commonClasses = "w-full bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 transition-all";

        if (field.type === 'textarea') {
            return (
                <textarea
                    name={field.name}
                    required={field.required}
                    rows={3}
                    className={commonClasses}
                    placeholder={field.label}
                />
            );
        }

        if (field.type === 'select') {
            const options = field.options ? field.options.split(',').map(o => o.trim()) : [];
            return (
                <select name={field.name} required={field.required} className={commonClasses}>
                    <option value="">Selecciona una opción</option>
                    {options.map((opt, idx) => (
                        <option key={idx} value={opt} className="bg-zinc-900">{opt}</option>
                    ))}
                </select>
            );
        }

        return (
            <input
                type={field.type}
                name={field.name}
                required={field.required}
                className={commonClasses}
                placeholder={field.label}
            />
        );
    };

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
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
                        ) : loadingFields ? (
                            <div className="text-center py-12 text-gray-500">
                                Cargando formulario...
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {fields.map((field) => (
                                        <div key={field.id} className={field.type === 'textarea' ? 'md:col-span-2' : ''}>
                                            <label className="block text-sm font-medium text-gray-400 mb-2">
                                                {field.label} {field.required && <span className="text-pink-500">*</span>}
                                            </label>
                                            {renderField(field)}
                                        </div>
                                    ))}
                                </div>

                                <button
                                    type="submit"
                                    disabled={status === 'loading'}
                                    className="w-full py-4 text-white font-bold rounded-xl hover:opacity-90 transition-all transform hover:scale-[1.01] shadow-lg shadow-pink-500/20 flex items-center justify-center gap-2 text-lg mt-8"
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
