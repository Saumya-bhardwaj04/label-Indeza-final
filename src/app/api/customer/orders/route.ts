import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { customerAuthOptions } from '@/lib/customerAuth'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET() {
  try {
    const session = await getServerSession(customerAuthOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    await connectDB()

    const orders = await Order.find({
      customerEmail: session.user.email?.toLowerCase(),
    })
    .sort({ createdAt: -1 })
    .lean()

    return NextResponse.json(orders)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
