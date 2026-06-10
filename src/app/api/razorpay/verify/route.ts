import { NextResponse } from 'next/server'
import crypto from 'crypto'

export async function POST(req: Request) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET
  if (!keySecret) {
    return NextResponse.json({ error: 'Razorpay not configured' }, { status: 500 })
  }

  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
  } = await req.json()

  const body = `${razorpay_order_id}|${razorpay_payment_id}`
  const expected = crypto.createHmac('sha256', keySecret).update(body).digest('hex')

  if (expected !== razorpay_signature) {
    return NextResponse.json({ error: 'Invalid payment signature' }, { status: 400 })
  }

  return NextResponse.json({
    success: true,
    orderId: razorpay_order_id,
    paymentId: razorpay_payment_id,
  })
}
