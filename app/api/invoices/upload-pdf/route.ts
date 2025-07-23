export const runtime = "nodejs"

export async function POST(req: Request) {
  try {
    const formData = await req.formData()
    const pdfFile = formData.get("pdf") as File

    if (!pdfFile) {
      return new Response(JSON.stringify({ error: "No PDF file provided" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Convert file to base64 data URL for temporary storage
    const arrayBuffer = await pdfFile.arrayBuffer()
    const base64 = Buffer.from(arrayBuffer).toString("base64")
    const dataUrl = `data:application/pdf;base64,${base64}`

    // In a real application, you would upload this to a cloud storage service
    // For now, we'll return the data URL which can be used temporarily
    return new Response(
      JSON.stringify({
        success: true,
        pdfUrl: dataUrl,
        message: "PDF processed successfully",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error: any) {
    console.error("❌ PDF upload failed:", error)
    return new Response(
      JSON.stringify({
        error: "Failed to process PDF.",
        details: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}
