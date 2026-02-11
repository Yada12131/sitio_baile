import { query } from '@/lib/db';
import ClassesPage from '@/components/ClassesPage';

export const dynamic = 'force-dynamic';

export default async function PublicClassesPage() {
    let classes: any[] = [];
    let settingsObj: any = {};

    try {
        const classesRes = await query('SELECT * FROM classes ORDER BY name ASC');
        classes = classesRes.rows;

        const settingsRes = await query('SELECT * FROM settings WHERE key IN ($1, $2)', ['classesTitle', 'classesSubtitle']);
        settingsObj = settingsRes.rows.reduce((acc: Record<string, string>, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
    } catch (e) {
        console.error("Failed to load classes page data:", e);
    }

    return (
        <div>
            <ClassesPage classes={classes} settings={settingsObj} />
        </div>
    );
}
