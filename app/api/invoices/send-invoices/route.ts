import nodemailer from "nodemailer"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    console.log("📧 Email API called")

    const body = await req.json()
    console.log("✅ Received body:", JSON.stringify(body, null, 2))

    const pdfUrl = body?.pdfUrl?.trim()
    const orderId = body?.orderId?.trim() || "N/A"

    if (!pdfUrl) {
      console.error("❌ Missing PDF URL")
      return new Response(JSON.stringify({ error: "Missing PDF URL." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Gmail credentials from environment variables
    const user = "info@wazabilabs.com"
    const pass = process.env.GMAIL_APP_PASSWORD

    console.log("📧 Email user:", user)
    console.log("📧 Password exists:", !!pass)

    if (!pass) {
      console.error("❌ GMAIL_APP_PASSWORD not set.")
      return new Response(JSON.stringify({ error: "Email password not configured." }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    console.log("✅ Creating transporter...")

    // Configure Nodemailer with Gmail
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user,
        pass,
      },
      debug: true, // Enable debug logging
      logger: true, // Enable logger
    })

    // Verify transporter configuration
    try {
      console.log("🔍 Verifying transporter...")
      await transporter.verify()
      console.log("✅ Transporter verified successfully")
    } catch (verifyError) {
      console.error("❌ Transporter verification failed:", verifyError)
      return new Response(
        JSON.stringify({
          error: "Email configuration verification failed.",
          details: verifyError.message,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      )
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
          <p>Click below to view and download the invoice:</p>
          <a href="${pdfUrl}" style="display:inline-block;padding:12px 24px;background:#10b981;color:#fff;text-decoration:none;border-radius:6px;font-weight:bold;margin:10px 0;">
            📄 Download Invoice PDF
          </a>
          <p style="margin-top: 20px;">
            <strong>Direct Link:</strong><br>
            <a href="${pdfUrl}" style="color: #10b981; word-break: break-all;">${pdfUrl}</a>
          </p>
          <hr style="margin: 30px 0;" />
          <p style="font-size: 12px; color: #888;">This is an automated notification from Wazabi Orders.</p>
        </div>
      `,
    }

    console.log("✅ Mail options prepared:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
      pdfUrl: pdfUrl.substring(0, 100) + "...",
    })

    console.log("📤 Sending email...")
    const result = await transporter.sendMail(mailOptions)
    console.log("✅ Email sent successfully:", result.messageId)

    return new Response(
      JSON.stringify({
        success: true,
        message: "Email sent successfully",
        messageId: result.messageId,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error: any) {
    console.error("❌ Email sending failed:", error)
    console.error("❌ Error stack:", error.stack)

    return new Response(
      JSON.stringify({
        error: "Failed to send email.",
        details: error.message,
        stack: error.stack,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
