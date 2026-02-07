import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function GET() {
    const db = getDb();
    const members = db.prepare('SELECT * FROM team_members ORDER BY created_at DESC').all();
    return NextResponse.json(members);
}

export async function POST(request: Request) {
    try {
        const db = getDb();
        const body = await request.json();
        const { name, role, description, image } = body;

        const stmt = db.prepare('INSERT INTO team_members (name, role, description, image) VALUES (?, ?, ?, ?)');
        const info = stmt.run(name, role, description, image || '');

        return NextResponse.json({ success: true, id: info.lastInsertRowid });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');
        const db = getDb();
        db.prepare('DELETE FROM team_members WHERE id = ?').run(id);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
    }
}
