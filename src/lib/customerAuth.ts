import { NextAuthOptions } from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from './mongodb'
import Customer from '@/models/Customer'

export const customerAuthOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    GoogleProvider({
      clientId:     process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    CredentialsProvider({
      id:   'email-otp',
      name: 'Email OTP',
      credentials: {
        email:      { label: 'Email', type: 'email' },
        customerId: { label: 'Customer ID', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.customerId) return null
        // Validate customerId format (MongoDB ObjectId — 24 hex chars)
        if (!/^[a-f\d]{24}$/i.test(credentials.customerId)) return null

        await connectDB()
        const customer = await Customer.findById(credentials.customerId)
        if (!customer) return null
        return {
          id:    customer._id.toString(),
          name:  customer.name,
          email: customer.email,
          image: customer.image,
        }
      },
    }),
  ],

  session: {
    strategy: 'jwt',
    maxAge:   30 * 24 * 60 * 60, // 30 days for customers (stay logged in)
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60,
  },

  cookies: {
    sessionToken: {
      name: 'next-auth.customer-session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  pages: {
    signIn:  '/account',
    signOut: '/account',
    error:   '/account',
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === 'google') {
        await connectDB()
        const email = user.email?.toLowerCase()
        if (!email) return false

        const existing = await Customer.findOne({ email })

        if (existing) {
          // BLOCK: This email was registered via OTP — cannot use Google
          if (existing.provider === 'email') {
            return `/account?error=use_email`
          }
          // Google account already exists — allow sign in, refresh image if missing
          if (!existing.googleId) {
            await Customer.findByIdAndUpdate(existing._id, {
              googleId: user.id,
              image:    user.image,
            })
          }
          return true
        }

        // New user — create Google account
        const newCustomer = await Customer.create({
          name:          user.name || 'Customer',
          email,
          image:         user.image,
          provider:      'google',
          googleId:      user.id,
          emailVerified: new Date(),
        })

        // Trigger welcome email in background
        try {
          const { sendLoginWelcomeEmail } = require('@/lib/email')
          sendLoginWelcomeEmail(newCustomer.email, newCustomer.name).catch((err: any) => {
            console.error('Failed to send Google welcome email:', err)
          })
        } catch (e) {
          console.error('Error importing/calling sendLoginWelcomeEmail for Google signup:', e)
        }

        return true
      }
      return true
    },

    async jwt({ token, user, account, trigger, session }) {
      if (user) {
        token.id       = user.id
        token.provider = account?.provider
        token.name     = user.name
        token.email    = user.email
        token.picture  = user.image
      }

      if (trigger === 'update' && session?.name) {
        token.name = session.name
      } else if (token.email) {
        try {
          await connectDB()
          const dbUser = (await Customer.findOne({ email: token.email.toLowerCase() }).lean()) as any
          if (dbUser) {
            if (dbUser.name) token.name = dbUser.name
            if (dbUser.image) token.picture = dbUser.image
          }
        } catch (e) {
          // ignore
        }
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id       = token.id
        ;(session.user as any).provider = token.provider
        session.user.name  = token.name as string
        session.user.email = token.email as string
        session.user.image = token.picture as string
      }
      return session
    },
  },
}
