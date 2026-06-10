import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import BespokeRequest from '@/models/BespokeRequest'
import { sendEmail, sendBespokeAutoReply } from '@/lib/email'

export async function POST(req: Request) {
  try {
    await connectDB()
    const body = await req.json()
    const { name, email, phone, occasion, garmentType, budgetRange, timeline } = body

    if (!name || !email || !phone || !occasion || !garmentType || !budgetRange || !timeline) {
      return NextResponse.json({ error: 'Please fill all required fields' }, { status: 400 })
    }

    const request = await BespokeRequest.create(body)

    // Notify admin — non-blocking
    sendEmail({
      to: process.env.EMAIL_FROM || 'onboarding@resend.dev',
      subject: `New Bespoke Request from ${name} — Label Indeza`,
      html: `
        <div style="font-family:system-ui;max-width:500px;padding:24px;">
          <h2>New Bespoke/Custom Order Request</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone}</p>
          <p><strong>Occasion:</strong> ${occasion}</p>
          <p><strong>Garment:</strong> ${garmentType}</p>
          <p><strong>Budget:</strong> ${budgetRange}</p>
          <p><strong>Timeline:</strong> ${timeline}</p>
          ${body.colors ? `<p><strong>Colors:</strong> ${body.colors}</p>` : ''}
          ${body.fabric ? `<p><strong>Fabric:</strong> ${body.fabric}</p>` : ''}
          ${body.embroidery ? `<p><strong>Embroidery:</strong> ${body.embroidery}</p>` : ''}
          ${body.additionalNotes ? `<p><strong>Notes:</strong> ${body.additionalNotes}</p>` : ''}
        </div>
      `,
    }).catch(err => console.error('Bespoke admin email error:', err))

    // Auto-reply — non-blocking
    sendBespokeAutoReply(name, email, request._id.toString()).catch(err => console.error('Bespoke auto-reply email error:', err))

    return NextResponse.json({ success: true, requestId: request._id })
  } catch (error) {
    console.error('Bespoke request error:', error)
    return NextResponse.json({ error: 'Failed to submit request' }, { status: 500 })
  }
}
