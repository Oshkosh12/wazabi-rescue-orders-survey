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
  sales_rep: string
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

function getStats(invoices: Invoice[]) {
  const totalInvoices = invoices.length
  const uniqueCustomers = new Set(invoices.map((inv) => inv.customer_name.toLowerCase())).size
  const totalRevenue = invoices.reduce((sum, invoice) => {
    return (
      sum +
      Object.values(invoice.selected_products).reduce((total, product) => {
        const price = Number.parseFloat(product.price.replace("$", ""))
        const variantTotal = Object.values(product.variantsSelected).reduce((sum, qty) => sum + qty, 0)
        return total + price * variantTotal
      }, 0)
    )
  }, 0)

  const totalItems = invoices.reduce((sum, invoice) => {
    return (
      sum +
      Object.values(invoice.selected_products).reduce((sum, product) => {
        return sum + Object.values(product.variantsSelected).reduce((vSum, qty) => vSum + qty, 0)
      }, 0)
    )
  }, 0)

  const avgOrderValue = totalInvoices > 0 ? totalRevenue / totalInvoices : 0

  return {
    totalInvoices,
    uniqueCustomers,
    totalRevenue,
    totalItems,
    avgOrderValue,
  }
}

export default async function InvoicesPage() {
  const invoices = await getInvoices()
  const stats = getStats(invoices)

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto pt-8 pb-16 px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Invoice Dashboard</h1>
          <p className="text-gray-600">Manage and track all your orders</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">Total Orders</p>
                  <p className="text-3xl font-bold">{stats.totalInvoices}</p>
                </div>
                <div className="bg-blue-400 bg-opacity-30 rounded-full p-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Unique Customers</p>
                  <p className="text-3xl font-bold">{stats.uniqueCustomers}</p>
                </div>
                <div className="bg-green-400 bg-opacity-30 rounded-full p-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold">${stats.totalRevenue.toLocaleString()}</p>
                </div>
                <div className="bg-purple-400 bg-opacity-30 rounded-full p-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-100 text-sm font-medium">Total Items</p>
                  <p className="text-3xl font-bold">{stats.totalItems.toLocaleString()}</p>
                </div>
                <div className="bg-orange-400 bg-opacity-30 rounded-full p-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M10 2L3 7v11a1 1 0 001 1h12a1 1 0 001-1V7l-7-5zM6 9.5a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-teal-500 to-teal-600 text-white">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-teal-100 text-sm font-medium">Avg Order Value</p>
                  <p className="text-3xl font-bold">${stats.avgOrderValue.toFixed(0)}</p>
                </div>
                <div className="bg-teal-400 bg-opacity-30 rounded-full p-3">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Invoices Table */}
        <Card className="shadow-xl">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="text-2xl font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              All Invoices ({invoices.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {invoices.length === 0 ? (
              <div className="text-center py-16">
                <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-12 h-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                    <path
                      fillRule="evenodd"
                      d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-700 mb-2">No invoices found</h3>
                <p className="text-gray-500">Submit an order to see it here!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Order #</TableHead>
                      <TableHead className="font-semibold">Date</TableHead>
                      <TableHead className="font-semibold">Customer</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Locations</TableHead>
                      <TableHead className="font-semibold">THC-A Legal</TableHead>
                      <TableHead className="font-semibold">Items</TableHead>
                      <TableHead className="font-semibold">Amount</TableHead>
                      <TableHead className="font-semibold">Sales Rep</TableHead>
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
                        <TableRow key={invoice.id} className="hover:bg-gray-50 transition-colors">
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 font-semibold text-sm">
                                  #{String(invoice.order_number).padStart(3, "0")}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{new Date(invoice.order_date).toLocaleDateString()}</div>
                              <div className="text-gray-500">
                                {new Date(invoice.order_date).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit",
                                })}
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">
                              <div className="font-medium">{invoice.customer_name}</div>
                              <div className="text-gray-500">{invoice.customer_email}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={invoice.customer_type === "Wholesale" ? "default" : "secondary"}>
                              {invoice.customer_type}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                  fillRule="evenodd"
                                  d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                              <span className="font-medium">{invoice.location_count}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={invoice.thca_legal ? "default" : "destructive"}>
                              {invoice.thca_legal ? "Legal" : "Not Legal"}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" />
                              </svg>
                              <span className="font-medium">{totalItems}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-bold text-green-600 text-lg">${totalAmount.toLocaleString()}</div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-6 h-6 bg-gray-200 rounded-full flex items-center justify-center">
                                <span className="text-gray-600 font-medium text-xs">
                                  {(invoice.sales_rep || "N/A").charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <span className="text-sm">{invoice.sales_rep || "N/A"}</span>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="text-center mt-8 text-gray-500">
          <p>Last updated: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  )
}
