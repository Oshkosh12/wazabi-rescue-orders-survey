import nodemailer from "nodemailer"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    console.log("✅ Received body:", body)

    const pdfUrl = body?.pdfUrl?.trim()
    const orderId = body?.orderId?.trim() || "N/A"

    if (!pdfUrl) {
      return new Response(JSON.stringify({ error: "Missing PDF URL." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Gmail credentials from environment variables
    const user = "info@wazabilabs.com"
    const pass = process.env.GMAIL_APP_PASSWORD

    if (!pass) {
      console.error("❌ GMAIL_APP_PASSWORD not set.")
      return new Response(JSON.stringify({ error: "Email password not configured." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    console.log("✅ Creating transporter...")

    // Configure Nodemailer with Gmail
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user,
        pass,
      },
    })

    // Verify transporter configuration
    try {
      await transporter.verify()
      console.log("✅ Transporter verified successfully")
    } catch (verifyError) {
      console.error("❌ Transporter verification failed:", verifyError)
      return new Response(JSON.stringify({ error: "Email configuration verification failed." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const timestamp = new Date().toISOString()
    const uniqueSubject = `🧾 Wazabi Rescue Order — #${orderId} @ ${timestamp}`

    const mailOptions = {
      from: `"Wazabi Rescue Orders" <${user}>`,
      to: ["info@wazabilabs.com", "okashaamjadali360@gmail.com"],
      subject: uniqueSubject,
      headers: {
        "Message-ID": `<order-${orderId}-${Date.now()}@wazabilabs.com>`,
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
    }

    console.log("✅ Sending email...")
    await transporter.sendMail(mailOptions)
    console.log("✅ Email sent successfully.")

    return new Response(JSON.stringify({ success: true, message: "Email sent successfully" }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })
  } catch (error: any) {
    console.error("❌ Email sending failed:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to send email.",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
