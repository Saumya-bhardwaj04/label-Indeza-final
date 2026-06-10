import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import HeroMedia from '@/models/HeroMedia'

export async function DELETE(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { requireAdmin } = await import('@/lib/adminGuard')
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const { id } = await params
  const deleted = await HeroMedia.findByIdAndDelete(id)
  if (!deleted) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
  return NextResponse.json({ success: true })
}
