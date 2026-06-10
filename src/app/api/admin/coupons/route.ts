import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminGuard'
import { connectDB } from '@/lib/mongodb'
import Coupon from '@/models/Coupon'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  await connectDB()
  const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean()
  return NextResponse.json(coupons)
}

export async function POST(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied
  await connectDB()
  const body = await req.json()
  body.code = body.code.toUpperCase().trim()
  const coupon = await Coupon.create(body)
  return NextResponse.json(coupon, { status: 201 })
}
