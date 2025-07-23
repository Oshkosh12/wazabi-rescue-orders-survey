import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const { invoiceId, pdfUrl } = await request.json()

    if (!invoiceId || !pdfUrl) {
      return NextResponse.json({ error: "Missing invoiceId or pdfUrl" }, { status: 400 })
    }

    const { error } = await supabase.from("invoices").update({ pdf_url: pdfUrl }).eq("id", invoiceId)

    if (error) {
      console.error("Error updating PDF URL:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ message: "PDF URL updated successfully" }, { status: 200 })
  } catch (error) {
    console.error("Error in POST /api/invoices/update-pdf:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
