import { query } from '@/lib/db';
import { Users, MessageSquare, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminDashboard() {
    let stats = { events: 0, classes: 0, messages: 0, registrations: 0, feedbackAvg: 0 };

    try {
        const [eventsRes, classesRes, messagesRes, registrationsRes, feedbackRes] = await Promise.all([
            query('SELECT COUNT(*) as count FROM events'),
            query('SELECT COUNT(*) as count FROM classes'),
            query('SELECT COUNT(*) as count FROM messages'),
            query('SELECT COUNT(*) as count FROM registrations'),
            query('SELECT AVG(rating) as avg FROM feedback')
        ]);

        stats = {
            events: parseInt(eventsRes.rows[0]?.count || 0),
            classes: parseInt(classesRes.rows[0]?.count || 0),
            messages: parseInt(messagesRes.rows[0]?.count || 0),
            registrations: parseInt(registrationsRes.rows[0]?.count || 0),
            feedbackAvg: parseFloat(feedbackRes.rows[0]?.avg || 0),
        };
    } catch (e) {
        console.error("Failed to load admin stats:", e);
    }

    const cards = [
        { title: 'Mensajes Nuevos', value: stats.messages, icon: MessageSquare, color: 'text-blue-500' },
        { title: 'Inscripciones', value: stats.registrations, icon: Users, color: 'text-green-500' },
        { title: 'Calificación Prom.', value: stats.feedbackAvg ? stats.feedbackAvg.toFixed(1) : 'N/A', icon: Star, color: 'text-yellow-500' },
    ];

    return (
        <div>
            <h1 className="text-3xl font-bold text-white mb-8">Panel de Control</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {cards.map((card, idx) => (
                    <div key={idx} className="bg-zinc-900 p-6 rounded-xl border border-white/10 flex items-center gap-4">
                        <div className={`p-4 rounded-full bg-white/5 ${card.color}`}>
                            <card.icon size={24} />
                        </div>
                        <div>
                            <p className="text-gray-400 text-sm">{card.title}</p>
                            <p className="text-3xl font-bold text-white">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
