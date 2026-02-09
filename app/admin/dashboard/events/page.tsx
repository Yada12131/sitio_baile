import { getDb } from '@/lib/db';
import EventsManager from '@/components/EventsManager';

export const dynamic = 'force-dynamic';

export default function AdminEventsPage() {
    let events = [];
    try {
        const db = getDb();
        events = db.prepare('SELECT * FROM events ORDER BY date ASC').all();
    } catch (e) {
        console.error("Failed to load events:", e);
    }

    return <EventsManager initialEvents={events} />;
}
