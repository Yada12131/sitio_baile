import { query, run } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const result = await query('SELECT * FROM services ORDER BY created_at DESC');
        return NextResponse.json(result.rows || []);
    } catch (e) {
        return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { title, description, price, category, image } = body;

        const result = await query(
            'INSERT INTO services (title, description, price, category, image) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [title, description, price, category, image || '/hero-bg.jpg']
        );

        if (!result.rows || result.rows.length === 0) {
            throw new Error('Database insert failed');
        }

        return NextResponse.json({ success: true, id: result.rows[0].id });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
    }
}

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { id, title, description, price, category, image } = body;

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await run(
            'UPDATE services SET title = $1, description = $2, price = $3, category = $4, image = $5 WHERE id = $6',
            [title, description, price, category, image, id]
        );

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

        await run('DELETE FROM services WHERE id = $1', [id]);

        return NextResponse.json({ success: true });
    } catch (e) {
        return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
    }
}
