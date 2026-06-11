import NextAuth from 'next-auth'
import { customerAuthOptions } from '@/lib/customerAuth'

// NEXTAUTH_URL is set in Vercel env vars as:
//   https://labelindeza.com/api/customer/auth
// NextAuth reads it natively — no dynamic override needed.
const handler = NextAuth(customerAuthOptions)
export { handler as GET, handler as POST }
