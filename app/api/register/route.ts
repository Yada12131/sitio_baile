import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';

export async function POST(request: Request) {
    try {
        const db = getDb();
        const body = await request.json();
        const { classId, name, email, phone } = body;

        if (!classId || !name || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const stmt = db.prepare('INSERT INTO registrations (class_id, student_name, student_email, student_phone) VALUES (?, ?, ?, ?)');
        stmt.run(classId, name, email, phone || '');

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
