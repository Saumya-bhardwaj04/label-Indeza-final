import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminGuard'
import { connectDB } from '@/lib/mongodb'
import Subscriber from '@/models/Subscriber'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  await connectDB()
  const subscribers = await Subscriber.find({}).sort({ subscribedAt: -1 }).lean()
  return NextResponse.json(subscribers)
}
