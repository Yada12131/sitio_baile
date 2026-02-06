import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    const settings = db.prepare('SELECT * FROM settings').all();
    // Convert array of {key, value} to object {key: value}
    const settingsObj = settings.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});
    return NextResponse.json(settingsObj);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const stmt = db.prepare('INSERT INTO settings (key, value) VALUES (?, ?) ON CONFLICT(key) DO UPDATE SET value = excluded.value');

        db.transaction(() => {
            for (const [key, value] of Object.entries(body)) {
                stmt.run(key, value);
            }
        })();

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Settings error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
