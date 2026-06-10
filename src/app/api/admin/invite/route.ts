import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Admin from '@/models/Admin'
import AdminInvite from '@/models/AdminInvite'
import { sendAdminInviteEmail } from '@/lib/email'
import crypto from 'crypto'

export async function POST(req: Request) {
  try {
    await connectDB()
    const { email, name, secret } = await req.json()

    if (secret !== process.env.ADMIN_SETUP_SECRET) {
      return NextResponse.json({ error: 'Invalid setup secret' }, { status: 403 })
    }

    if (!email || !name) {
      return NextResponse.json({ error: 'Email and name are required' }, { status: 400 })
    }

    const existing = await Admin.findOne({ email: email.toLowerCase() })
    if (existing) {
      return NextResponse.json({ error: 'An admin with this email already exists' }, { status: 400 })
    }

    const token     = crypto.randomBytes(32).toString('hex')
    const expiresAt = new Date(Date.now() + 48 * 60 * 60 * 1000)

    await AdminInvite.deleteMany({ email: email.toLowerCase() })
    await AdminInvite.create({ email: email.toLowerCase(), token, expiresAt })

    await Admin.create({
      name,
      email:    email.toLowerCase(),
      password: 'PENDING_' + token.slice(0, 8),
      role:     'admin',
    })

    await sendAdminInviteEmail(name, email, token)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('Admin invite error:', error)
    return NextResponse.json({ error: error.message || 'Failed to send invite' }, { status: 500 })
  }
}
