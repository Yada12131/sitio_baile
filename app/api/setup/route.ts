import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

export async function GET() {
    try {
        console.log('Triggering Manual DB Init...');
        await initDb();
        return NextResponse.json({ success: true, message: 'Database initialization and seeding completed.' });
    } catch (error: any) {
        console.error('Setup failed:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
