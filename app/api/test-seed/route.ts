import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        if (!process.env.DATABASE_URL) {
            return NextResponse.json({
                error: 'Configuration Error',
                message: 'DATABASE_URL environment variable is MISSING on the server.',
                solution: 'Go to Netlify Site Settings > Environment Variables and add DATABASE_URL.'
            }, { status: 500 });
        }

        // Force re-run initDb which calls seedData
        await initDb();

        // Let's also verify what's in there
        let servicesCount = 0;
        let settingsCount = 0;

        try {
            const services = await query('SELECT count(*) FROM services');
            if (services.rows && services.rows[0]) servicesCount = parseInt(services.rows[0].count);

            const settings = await query('SELECT count(*) FROM settings');
            if (settings.rows && settings.rows[0]) settingsCount = parseInt(settings.rows[0].count);
        } catch (dbErr: any) {
            return NextResponse.json({ error: 'Database Query Failed', details: dbErr.message }, { status: 500 });
        }

        return NextResponse.json({
            message: 'Database initialization attempted.',
            stats: {
                services: servicesCount,
                settings: settingsCount
            }
        });
    } catch (e: any) {
        return NextResponse.json({
            error: 'Failed to seed',
            details: e.message,
            stack: e.stack
        }, { status: 500 });
    }
}
