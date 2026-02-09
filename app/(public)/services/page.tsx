import { getDb } from '@/lib/db';
import { Check } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function ServicesPage() {
    const db = getDb();

    // Fetch dynamic services
    const services = db.prepare('SELECT * FROM services ORDER BY created_at DESC').all() as any[];

    // Fetch settings for page title (fallback to default)
    const settings = db.prepare('SELECT * FROM settings WHERE key LIKE "services%"').all();
    const settingsObj = settings.reduce((acc: Record<string, string>, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    const pageTitle = settingsObj.servicesTitle || 'Nuestros Servicios';

    // Group services by category
    const categories: Record<string, any[]> = {};
    services.forEach(service => {
        const cat = service.category || 'Otros';
        if (!categories[cat]) categories[cat] = [];
        categories[cat].push(service);
    });

    return (
        <div className="bg-black min-h-screen text-white pt-24 pb-16 px-4">
            <div className="max-w-7xl mx-auto">
                <h1 className="text-4xl md:text-6xl font-bold mb-16 text-center">
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                        {pageTitle}
                    </span>
                </h1>

                <div className="space-y-20">
                    {Object.entries(categories).map(([category, items]) => (
                        <div key={category}>
                            <h2 className="text-3xl font-bold text-white mb-10 border-l-4 border-pink-500 pl-6 flex items-center">
                                {category}
                                <div className="ml-4 h-[1px] bg-white/10 flex-grow"></div>
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                                {items.map((service, index) => (
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
                        </div>
                    ))}

                    {services.length === 0 && (
                        <div className="text-center text-gray-500 py-20">
                            <p>No hay servicios disponibles en este momento.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
