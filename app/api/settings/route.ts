import { NextResponse } from 'next/server';
import { query, run } from '@/lib/db';

export async function GET() {
    const result = await query('SELECT * FROM settings');
    // Convert array of {key, value} to object {key: value}
    const settingsObj = result.rows.reduce((acc: any, curr: any) => {
        acc[curr.key] = curr.value;
        return acc;
    }, {});
    return NextResponse.json(settingsObj);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const stmt = 'INSERT INTO settings (key, value) VALUES ($1, $2) ON CONFLICT(key) DO UPDATE SET value = excluded.value';

        // NOTE: Postgres doesn't have an easy "transaction" block like better-sqlite3 without using a client from pool
        // For simplicity/speed we will just await runs sequentially. 
        // For higher reliability we should pool.connect() -> client.query('BEGIN') ... client.query('COMMIT')
        // Given low volume, sequential is fine.

        for (const [key, value] of Object.entries(body)) {
            await run(stmt, [key, value]);
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Settings error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
