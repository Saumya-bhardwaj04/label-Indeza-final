import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminGuard'
import { connectDB } from '@/lib/mongodb'
import Customer from '@/models/Customer'

export async function GET(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()

  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') || ''

  const filter = q
    ? {
        $or: [
          { name:  { $regex: q, $options: 'i' } },
          { email: { $regex: q, $options: 'i' } },
        ],
      }
    : {}

  const customers = await Customer.find(filter)
    .sort({ createdAt: -1 })
    .select('name email provider googleId createdAt emailVerified')
    .lean()

  return NextResponse.json(customers)
}
