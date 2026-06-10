import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { customerAuthOptions } from '@/lib/customerAuth'
import { connectDB } from '@/lib/mongodb'
import { razorpay } from '@/lib/razorpay'
import Order from '@/models/Order'
import Coupon from '@/models/Coupon'
import Product from '@/models/Product'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(customerAuthOptions)
    if (!session?.user) {
      return NextResponse.json({ error: 'Please sign in to checkout' }, { status: 401 })
    }

    await connectDB()

    const { items, deliveryAddress, subtotal, deliveryCharge, total, notes, couponCode, couponDiscount } = await req.json()

    // Validate items exist
    if (!items || items.length === 0) {
      return NextResponse.json({ error: 'Cart is empty' }, { status: 400 })
    }

    // Check if any product is out of stock in database
    const productIds = items.map((item: any) => item.id).filter((id: string) => !id.startsWith('local-'))
    if (productIds.length > 0) {
      const dbProducts = await Product.find({ _id: { $in: productIds } }).lean()
      for (const item of items) {
        if (item.id.startsWith('local-')) continue
        const dbProd = dbProducts.find(p => String(p._id) === item.id)
        if (!dbProd || dbProd.inStock === false) {
          return NextResponse.json({ error: `Product "${item.name}" is out of stock` }, { status: 400 })
        }
      }
    }

    // Create Razorpay order (amount in paise — multiply by 100)
    const razorpayOrder = await razorpay.orders.create({
      amount:   Math.round(total * 100),
      currency: 'INR',
      receipt:  `li_${Date.now()}`,
      notes: {
        customerEmail: session.user.email || '',
        customerName:  session.user.name  || '',
      },
    })

    // Save pending order in MongoDB
    const order = await Order.create({
      customerId:      (session.user as any).id || session.user.email,
      customerEmail:   session.user.email,
      customerName:    session.user.name,
      items:           items.map((item: any) => ({
        productId: item.id,
        name:      item.name,
        image:     item.image,
        price:     item.price,
        quantity:  item.quantity,
      })),
      deliveryAddress,
      subtotal,
      deliveryCharge,
      total,
      couponCode,
      couponDiscount:  couponDiscount || 0,
      notes,
      status:          'pending',
      paymentStatus:   'pending',
      razorpayOrderId: razorpayOrder.id,
    })

    if (couponCode) {
      await Coupon.findOneAndUpdate(
        { code: couponCode.toUpperCase().trim() },
        { $inc: { usedCount: 1 } }
      )
    }

    return NextResponse.json({
      orderId:         order._id.toString(),
      razorpayOrderId: razorpayOrder.id,
      amount:          razorpayOrder.amount,
      currency:        razorpayOrder.currency,
    })
  } catch (error: any) {
    console.error('Create Razorpay order error:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to create order' },
      { status: 500 }
    )
  }
}
