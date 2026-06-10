import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { customerAuthOptions } from '@/lib/customerAuth'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/models/Customer'

export async function GET() {
  const session = await getServerSession(customerAuthOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const customer = await Customer.findOne({ email: (session.user.email || '').toLowerCase() })
  return NextResponse.json({ address: customer?.savedAddress || null })
}

export async function POST(req: Request) {
  const session = await getServerSession(customerAuthOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await connectDB()
  const { address } = await req.json()
  await Customer.findOneAndUpdate(
    { email: (session.user.email || '').toLowerCase() },
    { savedAddress: address },
    { new: true }
  )
  return NextResponse.json({ success: true })
}
