import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    try {
        const db = getDb();
        const classes = db.prepare('SELECT * FROM classes ORDER BY name ASC').all();
        return NextResponse.json(classes);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const db = getDb();
        const body = await request.json();
        const { name, instructor, schedule, capacity } = body;

        const stmt = db.prepare('INSERT INTO classes (name, instructor, schedule, capacity) VALUES (?, ?, ?, ?)');
        const result = stmt.run(name, instructor, schedule, capacity);
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

        const stmt = db.prepare('DELETE FROM classes WHERE id = ?');
        stmt.run(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
