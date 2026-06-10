'use client'

import { SessionProvider } from 'next-auth/react'
import { CartProvider } from '@/context/CartContext'
import { usePathname } from 'next/navigation'

export default function Providers({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isAdmin = pathname?.startsWith('/admin')
  const basePath = isAdmin ? '/api/auth' : '/api/customer/auth'

  return (
    <SessionProvider basePath={basePath}>
      <CartProvider>{children}</CartProvider>
    </SessionProvider>
  )
}
