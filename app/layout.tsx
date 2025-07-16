import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Wazabi Exotics - Order Now',
  description: 'Wazabi Exotics',
  generator: 'v0.dev',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
