import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Collection from '@/models/Collection'

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { requireAdmin } = await import('@/lib/adminGuard')
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const { id } = await params
  const body = await req.json()
  const collection = await Collection.findByIdAndUpdate(id, body, { new: true })
  return NextResponse.json(collection)
}

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { requireAdmin } = await import('@/lib/adminGuard')
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const { id } = await params
  await Collection.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
