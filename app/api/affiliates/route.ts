import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { sendTelegramNotification } from '@/lib/telegram';

export async function GET(request: Request) {
    try {
        const res = await query('SELECT * FROM affiliates ORDER BY created_at DESC');
        return NextResponse.json(res.rows);
    } catch (error) {
        return NextResponse.json({ error: 'Failed to fetch affiliates' }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { subject, ...formData } = body; // dynamic form data

        // Save to DB
        const res = await query(
            'INSERT INTO affiliates (data, status) VALUES ($1, $2) RETURNING id',
            [JSON.stringify(formData), 'pending']
        );

        // Fetch field definitions to make a nice Telegram message
        const fieldsRes = await query("SELECT * FROM form_fields WHERE form_type = 'affiliate' ORDER BY order_index ASC");
        const fields = fieldsRes.rows;

        // Construct Telegram Message
        let telegramMsg = `📩 <b>Nueva Solicitud de Afiliación</b>\n\n`;

        // Loop through defined fields to maintain order and labels
        fields.forEach((field: any) => {
            const value = formData[field.name];
            if (value) {
                telegramMsg += `<b>${field.label}:</b> ${value}\n`;
            }
        });

        // Add any extra fields not in definition but present in body (fallback)
        Object.keys(formData).forEach(key => {
            const isDefined = fields.find((f: any) => f.name === key);
            if (!isDefined && key !== 'subject') {
                telegramMsg += `<b>${key}:</b> ${formData[key]}\n`;
            }
        });

        try {
            await sendTelegramNotification(telegramMsg);
        } catch (tgError) {
            console.error('Telegram notification failed:', tgError);
        }

        return NextResponse.json({ success: true, id: res.rows[0].id });
    } catch (error) {
        console.error('Affiliate registration error:', error);
        return NextResponse.json({ error: 'Failed to register affiliate' }, { status: 500 });
    }
}
