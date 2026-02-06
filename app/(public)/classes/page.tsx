import db from '@/lib/db';
import ClassesPage from '@/components/ClassesPage';

export const dynamic = 'force-dynamic';

export default function PublicClassesPage() {
    const classes = db.prepare('SELECT * FROM classes ORDER BY name ASC').all() as any[];
    return <ClassesPage classes={classes} />;
}
