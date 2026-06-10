'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, MapPin, CreditCard, User } from 'lucide-react'
import Link from 'next/link'
import Loader from '@/components/Loader'

const STATUS_OPTIONS = [
  { value: 'pending',    label: 'Pending'    },
  { value: 'confirmed',  label: 'Confirmed'  },
  { value: 'processing', label: 'Processing' },
  { value: 'shipped',    label: 'Shipped'    },
  { value: 'completed',  label: 'Delivered'  },
  { value: 'cancelled',  label: 'Cancelled'  },
]

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  pending:    { color: '#B45309', bg: '#FEF3C7' },
  confirmed:  { color: '#1D4ED8', bg: '#DBEAFE' },
  processing: { color: '#6D28D9', bg: '#EDE9FE' },
  shipped:    { color: '#0369A1', bg: '#E0F2FE' },
  completed:  { color: '#15803D', bg: '#DCFCE7' },
  cancelled:  { color: '#991B1B', bg: '#FEE2E2' },
}

export default function AdminOrderDetailPage() {
  const params  = useParams()
  const router  = useRouter()
  const [order,   setOrder]   = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving,  setSaving]  = useState(false)
  const [status,  setStatus]  = useState('')
  const [saved,   setSaved]   = useState(false)

  useEffect(() => {
    fetch(`/api/admin/orders/${params.id}`)
      .then(r => r.json())
      .then(data => {
        setOrder(data)
        setStatus(data.status)
        setLoading(false)
      })
      .catch(() => { setLoading(false); router.push('/admin/orders') })
  }, [params.id, router])

  const handleStatusUpdate = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/admin/orders/${params.id}`, {
        method:  'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ status }),
      })
      const data = await res.json()
      if (data.success) {
        setOrder((prev: any) => ({ ...prev, status }))
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      }
    } catch (e) {
      alert('Failed to update status')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !order) {
    return <Loader />
  }

  return (
    <div>
      {/* Back */}
      <Link href="/admin/orders" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#666', textDecoration: 'none', fontSize: '14px', marginBottom: '24px' }}>
        <ArrowLeft size={16} /> Back to Orders
      </Link>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '28px' }}>
        <div>
          <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '4px' }}>
            Order #{order._id.slice(-8).toUpperCase()}
          </h1>
          <p style={{ color: '#888', fontSize: '13px' }}>
            {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>
        {/* Status updater */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <select
            value={status}
            onChange={e => setStatus(e.target.value)}
            style={{
              border: '1px solid #E0E0E0', borderRadius: '10px',
              padding: '9px 14px', fontSize: '14px', outline: 'none',
              fontFamily: 'inherit', background: 'white', cursor: 'pointer',
            }}
          >
            {STATUS_OPTIONS.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <button
            onClick={handleStatusUpdate}
            disabled={saving || status === order.status}
            style={{
              padding: '9px 20px', borderRadius: '10px',
              background: saved ? '#15803D' : '#1A1A1A',
              color: 'white', border: 'none', fontSize: '14px',
              fontWeight: 500, cursor: saving ? 'not-allowed' : 'pointer',
              fontFamily: 'inherit', opacity: status === order.status ? 0.4 : 1,
              transition: 'background 0.2s',
            }}
          >
            {saving ? 'Saving...' : saved ? '✓ Saved' : 'Update Status'}
          </button>
        </div>
      </div>

      <div className="admin-order-details-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '20px' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Customer Info */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '20px 24px', border: '1px solid #E8E8E8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <User size={15} /><h3 style={{ fontSize: '14px', fontWeight: 600 }}>Customer</h3>
            </div>
            <p style={{ fontWeight: 500, marginBottom: '4px' }}>{order.customerName}</p>
            <p style={{ color: '#666', fontSize: '13px' }}>{order.customerEmail}</p>
          </div>

          {/* Order Items */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '20px 24px', border: '1px solid #E8E8E8' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, marginBottom: '20px' }}>
              Items ({order.items.length})
            </h3>
            {order.items.map((item: any, i: number) => (
              <div key={i} style={{ display: 'flex', gap: '14px', paddingBottom: '16px', marginBottom: '16px', borderBottom: i < order.items.length - 1 ? '1px solid #F5F5F5' : 'none' }}>
                <img src={item.image} style={{ width: 56, height: 72, objectFit: 'cover', borderRadius: '8px', flexShrink: 0 }} alt={item.name} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>{item.name}</p>
                  <p style={{ color: '#888', fontSize: '13px' }}>Qty: {item.quantity} · ₹{item.price} each</p>
                  {item.selectedSize && (
                    <div style={{ marginTop: '6px' }}>
                      {item.selectedSize === 'Custom Fit' ? (
                        <div style={{ background: '#FEF3C7', borderRadius: '8px', padding: '10px 12px', marginTop: '8px' }}>
                          <p style={{ fontSize: '12px', fontWeight: 600, color: '#92400E', marginBottom: '6px' }}>✂️ Custom Fit Order</p>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                            {item.measurements?.bust   && <p style={{ fontSize: '12px', color: '#78350F', margin: 0 }}>Bust: {item.measurements.bust}</p>}
                            {item.measurements?.waist  && <p style={{ fontSize: '12px', color: '#78350F', margin: 0 }}>Waist: {item.measurements.waist}</p>}
                            {item.measurements?.hip    && <p style={{ fontSize: '12px', color: '#78350F', margin: 0 }}>Hip: {item.measurements.hip}</p>}
                            {item.measurements?.height && <p style={{ fontSize: '12px', color: '#78350F', margin: 0 }}>Height: {item.measurements.height}</p>}
                            {item.measurements?.sleeve && <p style={{ fontSize: '12px', color: '#78350F', margin: 0 }}>Sleeve: {item.measurements.sleeve}</p>}
                          </div>
                          {item.measurements?.notes && (
                            <p style={{ fontSize: '12px', color: '#78350F', marginTop: '6px', fontStyle: 'italic' }}>
                              Note: {item.measurements.notes}
                            </p>
                          )}
                        </div>
                      ) : (
                        <p style={{ fontSize: '13px', color: '#666', background: '#F5F5F5', display: 'inline-block', padding: '3px 10px', borderRadius: '6px', margin: 0 }}>
                          Size: {item.selectedSize}
                        </p>
                      )}
                    </div>
                  )}
                </div>
                <p style={{ fontWeight: 600, fontSize: '14px', flexShrink: 0 }}>₹{item.price * item.quantity}</p>
              </div>
            ))}
            {/* Totals */}
            <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: '14px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', marginBottom: '6px' }}>
                <span>Subtotal</span><span>₹{order.subtotal}</span>
              </div>
              {order.couponDiscount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#15803D', marginBottom: '6px' }}>
                  <span>Coupon {order.couponCode ? `(${order.couponCode})` : ''}</span>
                  <span>−₹{order.couponDiscount}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: '#666', marginBottom: '10px' }}>
                <span>Delivery</span>
                <span>{order.deliveryCharge === 0 ? 'FREE' : `₹${order.deliveryCharge}`}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700, fontSize: '15px' }}>
                <span>Total</span><span>₹{order.total}</span>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          {order.notes && (
            <div style={{ background: '#FFFBEB', borderRadius: '14px', padding: '16px 20px', border: '1px solid #FDE68A' }}>
              <p style={{ fontSize: '13px', fontWeight: 600, marginBottom: '6px', color: '#92400E' }}>Customer Note</p>
              <p style={{ fontSize: '13px', color: '#78350F' }}>{order.notes}</p>
            </div>
          )}
        </div>

        {/* Right */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

          {/* Delivery Address */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '20px 24px', border: '1px solid #E8E8E8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <MapPin size={15} /><h3 style={{ fontSize: '14px', fontWeight: 600 }}>Delivery Address</h3>
            </div>
            <p style={{ fontWeight: 500, fontSize: '14px', marginBottom: '6px' }}>{order.deliveryAddress.fullName}</p>
            <p style={{ fontSize: '13px', color: '#555', lineHeight: 1.7 }}>
              {order.deliveryAddress.phone}<br />
              {order.deliveryAddress.addressLine1}<br />
              {order.deliveryAddress.addressLine2 && <>{order.deliveryAddress.addressLine2}<br /></>}
              {order.deliveryAddress.city}, {order.deliveryAddress.state}<br />
              {order.deliveryAddress.pincode} · {order.deliveryAddress.country}
            </p>
          </div>

          {/* Payment Info */}
          <div style={{ background: 'white', borderRadius: '14px', padding: '20px 24px', border: '1px solid #E8E8E8' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
              <CreditCard size={15} /><h3 style={{ fontSize: '14px', fontWeight: 600 }}>Payment</h3>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px' }}>
              <span style={{ color: '#666' }}>Status</span>
              <span style={{ fontWeight: 600, color: order.paymentStatus === 'paid' ? '#15803D' : '#B45309' }}>
                {order.paymentStatus === 'paid' ? '✓ Paid' : 'Pending'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', marginBottom: '10px' }}>
              <span style={{ color: '#666' }}>Method</span>
              <span>Razorpay</span>
            </div>
            {order.razorpayPaymentId && (
              <div style={{ marginTop: '10px', padding: '10px', background: '#F9F9F9', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Payment ID</p>
                <p style={{ fontSize: '12px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{order.razorpayPaymentId}</p>
              </div>
            )}
            {order.razorpayOrderId && (
              <div style={{ marginTop: '8px', padding: '10px', background: '#F9F9F9', borderRadius: '8px' }}>
                <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Razorpay Order ID</p>
                <p style={{ fontSize: '12px', fontFamily: 'monospace', wordBreak: 'break-all' }}>{order.razorpayOrderId}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
