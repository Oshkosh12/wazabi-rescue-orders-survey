import { NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: Request) {
  try {
    const { pdfUrl, orderId } = await request.json()

    console.log("📧 Starting email send process...")
    console.log("PDF URL:", pdfUrl)
    console.log("Order ID:", orderId)

    // Check for required environment variables
    if (!process.env.GMAIL_APP_PASSWORD) {
      console.error("❌ GMAIL_APP_PASSWORD not found in environment variables")
      return NextResponse.json({ error: "Email configuration missing. Please contact support." }, { status: 500 })
    }

    // Create transporter with Gmail
    const transporter = nodemailer.createTransporter({
      service: "gmail",
      auth: {
        user: "info@wazabilabs.com",
        pass: process.env.GMAIL_APP_PASSWORD,
      },
      debug: true, // Enable debug logging
      logger: true, // Enable logging
    })

    console.log("📧 Verifying transporter...")

    // Verify transporter configuration
    try {
      await transporter.verify()
      console.log("✅ Transporter verified successfully")
    } catch (verifyError) {
      console.error("❌ Transporter verification failed:", verifyError)
      return NextResponse.json({ error: "Email server configuration error. Please contact support." }, { status: 500 })
    }

    const mailOptions = {
      from: "info@wazabilabs.com",
      to: "info@wazabilabs.com",
      subject: `New Wazabi Order #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">New Order Received</h2>
          <p>A new order has been placed:</p>
          <ul>
            <li><strong>Order ID:</strong> ${orderId}</li>
            <li><strong>Date:</strong> ${new Date().toLocaleDateString()}</li>
          </ul>
          <p>
            <a href="${pdfUrl}" 
               style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Download Invoice PDF
            </a>
          </p>
          <p style="color: #666; font-size: 12px;">
            This email was automatically generated from the Wazabi order system.
          </p>
        </div>
      `,
    }

    console.log("📧 Sending email...")
    console.log("Mail options:", {
      from: mailOptions.from,
      to: mailOptions.to,
      subject: mailOptions.subject,
    })

    const info = await transporter.sendMail(mailOptions)

    console.log("✅ Email sent successfully!")
    console.log("Message ID:", info.messageId)
    console.log("Response:", info.response)

    return NextResponse.json(
      {
        message: "Email sent successfully",
        messageId: info.messageId,
        response: info.response,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("❌ Error in send-invoices route:", error)
    console.error("Error stack:", error instanceof Error ? error.stack : "No stack trace")

    return NextResponse.json(
      {
        error: "Failed to send email",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
      },
      { status: 500 },
    )
  }
}
