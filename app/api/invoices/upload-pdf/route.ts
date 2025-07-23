import { type NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("pdf") as File
    const orderNumber = formData.get("orderNumber") as string

    if (!file) {
      return NextResponse.json({ error: "No PDF file provided" }, { status: 400 })
    }

    console.log("📤 Uploading PDF to Supabase Storage...")

    // Convert file to buffer
    const fileBuffer = await file.arrayBuffer()
    const fileName = `invoice-${orderNumber.padStart(3, "0")}-${Date.now()}.pdf`

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage.from("invoices").upload(fileName, fileBuffer, {
      contentType: "application/pdf",
      upsert: false,
    })

    if (error) {
      console.error("❌ Supabase upload error:", error)
      return NextResponse.json({ error: `Upload failed: ${error.message}` }, { status: 500 })
    }

    // Get public URL
    const { data: publicUrlData } = supabase.storage.from("invoices").getPublicUrl(fileName)

    console.log("✅ PDF uploaded successfully:", publicUrlData.publicUrl)

    return NextResponse.json({
      success: true,
      pdfUrl: publicUrlData.publicUrl,
      fileName: fileName,
    })
  } catch (error) {
    console.error("❌ Upload error:", error)
    return NextResponse.json(
      { error: `Upload failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
