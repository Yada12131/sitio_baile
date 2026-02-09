import SettingsManager from '@/components/SettingsManager';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
    let settingsObj: any = {};
    try {
        const res = await query('SELECT * FROM settings');
        const settings = res.rows;
        // Convert array of {key, value} to object {key: value}
        settingsObj = settings.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
    } catch (e) {
        console.error('Failed to load settings', e);
    }

    return <SettingsManager initialSettings={settingsObj} />;
}
