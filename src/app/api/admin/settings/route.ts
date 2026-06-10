// src/app/api/admin/settings/route.ts
import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminGuard'
import { connectDB } from '@/lib/mongodb'
import SiteSetting from '@/models/SiteSettings'

// GET all settings with labels — for admin UI
export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const settings = await SiteSetting.find({}).lean()
  return NextResponse.json(settings)
}

// PATCH — admin updates settings
export async function PATCH(req: Request) {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const updates = await req.json()

  for (const [key, value] of Object.entries(updates)) {
    await SiteSetting.findOneAndUpdate(
      { key },
      { value: value as string },
      { upsert: false }
    )
  }

  return NextResponse.json({ success: true })
}
