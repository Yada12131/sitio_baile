import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    const events = db.prepare('SELECT * FROM events ORDER BY date ASC').all();
    return NextResponse.json(events);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, date, image } = body;

        if (!title || !date) {
            return NextResponse.json({ error: 'Title and Date are required' }, { status: 400 });
        }

        const stmt = db.prepare('INSERT INTO events (title, description, date, image) VALUES (?, ?, ?, ?)');
        const info = stmt.run(title, description || '', date, image || '');

        return NextResponse.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
        console.error('Error creating event:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) {
            return NextResponse.json({ error: 'ID required' }, { status: 400 });
        }

        const stmt = db.prepare('DELETE FROM events WHERE id = ?');
        stmt.run(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting' }, { status: 500 });
    }
}
