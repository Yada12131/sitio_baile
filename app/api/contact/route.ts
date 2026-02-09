import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, email, phone, subject, message } = body;

        // Simple validation
        if (!name || !email || !subject || !message) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        const result = await query(
            'INSERT INTO messages (name, email, phone, subject, message) VALUES ($1, $2, $3, $4, $5) RETURNING id',
            [name, email, phone || '', subject, message]
        );

        // Send Telegram Notification
        await sendTelegramNotification(
            `📩 <b>Nuevo Mensaje de Contacto</b>\n\n` +
            `<b>De:</b> ${name} (${email})\n` +
            `<b>Teléfono:</b> ${phone || 'N/A'}\n` +
            `<b>Asunto:</b> ${subject}\n\n` +
            `${message}`
        );

        return NextResponse.json({ success: true, id: result.rows[0].id });
    } catch (error) {
        console.error('Contact error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
