import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { customerAuthOptions } from '@/lib/customerAuth'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'
import crypto from 'crypto'
import { sendOrderConfirmedEmail } from '@/lib/email'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(customerAuthOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const {
      orderId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
    } = await req.json()

    // Verify Razorpay signature (security check)
    const body      = razorpayOrderId + '|' + razorpayPaymentId
    const expected  = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
      .update(body)
      .digest('hex')

    if (expected !== razorpaySignature) {
      // Signature mismatch → mark order as failed
      await connectDB()
      await Order.findByIdAndUpdate(orderId, {
        paymentStatus: 'failed',
        status:        'cancelled',
      })
      return NextResponse.json({ error: 'Payment verification failed' }, { status: 400 })
    }

    // Signature valid → mark order as confirmed
    await connectDB()
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        paymentStatus:     'paid',
        status:            'confirmed',
        razorpayPaymentId,
        razorpaySignature,
      },
      { new: true }
    )

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Send confirmation email — non-blocking
    sendOrderConfirmedEmail(order).catch(err =>
      console.error('Failed to send confirmation email:', err)
    )

    return NextResponse.json({
      success: true,
      orderId: order._id.toString(),
      message: 'Payment confirmed! Your order is placed.',
    })
  } catch (error: any) {
    console.error('Payment verify error:', error)
    return NextResponse.json(
      { error: 'Payment verification error' },
      { status: 500 }
    )
  }
}
