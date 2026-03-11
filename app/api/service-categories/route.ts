import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export async function GET() {
    try {
        const result = await query('SELECT * FROM service_categories ORDER BY name ASC');
        return NextResponse.json(result.rows);
    } catch (error: any) {
        console.error('GET categories error:', error);
        return NextResponse.json({ error: 'Failed to fetch categories', details: error.message }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { name } = await req.json();
        const result = await query(
            'INSERT INTO service_categories (name) VALUES ($1) RETURNING *',
            [name]
        );
        return NextResponse.json(result.rows[0]);
    } catch (error: any) {
        console.error('POST categories error:', error);
        return NextResponse.json({ error: 'Failed to create category', details: error.message }, { status: 500 });
    }
}

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) return NextResponse.json({ error: 'ID required' }, { status: 400 });

        await query('DELETE FROM service_categories WHERE id = $1', [id]);
        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error('DELETE categories error:', error);
        return NextResponse.json({ error: 'Failed to delete category', details: error.message }, { status: 500 });
    }
}
