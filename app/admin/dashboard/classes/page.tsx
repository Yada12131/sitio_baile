import db from '@/lib/db';
import ClassesManager from '@/components/ClassesManager';

export const dynamic = 'force-dynamic';

export default function AdminClassesPage() {
    const classes = db.prepare('SELECT * FROM classes ORDER BY name ASC').all();
    return <ClassesManager initialClasses={classes} />;
}
