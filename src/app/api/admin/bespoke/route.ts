import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminGuard'
import { connectDB } from '@/lib/mongodb'
import BespokeRequest from '@/models/BespokeRequest'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  await connectDB()
  const requests = await BespokeRequest.find({}).sort({ createdAt: -1 }).lean()
  return NextResponse.json(requests)
}
