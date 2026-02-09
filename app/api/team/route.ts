import { NextResponse } from 'next/server';
import { query, run } from '@/lib/db';

export async function GET() {
    const result = await query('SELECT * FROM team_members ORDER BY created_at DESC');
    return NextResponse.json(result.rows);
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, role, description, image } = body;

        const result = await query(
            'INSERT INTO team_members (name, role, description, image) VALUES ($1, $2, $3, $4) RETURNING id',
            [name, role, description, image || '']
        );

        return NextResponse.json({ success: true, id: result.rows[0].id });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create member' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, name, role, description, image } = body;

        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await run(
            'UPDATE team_members SET name = $1, role = $2, description = $3, image = $4 WHERE id = $5',
            [name, role, description, image || '', id]
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update member' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = searchParams.get('id');

        await run('DELETE FROM team_members WHERE id = $1', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete member' }, { status: 500 });
    }
}
