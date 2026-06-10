'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useParams } from 'next/navigation'
import { ArrowLeft, MapPin } from 'lucide-react'
import Link from 'next/link'
import Loader from '@/components/Loader'

const STATUS_STEPS = ['confirmed', 'processing', 'shipped', 'completed']

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: 'Pending',    color: '#B45309', bg: '#FEF3C7' },
  confirmed:  { label: 'Confirmed',  color: '#1D4ED8', bg: '#DBEAFE' },
  processing: { label: 'Processing', color: '#6D28D9', bg: '#EDE9FE' },
  shipped:    { label: 'Shipped',    color: '#0369A1', bg: '#E0F2FE' },
  completed:  { label: 'Delivered',  color: '#15803D', bg: '#DCFCE7' },
  cancelled:  { label: 'Cancelled',  color: '#991B1B', bg: '#FEE2E2' },
}

export default function OrderDetailPage() {
  const { data: session, status } = useSession()
  const router  = useRouter()
  const params  = useParams()
  const [order, setOrder]   = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/account')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch(`/api/customer/orders/${params.id}`)
      .then(r => r.json())
      .then(data => { setOrder(data); setLoading(false) })
      .catch(() => { setLoading(false); router.push('/account/orders') })
  }, [status, params.id, router])

  if (loading || !order) {
    return <Loader />
  }

  const cfg         = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
  const stepIndex   = STATUS_STEPS.indexOf(order.status)
  const isCancelled = order.status === 'cancelled'

  return (
    <div>
      {/* Back */}
      <Link href="/account/orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', textDecoration: 'none', fontSize: '14px', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '4px' }}>
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p style={{ color: '#888', fontSize: '13px' }}>
            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
        <span style={{ fontSize: '13px', fontWeight: 600, padding: '6px 14px', borderRadius: '999px', background: cfg.bg, color: cfg.color }}>
          {cfg.label}
        </span>
      </div>

      {/* Progress tracker (only if not cancelled) */}
      {!isCancelled && (
        <div className="account-order-progress-card" style={{ background: 'white', borderRadius: '16px', padding: '28px 32px', marginBottom: '20px', border: '1px solid #E8E8E8' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '24px' }}>Order Progress</h3>
          <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
            {/* Progress line */}
            <div style={{ position: 'absolute', top: '16px', left: '16px', right: '16px', height: '2px', background: '#E8E8E8', zIndex: 0 }} />
            <div style={{
              position: 'absolute', top: '16px', left: '16px',
              height: '2px', background: '#1A1A1A', zIndex: 1,
              width: stepIndex < 0 ? '0%' : `${(stepIndex / (STATUS_STEPS.length - 1)) * 100}%`,
              transition: 'width 0.5s ease',
            }} />
            {STATUS_STEPS.map((step, i) => {
              const done   = i <= stepIndex
              const active = i === stepIndex
              return (
                <div key={step} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', position: 'relative', zIndex: 2 }}>
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    background: done ? '#1A1A1A' : 'white',
                    border: done ? '2px solid #1A1A1A' : '2px solid #E0E0E0',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: '8px', transition: 'all 0.3s',
                  }}>
                    {done && <span style={{ color: 'white', fontSize: '14px' }}>✓</span>}
                  </div>
                  <span style={{ fontSize: '11px', fontWeight: active ? 600 : 400, color: done ? '#1A1A1A' : '#999', textAlign: 'center', textTransform: 'capitalize' }}>
                    {STATUS_CONFIG[step]?.label || step}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      <div className="account-order-details-grid" style={{ gap: '20px' }}>
        {/* Items */}
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #E8E8E8' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px' }}>
            {order.items.length} Item{order.items.length > 1 ? 's' : ''}
          </h3>
          {order.items.map((item: any, i: number) => (
            <div key={i} style={{ display: 'flex', gap: '16px', paddingBottom: '20px', marginBottom: '20px', borderBottom: i < order.items.length - 1 ? '1px solid #F5F5F5' : 'none' }}>
              <img src={item.image} style={{ width: 72, height: 90, objectFit: 'cover', borderRadius: '10px', flexShrink: 0 }} alt={item.name} />
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 500, marginBottom: '4px' }}>{item.name}</p>
                <p style={{ color: '#888', fontSize: '13px' }}>Qty: {item.quantity}</p>
                <p style={{ fontWeight: 600, marginTop: '8px' }}>₹{(item.price * item.quantity).toFixed(0)}</p>
              </div>
            </div>
          ))}

          {/* Totals */}
          <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', marginBottom: '8px' }}>
              <span>Subtotal</span><span>₹{order.subtotal}</span>
            </div>
            {order.couponDiscount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#15803D', marginBottom: '8px' }}>
                <span>Coupon Discount {order.couponCode ? `(${order.couponCode})` : ''}</span>
                <span>−₹{order.couponDiscount}</span>
              </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', marginBottom: '12px' }}>
              <span>Delivery</span>
              <span style={{ color: order.deliveryCharge === 0 ? '#22C55E' : '#666' }}>
                {order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '15px' }}>
              <span>Total</span><span>₹{order.total}</span>
            </div>
          </div>
        </div>

        {/* Right — Delivery Address + Payment */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #E8E8E8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <MapPin size={16} /><h3 style={{ fontSize: '14px', fontWeight: 600 }}>Delivery Address</h3>
            </div>
            <p style={{ fontWeight: 500, marginBottom: '4px' }}>{order.deliveryAddress.fullName}</p>
            <p style={{ color: '#666', fontSize: '13px', lineHeight: 1.7 }}>
              {order.deliveryAddress.phone}<br />
              {order.deliveryAddress.addressLine1}<br />
              {order.deliveryAddress.addressLine2 && <>{order.deliveryAddress.addressLine2}<br /></>}
              {order.deliveryAddress.city}, {order.deliveryAddress.state} — {order.deliveryAddress.pincode}
            </p>
          </div>

          <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #E8E8E8' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '16px' }}>Payment</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', marginBottom: '8px' }}>
              <span>Status</span>
              <span style={{ color: order.paymentStatus === 'paid' ? '#15803D' : '#B45309', fontWeight: 600 }}>
                {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
              </span>
            </div>
            {order.razorpayPaymentId && (
              <div style={{ fontSize: '12px', color: '#999' }}>
                ID: {order.razorpayPaymentId}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
