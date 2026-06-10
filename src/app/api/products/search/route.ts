import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(req: Request) {
  await connectDB()
  const q = new URL(req.url).searchParams.get('q') || ''
  if (!q.trim()) return NextResponse.json([])

  const products = await Product.find({
    $or: [
      { name: { $regex: q, $options: 'i' } },
      { description: { $regex: q, $options: 'i' } },
      { category: { $regex: q, $options: 'i' } },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(6)
    .lean()

  return NextResponse.json(
    products.map((p) => ({
      id: String(p._id),
      name: p.name,
      price: p.price,
      image: p.image,
      category: p.category,
    }))
  )
}
