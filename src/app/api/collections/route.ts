import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Collection from '@/models/Collection'

export const dynamic = 'force-dynamic'

export async function GET() {
  await connectDB()
  const collections = await Collection.find({}).sort({ name: 1 }).lean()
  return NextResponse.json(collections)
}

export async function POST(req: Request) {
  const { requireAdmin } = await import('@/lib/adminGuard')
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const body = await req.json()
  const collection = await Collection.create(body)
  return NextResponse.json(collection, { status: 201 })
}
