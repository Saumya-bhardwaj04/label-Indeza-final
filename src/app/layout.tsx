import type { Metadata } from 'next'
import { Cormorant_Garamond, DM_Sans } from 'next/font/google'
import Providers from '@/components/Providers'
import NavigationRefresh from '@/components/NavigationRefresh'
import './globals.css'

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-display',
  display: 'swap',
})

const body = DM_Sans({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Label Indeza — Effortless Style, Thoughtfully Made',
  description: 'Modern essentials in soft tones and timeless cuts.',
  applicationName: 'Label Indeza',
  icons: {
    icon: '/favicon.png',
    apple: '/logo.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${display.variable} ${body.variable}`}>
      <body className={body.className}>
        <Providers>
          <NavigationRefresh />
          {children}
        </Providers>
      </body>
    </html>
  )
}

