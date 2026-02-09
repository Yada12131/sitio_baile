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

        if (!result.rows || result.rows.length === 0) {
            console.error('Database insertion failed (No rows returned). Likely DB connection issue.');
            throw new Error('Database insertion failed');
        }

        // Send Telegram Notification
        try {
            await sendTelegramNotification(
                `📩 <b>Nuevo Mensaje de Contacto</b>\n\n` +
                `<b>De:</b> ${name} (${email})\n` +
                `<b>Teléfono:</b> ${phone || 'N/A'}\n` +
                `<b>Asunto:</b> ${subject}\n\n` +
                `${message}`
            );
        } catch (tgError) {
            console.error('Telegram notification failed:', tgError);
            // Continue execution, do not fail the request just because notification failed
        }

        return NextResponse.json({ success: true, id: result.rows[0].id });
    } catch (error) {
        console.error('Contact error:', error);
        return NextResponse.json({ error: 'Failed to send message. Please try again later.' }, { status: 500 });
    }
}
