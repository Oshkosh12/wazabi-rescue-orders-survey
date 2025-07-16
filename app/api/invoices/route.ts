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

    const { data: insertedData, error } = await supabase
      .from("invoices")
      .insert([
        {
          order_number: nextOrderNumber, // Use the generated sequential number
          thca_legal: data.thcALegal,
          customer_type: data.customerType,
          location_count: data.locationCount,
          customer_name: data.formData.name,
          customer_email: data.formData.email,
          customer_phone: data.formData.phone,
          customer_address: data.formData.address,
          customer_suite: data.formData.suite,
          customer_city: data.formData.city,
          customer_state: data.formData.state,
          customer_zip: data.formData.zip,
          sales_rep: data.formData.rep,
          additional_notes: data.formData.message,
          preferred_carriers: data.formData.carriers,
          lift_gate_required: data.formData.liftGate,
          ein_file_name: data.formData.einFile?.name || null,
          tax_file_name: data.formData.taxFile?.name || null,
          selected_products: data.selectedProducts,
        },
      ])
      .select("id, order_number") // Select the generated id and order_number

    if (error) {
      console.error("Error inserting data:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    // Return the generated id and order_number
    return NextResponse.json(
      { message: "Invoice saved successfully!", id: insertedData[0].id, orderNumber: insertedData[0].order_number },
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
