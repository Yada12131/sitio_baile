import db from '@/lib/db';
import EventsManager from '@/components/EventsManager';

export const dynamic = 'force-dynamic';

export default function AdminEventsPage() {
    const events = db.prepare('SELECT * FROM events ORDER BY date ASC').all();

    return <EventsManager initialEvents={events} />;
}
