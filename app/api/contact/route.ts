import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const db = getDb();
        const body = await request.json();
        const { name, email, subject, message } = body;

        // Simple validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const stmt = db.prepare('INSERT INTO messages (name, email, subject, message) VALUES (?, ?, ?, ?)');
        const result = stmt.run(name, email, subject, message);

        return NextResponse.json({ success: true, id: result.lastInsertRowid });
    } catch (error) {
        console.error('Contact error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
