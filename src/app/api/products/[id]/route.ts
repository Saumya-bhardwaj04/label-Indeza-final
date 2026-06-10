import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Product from '@/models/Product'

export async function GET(
  _: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const { id } = await params
    const product = await Product.findById(id).lean()
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 })
  }
}

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
  const product = await Product.findByIdAndUpdate(id, body, { new: true })
  return NextResponse.json(product)
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
  await Product.findByIdAndDelete(id)
  return NextResponse.json({ success: true })
}
