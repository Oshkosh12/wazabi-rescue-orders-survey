import { type NextRequest, NextResponse } from "next/server"
import nodemailer from "nodemailer"

export async function POST(request: NextRequest) {
  console.log("📧 Email API endpoint called")

  try {
    const { pdfUrl } = await request.json()
    console.log("📧 PDF URL received:", pdfUrl)

    // Validate environment variables
    const gmailUser = process.env.GMAIL_APP_PASSWORD ? "info@wazabilabs.com" : null
    const gmailPass = process.env.GMAIL_APP_PASSWORD

    console.log("📧 Gmail user configured:", !!gmailUser)
    console.log("📧 Gmail password configured:", !!gmailPass)

    if (!gmailUser || !gmailPass) {
      console.error("📧 Missing Gmail credentials")
      return NextResponse.json(
        {
          error: "Email configuration missing",
          suggestion: "Please check Gmail app password in environment variables",
        },
        { status: 500 },
      )
    }

    // Create transporter with explicit SMTP settings
    console.log("📧 Creating email transporter...")
    const transporter = nodemailer.createTransport({
      service: "gmail",
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: gmailUser,
        pass: gmailPass,
      },
      tls: {
        rejectUnauthorized: false,
      },
    })

    // Verify transporter configuration
    console.log("📧 Verifying transporter...")
    try {
      await transporter.verify()
      console.log("📧 Transporter verified successfully")
    } catch (verifyError) {
      console.error("📧 Transporter verification failed:", verifyError)
      return NextResponse.json(
        {
          error: "Email authentication failed",
          suggestion: "Please check your Gmail app password and ensure 2FA is enabled",
        },
        { status: 500 },
      )
    }

    // Send email
    console.log("📧 Sending email...")
    const mailOptions = {
      from: gmailUser,
      to: "info@wazabilabs.com, okashaamjadali360@gmail.com, arij305@gmail.com",
      subject: "New Wazabi Order Received",
      html: `
        <h2>New Order Notification</h2>
        <p>A new order has been placed and is ready for review.</p>
        <p><strong>PDF Invoice:</strong> <a href="${pdfUrl}" target="_blank">View Invoice</a></p>
        <p>Please review the order details and process accordingly.</p>
        <br>
        <p>Best regards,<br>Wazabi Order System</p>
      `,
    }

    const info = await transporter.sendMail(mailOptions)
    console.log("📧 Email sent successfully:", info.messageId)

    return NextResponse.json({
      success: true,
      messageId: info.messageId,
    })
  } catch (error) {
    console.error("📧 Email sending error:", error)

    // Provide specific error messages
    let errorMessage = "Failed to send email"
    let suggestion = "Please try again or contact support"

    if (error instanceof Error) {
      if (error.message.includes("Invalid login")) {
        errorMessage = "Gmail authentication failed"
        suggestion = "Please check your Gmail app password and ensure 2FA is enabled"
      } else if (error.message.includes("ECONNREFUSED")) {
        errorMessage = "Cannot connect to Gmail servers"
        suggestion = "Please check your internet connection"
      } else if (error.message.includes("timeout")) {
        errorMessage = "Email sending timed out"
        suggestion = "Please try again in a few moments"
      } else {
        errorMessage = error.message
      }
    }

    return NextResponse.json(
      {
        error: errorMessage,
        suggestion: suggestion,
      },
      { status: 500 },
    )
  }
}
