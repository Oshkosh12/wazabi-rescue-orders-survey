import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { invoiceId, pdfUrl } = await request.json()

    if (!invoiceId || !pdfUrl) {
      return NextResponse.json({ error: "Missing invoiceId or pdfUrl" }, { status: 400 })
    }

    console.log("📝 Updating invoice with PDF URL...")

    const { error } = await supabase.from("invoices").update({ pdf_url: pdfUrl }).eq("id", invoiceId)

    if (error) {
      console.error("❌ Database update error:", error)
      return NextResponse.json({ error: `Database update failed: ${error.message}` }, { status: 500 })
    }

    console.log("✅ Invoice updated with PDF URL")

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("❌ Update error:", error)
    return NextResponse.json(
      { error: `Update failed: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
