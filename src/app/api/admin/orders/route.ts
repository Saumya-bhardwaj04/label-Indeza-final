import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/adminGuard'
import { connectDB } from '@/lib/mongodb'
import Order from '@/models/Order'

export async function GET(req: Request) {
  try {
    const denied = await requireAdmin()
    if (denied) return denied

    await connectDB()

    const { searchParams } = new URL(req.url)
    const status = searchParams.get('status')
    const page   = parseInt(searchParams.get('page') || '1')
    const limit  = 20

    const filter: any = {}
    if (status && status !== 'all') filter.status = status

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Order.countDocuments(filter),
    ])

    // Count per status for tab badges
    const counts = await Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ])

    const statusCounts: Record<string, number> = {}
    counts.forEach((c: any) => { statusCounts[c._id] = c.count })

    // Calculate daily, weekly and monthly profit (completed or paid orders)
    const now = new Date()
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate())
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000)

    const revenueStats = await Order.aggregate([
      { 
        $match: { 
          paymentStatus: 'paid' 
        } 
      },
      {
        $group: {
          _id: null,
          dailyProfit: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', startOfToday] }, '$total', 0]
            }
          },
          weeklyProfit: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', sevenDaysAgo] }, '$total', 0]
            }
          },
          monthlyProfit: {
            $sum: {
              $cond: [{ $gte: ['$createdAt', thirtyDaysAgo] }, '$total', 0]
            }
          }
        }
      }
    ])

    const stats = revenueStats[0] || { dailyProfit: 0, weeklyProfit: 0, monthlyProfit: 0 }

    return NextResponse.json({ orders, total, page, statusCounts, stats })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 })
  }
}
