import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

export async function POST(request: Request) {
  try {
    const data = await request.json()

    // Fetch the current maximum order_number and increment it
    const { data: maxOrder, error: maxError } = await supabase
      .from("invoices")
      .select("order_number")
      .order("order_number", { ascending: false })
      .limit(1)
      .single()

    if (maxError && maxError.code !== "PGRST116") {
      // PGRST116 means no rows found (table is empty)
      console.error("Error fetching max order number:", maxError)
      return NextResponse.json({ error: maxError.message }, { status: 500 })
    }

    const nextOrderNumber = (maxOrder?.order_number || 0) + 1

    // If PDF data is provided, we'll store it and generate a URL
    let pdfUrl = null
    if (data.pdfData) {
      // Store PDF in Supabase Storage
      const fileName = `invoice-${String(nextOrderNumber).padStart(3, "0")}-${Date.now()}.pdf`

      // Convert base64 to buffer
      const pdfBuffer = Buffer.from(data.pdfData.split(",")[1], "base64")

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("invoices")
        .upload(fileName, pdfBuffer, {
          contentType: "application/pdf",
          upsert: false,
        })

      if (uploadError) {
        console.error("Error uploading PDF:", uploadError)
        // Continue without PDF URL if upload fails
      } else {
        // Get public URL
        const { data: urlData } = supabase.storage.from("invoices").getPublicUrl(fileName)

        pdfUrl = urlData.publicUrl
      }
    }

    const { data: insertedData, error } = await supabase
      .from("invoices")
      .insert([
        {
          thca_legal: data.thcALegal,
          customer_type: data.customerType,
          location_count: data.locationCount,
          customer_name: data.formData.name,
          customer_email: data.formData.email,
          sales_rep: data.formData.rep,
          selected_products: data.selectedProducts,
          pdf_url: pdfUrl, // Store the PDF URL
        },
      ])
      .select("id, order_number, pdf_url") // Select the generated id, order_number, and pdf_url

    if (error) {
      console.error("Error inserting data:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return the generated id, order_number, and pdf_url
    return NextResponse.json(
      {
        message: "Invoice saved successfully!",
        id: insertedData[0].id,
        orderNumber: insertedData[0].order_number,
        pdfUrl: insertedData[0].pdf_url,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("Error in POST /api/invoices:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { data: invoices, error } = await supabase
      .from("invoices")
      .select("*")
      .order("order_date", { ascending: false })

    if (error) {
      console.error("Error fetching data:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(invoices, { status: 200 })
  } catch (error) {
    console.error("Error in GET /api/invoices:", error)
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 })
  }
}
