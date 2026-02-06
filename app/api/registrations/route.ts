import { NextResponse } from 'next/server';
import db from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const registrations = db.prepare(`
      SELECT r.*, c.name as class_name 
      FROM registrations r 
      LEFT JOIN classes c ON r.class_id = c.id 
      ORDER BY r.created_at DESC
    `).all();
        return NextResponse.json(registrations);
    } catch (error) {
        return NextResponse.json({ error: 'Database error' }, { status: 500 });
    }
}
