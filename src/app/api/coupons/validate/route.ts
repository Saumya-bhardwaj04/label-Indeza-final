import { NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Coupon from '@/models/Coupon'

export async function POST(req: Request) {
  try {
    await connectDB()
    const { code, orderTotal } = await req.json()

    if (!code) {
      return NextResponse.json({ error: 'Please enter a coupon code' }, { status: 400 })
    }

    const coupon = await Coupon.findOne({
      code:   code.toUpperCase().trim(),
      active: true,
    })

    if (!coupon) {
      return NextResponse.json({ error: 'Invalid coupon code' }, { status: 404 })
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      return NextResponse.json({ error: 'This coupon has expired' }, { status: 400 })
    }

    if (coupon.maxUses > 0 && coupon.usedCount >= coupon.maxUses) {
      return NextResponse.json({ error: 'This coupon has reached its usage limit' }, { status: 400 })
    }

    if (orderTotal < coupon.minOrderValue) {
      return NextResponse.json({
        error: `Minimum order of ₹${coupon.minOrderValue} required for this coupon`,
      }, { status: 400 })
    }

    let discountAmount = 0
    if (coupon.type === 'percent') {
      discountAmount = Math.round((orderTotal * coupon.value) / 100)
    } else {
      discountAmount = Math.min(coupon.value, orderTotal)
    }

    return NextResponse.json({
      valid:          true,
      code:           coupon.code,
      type:           coupon.type,
      value:          coupon.value,
      discountAmount,
      discountLabel:  coupon.type === 'percent' ? `${coupon.value}% off` : `₹${coupon.value} off`,
      finalTotal:     orderTotal - discountAmount,
      couponId:       coupon._id.toString(),
    })
  } catch (error) {
    console.error('Coupon validate error:', error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
