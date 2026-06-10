import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminGuard'
import { connectDB } from '@/lib/mongodb'
import ContactMessage from '@/models/ContactMessage'

export async function GET() {
  const denied = await requireAdmin()
  if (denied) return denied
  await connectDB()
  const messages = await ContactMessage.find({}).sort({ createdAt: -1 }).lean()
  return NextResponse.json(messages)
}
