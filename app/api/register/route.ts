import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendTelegramNotification } from '@/lib/telegram';

export async function POST(request: Request) {
    try {

        const body = await request.json();
        const { classId, name, email, phone } = body;

        if (!classId || !name || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await query(
            'INSERT INTO registrations (class_id, student_name, student_email, student_phone) VALUES ($1, $2, $3, $4)',
            [classId, name, email, phone || '']
        );

        // Get Class Name for notification
        const res = await query('SELECT name FROM classes WHERE id = $1', [classId]);
        const className = res.rows[0]?.name || 'Clase Desconocida';

        // Send Telegram Notification
        await sendTelegramNotification(
            `💃 <b>Nueva Inscripción a Clase</b>\n\n` +
            `<b>Clase:</b> ${className}\n` +
            `<b>Estudiante:</b> ${name}\n` +
            `<b>Email:</b> ${email}\n` +
            `<b>Teléfono:</b> ${phone || 'N/A'}`
        );

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
