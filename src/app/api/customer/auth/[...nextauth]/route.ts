import NextAuth from 'next-auth'
import { customerAuthOptions } from '@/lib/customerAuth'

// NextAuth v4 only reads the ORIGIN from NEXTAUTH_URL and appends /api/auth by default.
// We must override it at request time so it uses our custom /api/customer/auth path.
// We also accept both www and non-www as valid hosts (Vercel does a 308 www redirect).

const ALLOWED_HOSTS = new Set([
  'labelindeza.com',
  'www.labelindeza.com',
])

const handler = (req: Request, ctx: any) => {
  const requestHost = req.headers.get('host') || ''
  const protocol    = req.headers.get('x-forwarded-proto') || 'https'

  if (ALLOWED_HOSTS.has(requestHost)) {
    process.env.NEXTAUTH_URL = `${protocol}://${requestHost}/api/customer/auth`
  } else {
    // Fallback for localhost dev
    const base = process.env.NEXTAUTH_URL?.replace(/\/(api\/)?(customer\/)?auth.*$/, '') || 'http://localhost:3000'
    process.env.NEXTAUTH_URL = `${base}/api/customer/auth`
  }

  return NextAuth(customerAuthOptions)(req, ctx)
}

export { handler as GET, handler as POST }
