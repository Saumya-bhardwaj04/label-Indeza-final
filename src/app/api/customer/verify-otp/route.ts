import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import OTP from '@/models/OTP'
import Customer from '@/models/Customer'

// In-memory rate limit: max 5 verify attempts per email per 15 minutes
const verifyRateMap = new Map<string, { count: number; resetAt: number }>()

function checkVerifyRateLimit(email: string): boolean {
  const now = Date.now()
  const entry = verifyRateMap.get(email)
  if (!entry || now > entry.resetAt) {
    verifyRateMap.set(email, { count: 1, resetAt: now + 15 * 60 * 1000 })
    return true
  }
  if (entry.count >= 5) return false
  entry.count++
  return true
}

export async function POST(req: Request) {
  try {
    await connectDB()
    const { email, code } = await req.json()

    if (!email || !code) {
      return NextResponse.json({ error: 'Email and code are required' }, { status: 400 })
    }

    const normalizedEmail = email.toLowerCase().trim()

    // Rate limit: max 5 verify attempts per email per 15 minutes
    if (!checkVerifyRateLimit(normalizedEmail)) {
      return NextResponse.json(
        { error: 'Too many attempts. Please wait 15 minutes or request a new code.' },
        { status: 429 }
      )
    }

    // Validate code format — must be exactly 6 digits
    if (!/^\d{6}$/.test(String(code))) {
      return NextResponse.json({ error: 'Invalid code format' }, { status: 400 })
    }

    const otp = await OTP.findOne({
      email: normalizedEmail,
      code: String(code),
      used: false,
      expiresAt: { $gt: new Date() },
    })

    if (!otp) {
      return NextResponse.json(
        { error: 'Invalid or expired code. Please try again.' },
        { status: 400 }
      )
    }

    // Mark OTP as used immediately to prevent replay attacks
    await OTP.findByIdAndUpdate(otp._id, { used: true })

    // Find or create customer — strict provider lock
    let customer = await Customer.findOne({ email: normalizedEmail })

    if (customer) {
      // BLOCK: This email was registered via Google — cannot use OTP
      if (customer.provider === 'google') {
        return NextResponse.json(
          {
            error:   'use_google',
            message: 'This account uses Google sign-in. Please use the "Continue with Google" button instead.',
          },
          { status: 403 }
        )
      }
      // Email customer — update emailVerified if not set
      if (!customer.emailVerified) {
        await Customer.findByIdAndUpdate(customer._id, { emailVerified: new Date() })
      }
    } else {
      // New customer — create with email provider
      customer = await Customer.create({
        name:          email.split('@')[0],
        email:         normalizedEmail,
        provider:      'email',
        emailVerified: new Date(),
      })

      // Trigger welcome email in background
      try {
        const { sendLoginWelcomeEmail } = require('@/lib/email')
        sendLoginWelcomeEmail(customer.email, customer.name).catch((err: any) => {
          console.error('Failed to send signup welcome email:', err)
        })
      } catch (e) {
        console.error('Error importing/calling sendLoginWelcomeEmail:', e)
      }
    }

    // Reset verify rate limit on success
    verifyRateMap.delete(normalizedEmail)

    return NextResponse.json({
      success: true,
      customer: {
        id:    customer._id.toString(),
        name:  customer.name,
        email: customer.email,
        image: customer.image,
      },
    })
  } catch (error) {
    console.error('OTP verify error:', error)
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
