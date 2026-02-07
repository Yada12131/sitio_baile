import { NextResponse } from 'next/server';
import { getDb } from '@/lib/db';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(request: Request) {
    try {
        const db = getDb();
        const body = await request.json();
        const { rating, comments, name } = body;

        if (!rating) {
            return NextResponse.json({ error: 'Rating is required' }, { status: 400 });
        }

        const stmt = db.prepare('INSERT INTO feedback (rating, comments, name) VALUES (?, ?, ?)');
        stmt.run(rating, comments || '', name || 'Anónimo');

        // Send Telegram Notification
        await sendTelegramNotification(
            `⭐ <b>Nueva Calificación Recibida</b>\n\n` +
            `<b>De:</b> ${name || 'Anónimo'}\n` +
            `<b>Puntuación:</b> ${rating}/5\n` +
            `<b>Comentario:</b> ${comments || 'Sin comentario'}`
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Database error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
