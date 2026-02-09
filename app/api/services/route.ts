import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const db = getDb();
        const services = db.prepare('SELECT * FROM services ORDER BY created_at DESC').all();
        return NextResponse.json(services);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const db = getDb();
        const body = await req.json();
        const { title, description, price, category, image } = body;

        const stmt = db.prepare('INSERT INTO services (title, description, price, category, image) VALUES (?, ?, ?, ?, ?)');
        const result = stmt.run(title, description, price, category, image || '/hero-bg.jpg');

        return NextResponse.json({ success: true, id: result.lastInsertRowid });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const db = getDb();
        const body = await req.json();
        const { id, title, description, price, category, image } = body;

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const stmt = db.prepare('UPDATE services SET title = ?, description = ?, price = ?, category = ?, image = ? WHERE id = ?');
        stmt.run(title, description, price, category, image, id);

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        const db = getDb();
        const stmt = db.prepare('DELETE FROM services WHERE id = ?');
        stmt.run(id);

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
