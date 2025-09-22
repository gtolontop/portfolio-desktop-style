import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gtol - Portfolio',
  description: 'Portfolio of Gtol, best fullstack developer',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}