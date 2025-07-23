import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const pdfFile = formData.get("pdf") as File
    const orderNumber = formData.get("orderNumber") as string

    if (!pdfFile) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 })
    }

    // Create filename
    const fileName = `invoice-${String(orderNumber).padStart(3, "0")}-${Date.now()}.pdf`

    // Convert file to buffer
    const pdfBuffer = Buffer.from(await pdfFile.arrayBuffer())

    // Upload to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("invoices")
      .upload(fileName, pdfBuffer, {
        contentType: "application/pdf",
        upsert: false,
      })

    if (uploadError) {
      console.error("Error uploading PDF:", uploadError)
      return NextResponse.json({ error: "Failed to upload PDF" }, { status: 500 })
    }

    // Get public URL
    const { data: urlData } = supabase.storage.from("invoices").getPublicUrl(fileName)

    return NextResponse.json(
      {
        success: true,
        pdfUrl: urlData.publicUrl,
        message: "PDF uploaded successfully",
      },
      { status: 200 },
    )
  } catch (error: any) {
    console.error("❌ PDF upload failed:", error)
    return NextResponse.json(
      {
        error: "Failed to upload PDF.",
        details: error.message,
      },
      {
        status: 500,
      },
    )
  }
}
