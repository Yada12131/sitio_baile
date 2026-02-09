import { query } from '@/lib/db';
import { Check } from 'lucide-react';

export const metadata = {
    title: 'Servicios de Baile | Club Deportivo Ritmos',
    description: 'Ofrecemos clases de baile, montajes coreográficos para 15 años y bodas, shows profesionales y mucho más en Medellín.'
};

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
    let items = [];
    let settings: any[] = [];
    let siteName = 'Club Deportivo Ritmos';
    let servicesTitle = 'Nuestros Servicios';

    try {
        const settingsRes = await query('SELECT * FROM settings');
        settings = settingsRes.rows;

        siteName = settings.find((s: any) => s.key === 'siteName')?.value || 'Club Deportivo Ritmos';
        servicesTitle = settings.find((s: any) => s.key === 'servicesTitle')?.value || 'Nuestros Servicios';

        const itemsRes = await query('SELECT * FROM services ORDER BY created_at DESC');
        items = itemsRes.rows;
    } catch (err) {
        console.error("Critical Error loading Services:", err);
        items = [];
    }

    return (
        <div className="min-h-screen bg-black text-white pt-24 pb-20">
            <div className="container mx-auto px-4 relative z-10">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <h1 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500">
                            {servicesTitle}
                        </span>
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
                        {items.map((service: any) => (
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
                                    <p className="text-gray-400 leading-relaxed text-sm flex-grow">{service.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
