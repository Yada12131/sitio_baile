import { NextResponse } from 'next/server';
import { query, run } from '@/lib/db';

export async function GET() {
    try {
        const result = await query('SELECT * FROM classes ORDER BY name ASC');
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, instructor, schedule, capacity } = body;

        const result = await query(
            'INSERT INTO classes (name, instructor, schedule, capacity) VALUES ($1, $2, $3, $4) RETURNING id',
            [name, instructor, schedule, capacity]
        );
        return NextResponse.json({ id: result.rows[0].id });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, instructor, schedule, capacity } = body;

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await run(
            'UPDATE classes SET name = $1, instructor = $2, schedule = $3, capacity = $4 WHERE id = $5',
            [name, instructor, schedule, capacity, id]
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

        await run('DELETE FROM classes WHERE id = $1', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
