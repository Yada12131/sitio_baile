import { NextResponse } from 'next/server';
import { query, run } from '@/lib/db';

export async function GET() {
    try {
        const result = await query('SELECT * FROM events ORDER BY date ASC');
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { title, description, date, image } = body;

        // PG uses RETURNING id to get the new ID
        const result = await query(
            'INSERT INTO events (title, description, date, image) VALUES ($1, $2, $3, $4) RETURNING id',
            [title, description, date, image]
        );

        return NextResponse.json({ id: result.rows[0].id });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, title, description, date, image } = body;

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await run(
            'UPDATE events SET title = $1, description = $2, date = $3, image = $4 WHERE id = $5',
            [title, description, date, image, id]
        );
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await run('DELETE FROM events WHERE id = $1', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
