import SettingsManager from '@/components/SettingsManager';
import { getDb } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default function SettingsPage() {
    const db = getDb();
    const settings = db.prepare('SELECT * FROM settings').all();
    // Convert array of {key, value} to object {key: value}
    const settingsObj = settings.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});

    return <SettingsManager initialSettings={settingsObj} />;
}
