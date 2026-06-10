'use client'
import { useSession } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'

export function useRequireAuth() {
  const { data: session, status } = useSession()
  const router   = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push(`/account?redirect=${encodeURIComponent(pathname)}`)
    }
  }, [status, router, pathname])

  return { session, status, isLoading: status === 'loading' }
}
