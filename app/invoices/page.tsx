import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ProductVariant {
  name: string
  image: string
}

interface Product {
  id: number
  name: string
  price: string
  image: string
  variants: ProductVariant[]
}

interface SelectedProduct extends Product {
  variantsSelected: Record<string, number>
}

interface Invoice {
  id: string // Unique UUID from database
  order_number: number // Sequential number from database
  order_date: string
  thca_legal: boolean
  customer_type: string
  location_count: number
  customer_name: string
  customer_email: string
  customer_phone: string
  customer_address: string
  customer_suite: string | null
  customer_city: string
  customer_state: string
  customer_zip: string
  sales_rep: string
  additional_notes: string | null
  preferred_carriers: string[]
  lift_gate_required: string
  ein_file_name: string | null
  tax_file_name: string | null
  selected_products: Record<number, SelectedProduct>
}

async function getInvoices(): Promise<Invoice[]> {
  const apiUrl = `${process.env.NEXT_PUBLIC_VERCEL_URL || "https://wazabirescue.wazabilabs.com"}/api/invoices`
  const res = await fetch(apiUrl, {
    cache: "no-store", // Ensure data is always fresh
  })
  if (!res.ok) {
    // Log the response status and text if the fetch fails
    const errorText = await res.text()
    console.error(`Failed to fetch invoices with status ${res.status}: ${errorText}`)
    throw new Error("Failed to fetch invoices")
  }
  return res.json()
}

export default async function InvoicesPage() {
  const invoices = await getInvoices()

  return (
    <div id="invoice"
      className="container mx-auto pt-12 pb-32">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold text-center">All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          {invoices.length === 0 ? (
            <p className="text-center text-gray-500">No invoices found. Submit an order to see it here!</p>
          ) : (
            <div className="overflow-x-auto">
              <Table className="min-w-full divide-y divide-gray-200">
                <TableHeader>
                  <TableRow>
                    <TableHead>Order #</TableHead>
                    <TableHead>Invoice ID</TableHead> {/* New column for UUID */}
                    <TableHead>Date</TableHead>
                    <TableHead>Customer Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Locations</TableHead>
                    <TableHead>THC-A Legal</TableHead>
                    <TableHead>Total Items</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Sales Rep</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((invoice) => {
                    const totalItems = Object.values(invoice.selected_products).reduce((sum, product) => {
                      return sum + Object.values(product.variantsSelected).reduce((vSum, qty) => vSum + qty, 0)
                    }, 0)

                    const totalAmount = Object.values(invoice.selected_products).reduce((total, product) => {
                      const price = Number.parseFloat(product.price.replace("$", ""))
                      const variantTotal = Object.values(product.variantsSelected).reduce((sum, qty) => sum + qty, 0)
                      return total + price * variantTotal
                    }, 0)

                    return (
                      <TableRow key={invoice.id} className="break-inside-avoid-page">
                        <TableCell className="font-medium">{String(invoice.order_number).padStart(3, "0")}</TableCell>
                        <TableCell className="text-xs max-w-[120px] truncate">{invoice.id}</TableCell>{" "}
                        {/* Display UUID */}
                        <TableCell>{new Date(invoice.order_date).toLocaleDateString()}</TableCell>
                        <TableCell>{invoice.customer_name}</TableCell>
                        <TableCell>{invoice.customer_email}</TableCell>
                        <TableCell>{invoice.sales_rep || "N/A"}</TableCell>
                        <TableCell>{invoice.customer_type}</TableCell>
                        <TableCell>{invoice.location_count}</TableCell>
                        <TableCell>
                          <Badge variant={invoice.thca_legal ? "default" : "destructive"}>
                            {invoice.thca_legal ? "Yes" : "No"}
                          </Badge>
                        </TableCell>
                        <TableCell>{totalItems}</TableCell>
                        <TableCell>${totalAmount.toFixed(2)}</TableCell>   
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
