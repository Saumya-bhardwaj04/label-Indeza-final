import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Admin from '@/models/Admin'
import AdminInvite from '@/models/AdminInvite'
import bcrypt from 'bcryptjs'

export async function POST(req: Request) {
  try {
    await connectDB()
    const { token, password } = await req.json()

    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
    }

    if (password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters' }, { status: 400 })
    }

    const invite = await AdminInvite.findOne({
      token,
      used:      false,
      expiresAt: { $gt: new Date() },
    })

    if (!invite) {
      return NextResponse.json(
        { error: 'This link is invalid or has expired. Please request a new invite.' },
        { status: 400 }
      )
    }

    const hashed = await bcrypt.hash(password, 12)

    await Admin.findOneAndUpdate(
      { email: invite.email },
      { password: hashed }
    )

    await AdminInvite.findByIdAndUpdate(invite._id, { used: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Set password error:', error)
    return NextResponse.json({ error: 'Failed to set password' }, { status: 500 })
  }
}
