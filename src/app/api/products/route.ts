import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(req: Request) {
  await connectDB()
  const { searchParams } = new URL(req.url)
  const filter: any = {}
  if (searchParams.get('category'))   filter.category   = searchParams.get('category')
  if (searchParams.get('gender'))     filter.gender     = searchParams.get('gender')
  if (searchParams.get('collection')) filter.collection = searchParams.get('collection')
  if (searchParams.get('featured'))   filter.featured   = true
  if (searchParams.get('q')) {
    const q = searchParams.get('q')
    filter.$or = [
      { name:        { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { category:    { $regex: q, $options: 'i' } },
    ]
  }
  const products = await Product.find(filter).sort({ createdAt: -1 }).lean()
  return NextResponse.json(
    products.map((p) => ({
      ...p,
      id: String(p._id),
    }))
  )
}

export async function POST(req: Request) {
  const { requireAdmin } = await import('@/lib/adminGuard')
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const body = await req.json()
  const product = await Product.create(body)
  return NextResponse.json(product, { status: 201 })
}
