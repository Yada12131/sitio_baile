import { NextResponse } from 'next/server';
import { query, initDb } from '@/lib/db';

export async function GET() {
    try {
        // Trigger table creation/seeding check on health check (useful for first deployment)
        await initDb();

        // Simple query to verify connection
        const result = await query('SELECT NOW()');

        return NextResponse.json({
            status: 'ok',
            database: 'connected',
            time: result.rows[0].now,
            env: process.env.NODE_ENV
        });
    } catch (e) {
        console.error('Health check failed:', e);
        return NextResponse.json({
            status: 'error',
            database: 'disconnected',
            error: String(e)
        }, { status: 500 });
    }
}
