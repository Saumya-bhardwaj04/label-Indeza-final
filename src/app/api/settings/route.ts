// src/app/api/settings/route.ts
import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import SiteSetting from '@/models/SiteSettings'

// GET all settings — or filter by group (public, storefront needs this)
export async function GET(req: Request) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const group = searchParams.get('group')

  const filter = group ? { group } : {}
  const settings = await SiteSetting.find(filter).lean()

  // Return as key-value object for easy consumption
  const result = settings.reduce((acc: any, s) => {
    acc[s.key] = s.value
    return acc
  }, {})

  return NextResponse.json(result)
}

// PATCH — admin-only: update multiple settings at once
export async function PATCH(req: Request) {
  const { requireAdmin } = await import('@/lib/adminGuard')
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const updates = await req.json()  // { key: value, key: value, ... }

  for (const [key, value] of Object.entries(updates)) {
    await SiteSetting.findOneAndUpdate(
      { key },
      { value: value as string },
      { upsert: false }  // only update existing — don't create new ones via API
    )
  }

  return NextResponse.json({ success: true })
}
