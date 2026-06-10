import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { customerAuthOptions } from '@/lib/customerAuth'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/models/Customer'

async function updateProfile(req: Request) {
  try {
    const session = await getServerSession(customerAuthOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    const { name } = await req.json()
    await connectDB()
    const email = session.user.email
    const updated = await Customer.findOneAndUpdate(
      { email: email?.toLowerCase() },
      { name },
      { new: true }
    )
    return NextResponse.json({ success: true, user: updated })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
  }
}

export async function PATCH(req: Request) {
  return updateProfile(req)
}

export async function POST(req: Request) {
  return updateProfile(req)
}
