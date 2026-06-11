import NextAuth from 'next-auth'
import { customerAuthOptions } from '@/lib/customerAuth'

const handler = async (req: Request, ctx: any) => {
  // Fix NextAuth v4 Vercel Bug:
  // Vercel physically forces NextAuth's base path to /api/auth internally.
  // This causes NextAuth's URL parser to break (returning "GET is not supported")
  // when handling requests at /api/customer/auth.
  // We bypass this by spoofing the request URL to match what NextAuth expects.
  
  const url = new URL(req.url)
  url.pathname = url.pathname.replace('/api/customer/auth', '/api/auth')
  
  const spoofedReq = new Request(url, {
    method: req.method,
    headers: req.headers,
    body: req.body,
    duplex: 'half'
  } as any)
  
  return NextAuth(customerAuthOptions)(spoofedReq, ctx)
}

export { handler as GET, handler as POST }
