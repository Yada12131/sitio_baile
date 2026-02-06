import { Calendar, Clock, MapPin } from 'lucide-react';
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

    return (
        <div className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 hover:border-pink-500/50 transition-all group">
            <div className="relative h-48 w-full bg-zinc-800">
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

            <div className="p-6">
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

                <p className="text-gray-400 line-clamp-3 mb-6">
                    {event.description}
                </p>

                <button className="w-full py-2 border border-white/20 text-white rounded-lg hover:bg-white hover:text-black transition-colors font-semibold">
                    Más Detalles
                </button>
            </div>
        </div>
    );
}
