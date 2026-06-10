import NextAuth from 'next-auth'
import { customerAuthOptions } from '@/lib/customerAuth'

// Allowed origins — built from the NEXTAUTH_URL env var (set in .env.local / production env)
function getSafeBaseUrl(): string {
  const configured = process.env.NEXTAUTH_URL
  if (configured) {
    // Strip any trailing /api/... path the env might have
    return configured.replace(/\/(api\/)?(customer\/)?auth.*$/, '')
  }
  return 'http://localhost:3000'
}

const handler = (req: Request, ctx: any) => {
  // Validate the Host header against the configured NEXTAUTH_URL
  // This prevents Host header injection attacks that could redirect OAuth callbacks
  const configuredBase = getSafeBaseUrl()
  const configuredHost = new URL(configuredBase).host

  const requestHost = req.headers.get('host') || ''

  // Only override NEXTAUTH_URL when the host matches what we expect
  if (requestHost === configuredHost) {
    const protocol = req.headers.get('x-forwarded-proto') || new URL(configuredBase).protocol.replace(':', '')
    process.env.NEXTAUTH_URL = `${protocol}://${requestHost}/api/customer/auth`
  } else {
    // Use the configured base URL — don't trust the Host header
    process.env.NEXTAUTH_URL = `${configuredBase}/api/customer/auth`
  }

  return NextAuth(customerAuthOptions)(req, ctx)
}

export { handler as GET, handler as POST }
