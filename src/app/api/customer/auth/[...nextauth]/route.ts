import NextAuth from 'next-auth'
import { customerAuthOptions } from '@/lib/customerAuth'

// NEXTAUTH_URL is strictly defined in Vercel as:
// https://www.labelindeza.com/api/customer/auth
// NextAuth will natively read this value at boot time.
const handler = NextAuth(customerAuthOptions)

export { handler as GET, handler as POST }
