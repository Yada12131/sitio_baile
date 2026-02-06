import db from '@/lib/db';
import { MessageSquare, Calendar, Star } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default function AdminDashboard() {
    const msgCount = (db.prepare('SELECT COUNT(*) as count FROM messages').get() as any).count;
    const eventCount = (db.prepare('SELECT COUNT(*) as count FROM events').get() as any).count;
    const classCount = (db.prepare('SELECT COUNT(*) as count FROM classes').get() as any).count;
    const registrationCount = (db.prepare('SELECT COUNT(*) as count FROM registrations').get() as any).count;
    const avgRating = (db.prepare('SELECT AVG(rating) as avg FROM feedback').get() as any).avg;

    const cards = [
        { title: 'Inscripciones', value: registrationCount, icon: Calendar, color: 'text-green-500' },
        { title: 'Clases', value: classCount, icon: Star, color: 'text-pink-500' },
        { title: 'Mensajes Totales', value: msgCount, icon: MessageSquare, color: 'text-blue-500' },
        { title: 'Eventos Activos', value: eventCount, icon: Calendar, color: 'text-purple-500' },
        { title: 'Calificación Prom.', value: avgRating ? avgRating.toFixed(1) : 'N/A', icon: Star, color: 'text-yellow-500' },
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
                            <p className="text-2xl font-bold text-white">{card.value}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
