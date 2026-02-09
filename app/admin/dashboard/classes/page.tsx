import { getDb } from '@/lib/db';
import ClassesManager from '@/components/ClassesManager';

export const dynamic = 'force-dynamic';

export default function AdminClassesPage() {
    let classes = [];
    try {
        const db = getDb();
        classes = db.prepare('SELECT * FROM classes ORDER BY name ASC').all();
    } catch (e) {
        console.error("Failed to load classes:", e);
    }
    return <ClassesManager initialClasses={classes} />;
}
