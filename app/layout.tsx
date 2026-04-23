import type { Metadata } from 'next'
import { Analytics } from '@vercel/analytics/next'

import './globals.css'

export const metadata: Metadata = {
  title: 'Scribe',
  description: 'AI-powered writing assistant for turning data outputs into polished narrative.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth" className="h-full antialiased">
      <body className="min-h-full bg-[var(--bg-primary)] text-[var(--text-primary)]">
        {children}
        <Analytics />
      </body>
    </html>
  )
}
