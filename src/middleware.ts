import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Admin page routes ──────────────────────────────────────────
  // Always allow the login page, set-password page, and setup page
  if (pathname === '/admin/login' || pathname === '/admin/set-password' || pathname === '/admin/setup') {
    return NextResponse.next()
  }

  // All /admin/* pages — require valid JWT with role=admin
  if (pathname.startsWith('/admin')) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
    if (!token || (token as any).role !== 'admin') {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
    return NextResponse.next()
  }

  // ── Admin API routes (defense-in-depth) ───────────────────────
  // Even though each API route uses requireAdmin(), reject at middleware level too.
  // The invite and set-password routes use their own token-based auth — allow them.
  if (pathname.startsWith('/api/admin')) {
    const allowed = ['/api/admin/invite', '/api/admin/set-password']
    if (!allowed.includes(pathname)) {
      const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
      if (!token || (token as any).role !== 'admin') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
      }
    }
    return NextResponse.next()
  }

  // ── Customer routes ────────────────────────────────────────────
  // Checkout, orders, profile — redirect to /account if not logged in
  if (
    pathname.startsWith('/checkout') ||
    pathname.startsWith('/account/orders') ||
    pathname.startsWith('/account/profile')
  ) {
    const cookieName = process.env.NODE_ENV === 'production'
      ? '__Secure-next-auth.customer-session-token'
      : 'next-auth.customer-session-token'

    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      cookieName,
    })

    if (!token) {
      const redirectUrl = new URL('/account', req.url)
      redirectUrl.searchParams.set('redirect', pathname)
      return NextResponse.redirect(redirectUrl)
    }
    return NextResponse.next()
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
    '/checkout/:path*',
    '/account/orders/:path*',
    '/account/profile/:path*',
  ],
}
