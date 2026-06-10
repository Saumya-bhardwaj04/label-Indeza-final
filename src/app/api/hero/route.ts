import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import HeroMedia from '@/models/HeroMedia'

export async function GET(req: Request) {
  await connectDB()
  const all = new URL(req.url).searchParams.get('all')
  if (all === 'true') {
    const items = await HeroMedia.find({}).sort({ createdAt: -1 }).lean()
    return NextResponse.json(items)
  }
  const hero = await HeroMedia.findOne({ active: true }).sort({ createdAt: -1 })
  return NextResponse.json(hero)
}

export async function POST(req: Request) {
  const { requireAdmin } = await import('@/lib/adminGuard')
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const body = await req.json()
  await HeroMedia.updateMany({}, { active: false })
  const hero = await HeroMedia.create({ ...body, active: true })
  return NextResponse.json(hero, { status: 201 })
}

export async function PUT(req: Request) {
  const { requireAdmin } = await import('@/lib/adminGuard')
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    await connectDB()
    const { id } = await req.json()
    if (!id) {
      return NextResponse.json({ error: 'Media ID is required' }, { status: 400 })
    }
    await HeroMedia.updateMany({}, { active: false })
    const updated = await HeroMedia.findByIdAndUpdate(id, { active: true }, { new: true })
    return NextResponse.json(updated)
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
