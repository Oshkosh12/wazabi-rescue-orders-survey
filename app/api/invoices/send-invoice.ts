import nodemailer from 'nodemailer';

export async function POST(req: Request) {
  const body = await req.json();
  console.log("Received body:", body);

  const pdfUrl = body?.pdfUrl?.trim();
  const orderId = body?.orderId?.trim() || ''; // ✅ Only once!

  if (!pdfUrl) {
    return new Response(JSON.stringify({ error: 'Missing PDF URL.' }), { status: 400 });
  }

  // Gmail SMTP config (make sure App Password is used, not real password)
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'info@wazabilabs.com',
      pass: process.env.GMAIL_APP_PASSWORD, // 🔑 Use App Password
    },
  });

const timestamp = new Date().toISOString();
const uniqueSubject = `🧾 New Order Received — #${orderId} @ ${timestamp}`;

const mailOptions = {
  from: '"Wazabi Orders" <info@wazabilabs.com>',
  to: ['info@wazabilabs.com', 'okashaamjadali360@gmail.com'],
  subject: uniqueSubject,
  headers: {
    'Message-ID': `<order-${orderId}-${Date.now()}@wazabilabs.com>`,
    'In-Reply-To': '',
    'References': '',
  },
   html: `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2>🛒 New Order Received</h2>
        <p><strong>Order ID:</strong> ${orderId}</p>
        <p>Click below to view the invoice:</p>
        <a href="${pdfUrl}" style="display:inline-block;padding:10px 15px;background:#111;color:#fff;text-decoration:none;border-radius:4px;">
          📄 Download Invoice PDF
        </a>
        <hr />
        <p style="font-size: 12px; color: #888;">This is an automated notification from Wazabi Orders.</p>
      </div>
    `,
};

  try {
    await transporter.sendMail(mailOptions);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    console.error('Failed to send email:', error.message || error);
    return new Response(JSON.stringify({ error: 'Failed to send email.' }), { status: 500 });
  }
}
