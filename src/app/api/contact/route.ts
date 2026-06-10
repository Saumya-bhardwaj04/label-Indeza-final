import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import ContactMessage from '@/models/ContactMessage'
import { sendEmail, sendContactAutoReply } from '@/lib/email'

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    const { name, surname, email, phone, topic, message } = body

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Name, email and message are required' }, { status: 400 })
    }

    await ContactMessage.create({ name, surname, email, phone, topic, message })

    // Notify admin by email — non-blocking
    sendEmail({
      to: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      subject: `New message from ${name} — Label Indeza Contact Form`,
      html: `
        <div style="font-family:system-ui;max-width:500px;padding:24px;">
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${name} ${surname || ''}</p>
          <p><strong>Email:</strong> ${email}</p>
          ${phone ? `<p><strong>Phone:</strong> ${phone}</p>` : ''}
          ${topic ? `<p><strong>Topic:</strong> ${topic}</p>` : ''}
          <p><strong>Message:</strong></p>
          <p style="background:#F5F5F5;padding:16px;border-radius:8px;">${message}</p>
        </div>
      `,
    }).catch(err => console.error('Admin notification email error:', err))

    // Send auto-reply — non-blocking
    sendContactAutoReply(name, email).catch(err => console.error('Auto-reply email error:', err))

    return NextResponse.json({ success: true, message: 'Message sent! We will get back to you within 24 hours.' })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
