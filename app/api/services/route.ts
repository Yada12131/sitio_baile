import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    const db = getDb();
    const services = db.prepare('SELECT * FROM services ORDER BY created_at DESC').all();
    return NextResponse.json(services);
}

export async function POST(req: Request) {
    const db = getDb();
    const body = await req.json();
    const { title, description, price, category, image } = body;

    const stmt = db.prepare('INSERT INTO services (title, description, price, category, image) VALUES (?, ?, ?, ?, ?)');
    stmt.run(title, description, price, category, image || '/hero-bg.jpg');

    return NextResponse.json({ success: true });
}

export async function DELETE(req: Request) {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

    const db = getDb();
    db.prepare('DELETE FROM services WHERE id = ?').run(id);

    return NextResponse.json({ success: true });
}
