import { query } from '@/lib/db';

export async function getSettings() {
    try {
        const result = await query('SELECT * FROM settings');
        const settings = result.rows.reduce((acc: any, curr: any) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {});
        return settings;
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return {};
    }
}
