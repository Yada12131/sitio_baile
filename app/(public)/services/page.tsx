import { Wine, Crown, Music2 } from 'lucide-react';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function Services() {
    const db = getDb();
    const settings = db.prepare('SELECT * FROM settings').all();
    const settingsObj = settings.reduce((acc: Record<string, string>, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    const services = [
        {
            icon: Crown,
            title: settingsObj.services1Title || "Reserva de Mesas VIP",
            desc: settingsObj.services1Desc || "La mejor ubicación de la casa. Incluye servicio de botella premium, mesero dedicado y acceso prioritario.",
            price: settingsObj.services1Price || "Desde $200"
        },
        {
            icon: Music2,
            title: settingsObj.services2Title || "Eventos Privados",
            desc: settingsObj.services2Desc || "Celebra tu cumpleaños o evento corporativo con nosotros. Alquila una zona o el club completo.",
            price: settingsObj.services2Price || "Personalizado"
        },
        {
            icon: Wine,
            title: settingsObj.services3Title || "Coctelería de Autor",
            desc: settingsObj.services3Desc || "Disfruta de nuestra carta exclusiva de cócteles diseñados por mixólogos expertos.",
            price: settingsObj.services3Price || "A la carta"
        }
    ];

    return (
        <div className="bg-black min-h-screen text-white pt-10 pb-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-4xl md:text-6xl font-bold mb-12 text-center bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">
                    {settingsObj.servicesTitle || "Nuestros Servicios"}
                </h1>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((item, idx) => (
                        <div key={idx} className="group relative bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 hover:border-cyan-500/50 transition-all duration-300">
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 z-10" />
                            <div className="p-8 relative z-20 h-full flex flex-col">
                                <div className="bg-zinc-800 w-14 h-14 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <item.icon className="w-8 h-8 text-cyan-400" />
                                </div>
                                <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                                <p className="text-gray-400 mb-6 flex-grow">{item.desc}</p>
                                <span className="text-sm font-semibold text-cyan-300">{item.price}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
