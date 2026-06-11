import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from './mongodb'
import Admin from '@/models/Admin'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        // Strict input validation
        if (!credentials?.email || !credentials?.password) return null
        if (credentials.password.length < 6 || credentials.password.length > 128) return null
        if (credentials.email.length > 254) return null

        await connectDB()
        const admin = await Admin.findOne({ email: credentials.email.toLowerCase().trim() })
        if (!admin) return null

        // Block admins whose password is still in PENDING state (invite not accepted)
        if (admin.password.startsWith('PENDING_')) return null

        const isValid = await bcrypt.compare(credentials.password, admin.password)
        if (!isValid) return null

        return {
          id: admin._id.toString(),
          name: admin.name,
          email: admin.email,
          role: admin.role,
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 8 * 60 * 60, // 8-hour sessions — admin should re-login daily
  },
  jwt: {
    maxAge: 8 * 60 * 60,
  },
  pages: { signIn: '/admin/login' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = (user as any).role
        token.id = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).role = token.role
          ; (session.user as any).id = token.id
      }
      return session
    },
  },
}
