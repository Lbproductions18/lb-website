exports.handler = async (event) => {
    // Only allow POST
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    try {
        const { name, email, phone } = JSON.parse(event.body);

        // Token stored securely in Netlify environment variables
        const telegramBotToken = process.env.TELEGRAM_BOT_TOKEN;
        const chatId = process.env.TELEGRAM_CHAT_ID;

        const message = `🎉 *Nouveau prospect Action Flow!*

👤 *Nom:* ${name}
📧 *Email:* ${email}
📱 *Téléphone:* ${phone}

⏰ _Rappelle ce prospect dans les prochaines 24 heures._

— Elena, ton assistante virtuelle`;

        const response = await fetch(`https://api.telegram.org/bot${telegramBotToken}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: chatId,
                text: message,
                parse_mode: 'Markdown'
            })
        });

        if (!response.ok) {
            throw new Error('Telegram API error');
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ success: true })
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Failed to send notification' })
        };
    }
};
