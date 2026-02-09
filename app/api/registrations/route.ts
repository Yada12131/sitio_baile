import { NextResponse } from 'next/server';
import { query } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const result = await query(`
            SELECT r.*, c.name as class_name 
            FROM registrations r 
            JOIN classes c ON r.class_id = c.id 
            ORDER BY r.created_at DESC
        `);
        return NextResponse.json(result.rows);
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
