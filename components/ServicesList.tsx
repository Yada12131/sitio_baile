'use client';

import { useState } from 'react';
import { Check } from 'lucide-react';
import ServiceRequestModal from './ServiceRequestModal';

interface Service {
    id: number;
    title: string;
    description: string;
    price: string;
    category: string;
    image: string;
}

interface ServicesListProps {
    items: Service[];
    servicesTitle: string;
}

export default function ServicesList({ items, servicesTitle }: ServicesListProps) {
    const [selectedService, setSelectedService] = useState<Service | null>(null);

    return (
        <div className="min-h-screen bg-black text-white pt-32 pb-20">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1
                        className="text-5xl md:text-6xl font-black mb-6 tracking-tight inline-block"
                        style={{
                            backgroundImage: 'linear-gradient(to right, var(--primary-color), var(--accent-color))',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            display: 'inline-block'
                        }}
                    >
                        {servicesTitle}
                    </h1>
                    <p className="text-xl text-gray-400 leading-relaxed">
                        Transformamos tu pasión en movimiento con nuestros servicios profesionales.
                    </p>
                </div>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/40 rounded-2xl border border-white/10">
                        <p className="text-xl text-gray-400">No hay servicios disponibles en este momento.</p>
                        <p className="text-sm text-gray-500 mt-2">Intenta recargar la página en unos minutos.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {items.map((service) => (
                            <div key={service.id} className="bg-zinc-900/40 border border-white/10 rounded-2xl overflow-hidden hover:border-pink-500/50 transition-all duration-300 hover:bg-zinc-900/80 group flex flex-col">
                                <div className="h-48 w-full bg-zinc-800 relative overflow-hidden">
                                    {service.image ? (
                                        <img
                                            src={service.image}
                                            alt={service.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <Check className="text-pink-500" size={48} />
                                        </div>
                                    )}
                                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                                        <span className="text-sm font-bold text-white">
                                            {service.price}
                                        </span>
                                    </div>
                                </div>
                                <div className="p-6 flex-grow flex flex-col">
                                    <h3 className="text-xl font-bold text-white mb-4">{service.title}</h3>
                                    <p className="text-gray-400 leading-relaxed text-sm flex-grow mb-6">{service.description}</p>

                                    <button
                                        onClick={() => setSelectedService(service)}
                                        className="w-full py-3 bg-white text-black font-bold rounded-lg hover:bg-gray-200 transition-colors uppercase tracking-wide text-sm"
                                    >
                                        Solicitar Servicio
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <ServiceRequestModal
                selectedService={selectedService}
                onClose={() => setSelectedService(null)}
            />
        </div>
    );
}
