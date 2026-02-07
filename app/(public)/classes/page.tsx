import { getDb } from '@/lib/db';
import ClassesPage from '@/components/ClassesPage';

export const dynamic = 'force-dynamic';

export default function PublicClassesPage() {
    const db = getDb();
    const classes = db.prepare('SELECT * FROM classes ORDER BY name ASC').all() as any[];

    const settings = db.prepare('SELECT * FROM settings WHERE key IN (?, ?)').all('classesTitle', 'classesSubtitle');
    const settingsObj = settings.reduce((acc: Record<string, string>, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    return <ClassesPage classes={classes} settings={settingsObj} />;
}
