// src/components/NavigationRefresh.tsx
// Forces server re-render on back/forward navigation by calling router.refresh().
// This pairs with `export const dynamic = 'force-dynamic'` on pages that fetch
// server-side data, ensuring stale cached HTML is never shown after back-nav.
'use client'
import { useEffect, useRef } from 'react'
import { useRouter, usePathname } from 'next/navigation'

export default function NavigationRefresh() {
  const router   = useRouter()
  const pathname = usePathname()
  // Track previous pathname so we know we actually navigated back (not just a refresh)
  const prevPath = useRef<string>(pathname)

  useEffect(() => {
    const handlePopState = () => {
      // Browser back/forward pressed — force a fresh server re-render
      router.refresh()
    }

    const handleVisibilityChange = () => {
      // Tab came back into focus after being hidden (e.g. switching tabs)
      if (document.visibilityState === 'visible') {
        router.refresh()
      }
    }

    window.addEventListener('popstate', handlePopState)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('popstate', handlePopState)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [router])

  // Also refresh whenever pathname changes back to home (link-based back-nav)
  useEffect(() => {
    if (prevPath.current !== pathname && pathname === '/') {
      router.refresh()
    }
    prevPath.current = pathname
  }, [pathname, router])

  return null
}
