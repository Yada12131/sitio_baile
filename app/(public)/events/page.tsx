import { query } from '@/lib/db';
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

export default async function EventsPage() {
    let events: Event[] = [];
    let headersObj: any = {};

    try {
        const headersRes = await query('SELECT * FROM settings WHERE key IN ($1, $2)', ['eventsTitle', 'eventsSubtitle']);
        headersObj = headersRes.rows.reduce((acc: Record<string, string>, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});

        const eventsRes = await query('SELECT * FROM events ORDER BY date ASC');
        events = eventsRes.rows as Event[];
    } catch (e) {
        console.error("Failed to load events page data:", e);
    }

    return (
        <div className="bg-black min-h-screen text-white pt-32 pb-20 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <h1
                        className="text-4xl md:text-6xl font-bold mb-4 inline-block"
                        style={{
                            backgroundImage: 'linear-gradient(to right, var(--primary-color), var(--accent-color))',
                            WebkitBackgroundClip: 'text',
                            backgroundClip: 'text',
                            color: 'transparent',
                            display: 'inline-block'
                        }}
                    >
                        {headersObj.eventsTitle || "Próximos Eventos"}
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        {headersObj.eventsSubtitle || "Descubre las fiestas más exclusivas de la ciudad. Reserva tu lugar antes de que se agoten."}
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
