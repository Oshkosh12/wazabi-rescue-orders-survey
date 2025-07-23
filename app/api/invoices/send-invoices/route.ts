import nodemailer from "nodemailer"

export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const pdfFile = formData.get("pdf") as File
    const orderId = (formData.get("orderId") as string) || "N/A"

    console.log("✅ Received request with PDF file:", pdfFile?.name)

    if (!pdfFile) {
      return new Response(JSON.stringify({ error: "Missing PDF file." }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Convert file to buffer
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer())

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
    const transporter = nodemailer.createTransport({
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
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
          <h2>🛒 Wazabi Rescue New Order</h2>
          <p><strong>Order ID:</strong> ${orderId}</p>
          <p>Please find the invoice PDF attached to this email.</p>
          <hr />
          <p style="font-size: 12px; color: #888;">This is an automated notification from Wazabi Orders.</p>
        </div>
      `,
      attachments: [
        {
          filename: `invoice-${orderId}.pdf`,
          content: pdfBuffer,
          contentType: "application/pdf",
        },
      ],
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
