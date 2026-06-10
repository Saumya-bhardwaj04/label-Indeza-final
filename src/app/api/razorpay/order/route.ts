import { NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(req: Request) {
  const keyId = process.env.RAZORPAY_KEY_ID
  const keySecret = process.env.RAZORPAY_KEY_SECRET

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: 'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env.local' },
      { status: 500 }
    )
  }

  const { amount, items } = await req.json()
  const amountPaise = Math.round(Number(amount) * 100)

  if (!amountPaise || amountPaise < 100) {
    return NextResponse.json({ error: 'Invalid amount' }, { status: 400 })
  }

  const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })

  const order = await razorpay.orders.create({
    amount: amountPaise,
    currency: 'INR',
    receipt: `li_${Date.now()}`,
    notes: {
      items: JSON.stringify(items?.slice(0, 5) || []),
    },
  })

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId,
  })
}
