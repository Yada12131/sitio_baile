import { getDb } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const db = getDb();

        const stmt = db.prepare('DELETE FROM registrations WHERE id = ?');
        const info = stmt.run(id);

        if (info.changes > 0) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
