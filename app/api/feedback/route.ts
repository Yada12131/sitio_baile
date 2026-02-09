import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { rating, comments, name } = body;

        if (!rating) {
            return NextResponse.json({ error: 'Rating is required' }, { status: 400 });
        }

        await query(
            'INSERT INTO feedback (rating, comments, name) VALUES ($1, $2, $3)',
            [rating, comments || '', name || 'Anónimo']
        );

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
