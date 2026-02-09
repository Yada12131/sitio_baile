import { run } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const result = await run('DELETE FROM registrations WHERE id = $1', [id]);

        if (result.rowCount && result.rowCount > 0) {
            return NextResponse.json({ success: true });
        } else {
            return NextResponse.json({ error: 'Registration not found' }, { status: 404 });
        }
    } catch (error) {
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
