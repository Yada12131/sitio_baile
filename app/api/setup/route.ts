import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function GET() {
    try {
        await initDb();
        return NextResponse.json({ success: true, message: 'Database initialized successfully' });
    } catch (error) {
        console.error('Setup failed:', error);
        return NextResponse.json({ error: 'Setup failed', details: error }, { status: 500 });
    }
}
