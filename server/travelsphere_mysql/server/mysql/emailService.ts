const BREVO_API_URL =
    'https://api.brevo.com/v3/smtp/email';

export async function sendOtpEmail(
    toEmail: string,
    otp: string
): Promise<void> {

    const apiKey = process.env.BREVO_API_KEY;
    const senderEmail = process.env.BREVO_SENDER_EMAIL;
    const senderName =
        process.env.BREVO_SENDER_NAME || 'TravelSphere';

    if (!apiKey || !senderEmail) {
        throw new Error(
            'Brevo email configuration is missing'
        );
    }

    const response = await fetch(
        BREVO_API_URL,
        {
            method: 'POST',

            headers: {
                'Content-Type': 'application/json',
                'api-key': apiKey
            },

            body: JSON.stringify({
                sender: {
                    name: senderName,
                    email: senderEmail
                },

                to: [
                    {
                        email: toEmail
                    }
                ],

                subject:
                    'Your TravelSphere Verification Code',

                htmlContent: `
                    <div style="
                        font-family: Arial, sans-serif;
                        max-width: 600px;
                        margin: auto;
                        padding: 20px;
                    ">
                        <h2>
                            TravelSphere Email Verification
                        </h2>

                        <p>
                            Your verification code is:
                        </p>

                        <div style="
                            font-size: 32px;
                            font-weight: bold;
                            letter-spacing: 8px;
                            margin: 20px 0;
                        ">
                            ${otp}
                        </div>

                        <p>
                            This code expires in
                            <strong>5 minutes</strong>.
                        </p>

                        <p>
                            If you did not request this,
                            you can safely ignore this email.
                        </p>

                        <hr>

                        <p>TravelSphere</p>
                    </div>
                `
            })
        }
    );

    if (!response.ok) {
        const errorText =
            await response.text();

        throw new Error(
            `Brevo email failed: ${response.status} ${errorText}`
        );
    }
}
