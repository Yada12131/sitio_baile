import { query } from '@/lib/db';
import ClassesManager from '@/components/ClassesManager';

export const dynamic = 'force-dynamic';

export default async function AdminClassesPage() {
    let classes = [];
    try {
        const res = await query('SELECT * FROM classes ORDER BY name ASC');
        classes = res.rows;
    } catch (e) {
        console.error("Failed to load classes:", e);
    }
    return <ClassesManager initialClasses={classes} />;
}
