import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        // Force re-run initDb which calls seedData
        // To be sure, we can also manually trigger seed data here if we export it, 
        // but initDb is already exported.

        await initDb();

        // Let's also verify what's in there
        const services = await query('SELECT count(*) FROM services');
        const content = await query('SELECT count(*) FROM settings');

        return NextResponse.json({
            message: 'Database initialization attempted.',
            stats: {
                services: services.rows[0].count,
                settings: content.rows[0].count
            }
        });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to seed', details: e }, { status: 500 });
    }
}
