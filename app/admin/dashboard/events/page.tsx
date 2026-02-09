import { query } from '@/lib/db';
import EventsManager from '@/components/EventsManager';

export const dynamic = 'force-dynamic';

export default async function AdminEventsPage() {
    let events = [];
    try {
        const res = await query('SELECT * FROM events ORDER BY date ASC');
        events = res.rows;
    } catch (e) {
        console.error("Failed to load events:", e);
    }

    return <EventsManager initialEvents={events} />;
}
