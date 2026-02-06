import { NextResponse } from 'next/server';
import db from '@/lib/db';

export async function GET() {
    const classes = db.prepare('SELECT * FROM classes ORDER BY name ASC').all();
    return NextResponse.json(classes);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, instructor, schedule, capacity, image } = body;

        if (!name || !schedule) {
            return NextResponse.json({ error: 'Name and Schedule are required' }, { status: 400 });
        }

        const stmt = db.prepare('INSERT INTO classes (name, instructor, schedule, capacity, image) VALUES (?, ?, ?, ?, ?)');
        const info = stmt.run(name, instructor || 'TBD', schedule, capacity || 20, image || '');

        return NextResponse.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
        console.error('Error creating class:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const stmt = db.prepare('DELETE FROM classes WHERE id = ?');
        stmt.run(id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Error deleting' }, { status: 500 });
    }
}
