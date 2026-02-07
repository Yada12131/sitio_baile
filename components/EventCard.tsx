'use client';

import { useState } from 'react';
import { Calendar, Clock, MapPin, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface EventProps {
    event: {
        id: number;
        title: string;
        description: string;
        date: string;
        image: string | null;
    };
}

export default function EventCard({ event }: EventProps) {
    const eventDate = new Date(event.date);
    const dateStr = eventDate.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' });
    const timeStr = eventDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });

    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all group flex flex-col h-full">
                <div className="relative h-48 w-full bg-zinc-800 shrink-0">
                    {/* Placeholder if no image */}
                    {event.image ? (
                        <img src={event.image} alt={event.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-purple-800 to-pink-800 flex items-center justify-center text-white/20 text-4xl font-bold">
                            ELITE
                        </div>
                    )}
                    <div className="absolute top-4 right-4 bg-black/80 backdrop-blur text-white px-3 py-1 rounded-full text-sm font-bold border border-white/20">
                        Próximamente
                    </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-pink-500 transition-colors">{event.title}</h3>

                    <div className="space-y-2 mb-4 text-gray-300 text-sm">
                        <div className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-pink-500" />
                            <span className="capitalize">{dateStr}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-pink-500" />
                            <span>{timeStr}</span>
                        </div>
                    </div>

                    <p className="text-gray-400 line-clamp-3 mb-6 flex-grow">
                        {event.description}
                    </p>

                    <button
                        onClick={() => setIsOpen(true)}
                        className="w-full py-2 border border-white/20 text-white rounded-lg hover:bg-white hover:text-black transition-colors font-semibold mt-auto"
                    >
                        Más Detalles
                    </button>
                </div>
            </div>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                            onClick={() => setIsOpen(false)}
                        />
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            className="relative bg-zinc-900 border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
                        >
                            <div className="relative h-64 w-full">
                                {event.image ? (
                                    <img src={event.image} alt={event.title} className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-purple-800 to-pink-800 flex items-center justify-center text-white/20 text-4xl font-bold">
                                        ELITE
                                    </div>
                                )}
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="absolute top-4 right-4 bg-black/50 text-white p-2 rounded-full hover:bg-black/80 transition-colors"
                                >
                                    <X size={24} />
                                </button>
                            </div>

                            <div className="p-8">
                                <h2 className="text-3xl font-bold text-white mb-4">{event.title}</h2>

                                <div className="flex flex-wrap gap-6 text-gray-300 mb-6">
                                    <div className="flex items-center gap-2">
                                        <Calendar className="w-5 h-5 text-pink-500" />
                                        <span className="capitalize">{dateStr}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-pink-500" />
                                        <span>{timeStr}</span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-pink-500" />
                                        <span>Calle 123 #45-67, Zona Rosa</span>
                                    </div>
                                </div>

                                <div className="prose prose-invert max-w-none mb-8 text-gray-300">
                                    <p>{event.description}</p>
                                </div>

                                <div className="flex gap-4">
                                    <a
                                        href="/contact"
                                        className="flex-1 bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity text-center"
                                    >
                                        Reservar Mesa
                                    </a>
                                    <button
                                        onClick={() => setIsOpen(false)}
                                        className="px-6 py-3 border border-white/20 text-white rounded-lg hover:bg-white/10 transition-colors"
                                    >
                                        Cerrar
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>
        </>
    );
}
