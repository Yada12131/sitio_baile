import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const formType = searchParams.get('type') || 'affiliate';

    try {
        const res = await query('SELECT * FROM form_fields WHERE form_type = $1 ORDER BY order_index ASC', [formType]);
        return NextResponse.json(res.rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch fields' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { form_type, label, name, type, required, order_index, options } = body;

        const res = await query(
            'INSERT INTO form_fields (form_type, label, name, type, required, order_index, options) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [form_type || 'affiliate', label, name, type, required, order_index, options]
        );

        return NextResponse.json(res.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to create field' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { id, label, name, type, required, order_index, options } = body;

        const res = await query(
            'UPDATE form_fields SET label = $1, name = $2, type = $3, required = $4, order_index = $5, options = $6 WHERE id = $7 RETURNING *',
            [label, name, type, required, order_index, options, id]
        );

        return NextResponse.json(res.rows[0]);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to update field' }, { status: 500 });
    }
}

export async function DELETE(request: Request) {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Missing ID' }, { status: 400 });

    try {
        await query('DELETE FROM form_fields WHERE id = $1', [id]);
        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to delete field' }, { status: 500 });
    }
}
