import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HourlyPal Admin Dashboard',
  description: 'Internal admin and team dashboard for managing the HourlyPal platform — users, bookings, analytics, and more.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" style={{ colorScheme: 'light' }}>
      <body>
        {children}
      </body>
    </html>
  )
}
