import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'
import { sendSubscribeWelcomeEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    await connectDB()
    const { email, source = 'footer' } = await req.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 })
    }

    const existing = await Subscriber.findOne({ email: email.toLowerCase() })
    if (existing) {
      if (source.startsWith('Waitlist') && !existing.source.includes(source)) {
        existing.source = existing.source + ' | ' + source
        await existing.save()
        return NextResponse.json({ success: true, message: 'Added to waitlist!' })
      }
      return NextResponse.json({ success: true, message: 'You are already subscribed!' })
    }

    await Subscriber.create({ email: email.toLowerCase(), source })

    // Send welcome email with 20% off code — non-blocking
    sendSubscribeWelcomeEmail(email).catch(err => console.error('Subscribe welcome email error:', err))

    return NextResponse.json({
      success: true,
      message: 'Subscribed! Check your inbox for your 20% off code.',
    })
  } catch (error: any) {
    console.error('Subscribe error:', error)
    return NextResponse.json({ error: 'Something went wrong. Please try again.' }, { status: 500 })
  }
}
