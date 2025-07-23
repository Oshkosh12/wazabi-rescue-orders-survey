// app/api/send-invoice/route.ts

import nodemailer from 'nodemailer';

export const runtime = 'nodejs'; // Prevents Edge Function fallback

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("✅ Received body:", body);

    const pdfUrl = body?.pdfUrl?.trim();
    const orderId = body?.orderId?.trim() || '';

    if (!pdfUrl) {
      return new Response(JSON.stringify({ error: 'Missing PDF URL.' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ✅ Load Gmail credentials from environment variables
    const user = 'info@wazabilabs.com';
    const pass = process.env.GMAIL_APP_PASSWORD;

    if (!pass) {
      console.error("❌ GMAIL_APP_PASSWORD not set.");
      return new Response(JSON.stringify({ error: 'Email password not configured.' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ✅ Configure Nodemailer
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user,
        pass,
      },
    });

    const timestamp = new Date().toISOString();
    const uniqueSubject = `🧾 Wazabi Rescue Order — #${orderId} @ ${timestamp}`;

    const mailOptions = {
      from: `"Wazabi Rescue Orders" <${user}>`,
      to: ['info@wazabilabs.com', 'okashaamjadali360@gmail.com'],
      subject: uniqueSubject,
      headers: {
        'Message-ID': `<order-${orderId}-${Date.now()}@wazabilabs.com>`,
      },
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>🛒 Wazabi Rescue New Order</h2>
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

    await transporter.sendMail(mailOptions);
    console.log("✅ Email sent successfully.");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error("❌ Email sending failed:", error);
    return new Response(JSON.stringify({ error: 'Failed to send email.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
