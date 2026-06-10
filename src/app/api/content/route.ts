import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import SiteContent from '@/models/SiteContent'

export const dynamic = 'force-dynamic'

export async function GET() {
  await connectDB()
  const content = await SiteContent.find({}).lean()
  const result = content.reduce((acc: any, item) => {
    acc[item.key] = item.value
    return acc
  }, {})
  return NextResponse.json(result)
}

export async function PATCH(req: Request) {
  const { requireAdmin } = await import('@/lib/adminGuard')
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const updates = await req.json()
  for (const [key, value] of Object.entries(updates)) {
    await SiteContent.findOneAndUpdate(
      { key },
      { value: value as string },
      { upsert: true, new: true }
    )
  }
  return NextResponse.json({ success: true })
}
