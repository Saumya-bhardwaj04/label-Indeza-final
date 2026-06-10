import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import OTP from '@/models/OTP'
import Customer from '@/models/Customer'
import { sendOTPEmail } from '@/lib/email'

function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString()
}

// Simple in-memory rate limit: max 3 OTP sends per email per 10 minutes
const otpRateMap = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(email: string): boolean {
  const now = Date.now()
  const entry = otpRateMap.get(email)
  if (!entry || now > entry.resetAt) {
    otpRateMap.set(email, { count: 1, resetAt: now + 10 * 60 * 1000 })
    return true // allowed
  }
  if (entry.count >= 3) return false // blocked
  entry.count++
  return true // allowed
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const { email } = await req.json()

    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Rate limit: max 3 OTP requests per 10 minutes per email
    if (!checkRateLimit(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Too many OTP requests. Please wait 10 minutes before trying again.' },
        { status: 429 }
      )
    }

    // Block OTP if email is already registered via Google OAuth
    const existingCustomer = await Customer.findOne({ email: normalizedEmail })
    if (existingCustomer && existingCustomer.provider === 'google') {
      return NextResponse.json(
        { error: 'This email is already registered using Google Sign-In. Please sign in using Google.' },
        { status: 400 }
      )
    }

    const code = generateOTP()
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

    // Delete any existing OTPs for this email
    await OTP.deleteMany({ email: normalizedEmail })

    // Save new OTP
    await OTP.create({ email: normalizedEmail, code, expiresAt, used: false })

    // Send email
    try {
      await sendOTPEmail(email, code)
    } catch (mailError) {
      // In development: log to server console only — never expose OTP in API response
      if (process.env.NODE_ENV === 'development') {
        console.log(`\n==================================================\n[DEVELOPMENT] OTP CODE FOR ${email}: ${code}\n==================================================\n`)
        return NextResponse.json({ success: true, message: 'OTP generated (check server console in dev mode)' })
      }
      throw mailError
    }

    return NextResponse.json({ success: true, message: 'OTP sent' })
  } catch (error) {
    console.error('OTP send error:', error)
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
