import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    try {
        const db = getDb();
        const events = db.prepare('SELECT * FROM events ORDER BY date ASC').all();
        return NextResponse.json(events);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const db = getDb();
        const body = await request.json();
        const { title, description, date, image } = body;

        const stmt = db.prepare('INSERT INTO events (title, description, date, image) VALUES (?, ?, ?, ?)');
        const result = stmt.run(title, description, date, image);
        return NextResponse.json({ id: result.lastInsertRowid });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const db = getDb();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const stmt = db.prepare('DELETE FROM events WHERE id = ?');
        stmt.run(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
