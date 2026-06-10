import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminGuard'
import { connectDB } from '@/lib/mongodb'
import Coupon from '@/models/Coupon'

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied
  await connectDB()
  const { id } = await params
  const body   = await req.json()
  const coupon = await Coupon.findByIdAndUpdate(id, body, { new: true })
  return NextResponse.json(coupon)
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied
  await connectDB()
  const { id } = await params
  await Coupon.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
