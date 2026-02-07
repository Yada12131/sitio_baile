const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function sendTelegramNotification(message: string) {
    if (!BOT_TOKEN || !CHAT_ID) {
        console.warn('Telegram credentials not found. Notification skipped.');
        return;
    }

    try {
        const url = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                chat_id: CHAT_ID,
                text: message,
                parse_mode: 'HTML', // Allows bold/italic in messages
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error('Failed to send Telegram notification:', errorData);
        }
    } catch (error) {
        console.error('Error sending Telegram notification:', error);
    }
}
