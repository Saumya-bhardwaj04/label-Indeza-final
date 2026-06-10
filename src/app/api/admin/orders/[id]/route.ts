import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminGuard'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import { sendOrderShippedEmail, sendOrderDeliveredEmail } from '@/lib/email'

export async function GET(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const denied = await requireAdmin()
  if (denied) return denied

  await connectDB()
  const { id } = await params
  const order = await Order.findById(id).lean()
  if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
  return NextResponse.json(order)
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    await connectDB()
    const { status } = await req.json()

    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'completed', 'cancelled']
    if (!validStatuses.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const { id } = await params
    const order = await Order.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    )

    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })

    // Trigger emails based on new status — non-blocking
    if (status === 'shipped') {
      sendOrderShippedEmail(order).catch(err =>
        console.error('Shipping email error:', err)
      )
    }
    if (status === 'completed') {
      sendOrderDeliveredEmail(order).catch(err =>
        console.error('Delivery email error:', err)
      )
    }

    return NextResponse.json({ success: true, order })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update order' }, { status: 500 })
  }
}

