import db from '@/lib/db';
import EventCard from '@/components/EventCard';
import { CalendarX } from 'lucide-react';

interface Event {
    id: number;
    title: string;
    description: string;
    date: string;
    image: string | null;
    created_at: string;
}

export const dynamic = 'force-dynamic';

export default function Events() {
    const events = db.prepare('SELECT * FROM events ORDER BY date ASC').all() as Event[];

    return (
        <div className="bg-black min-h-screen text-white pt-10 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
                        Próximos Eventos
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Descubre las fiestas más exclusivas de la ciudad. Reserva tu lugar antes de que se agoten.
                    </p>
                </div>

                {events.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 text-gray-500">
                        <CalendarX className="w-20 h-20 mb-4 opacity-50" />
                        <p className="text-xl">No hay eventos programados por el momento.</p>
                        <p>¡Vuelve pronto para más novedades!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {events.map((event) => (
                            <EventCard key={event.id} event={event} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
