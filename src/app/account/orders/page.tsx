'use client'
import { useState, useEffect, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Package, ChevronRight, CheckCircle, X } from 'lucide-react'
import Link from 'next/link'
import Loader from '@/components/Loader'

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  pending:    { label: 'Pending',    color: '#B45309', bg: '#FEF3C7' },
  confirmed:  { label: 'Confirmed',  color: '#1D4ED8', bg: '#DBEAFE' },
  processing: { label: 'Processing', color: '#6D28D9', bg: '#EDE9FE' },
  shipped:    { label: 'Shipped',    color: '#0369A1', bg: '#E0F2FE' },
  completed:  { label: 'Delivered',  color: '#15803D', bg: '#DCFCE7' },
  cancelled:  { label: 'Cancelled',  color: '#991B1B', bg: '#FEE2E2' },
}

function OrdersPageContent() {
  const { data: session, status } = useSession()
  const router      = useRouter()
  const params      = useSearchParams()
  const showSuccess = params.get('success') === 'true'

  const [orders,  setOrders]  = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [banner,  setBanner]  = useState(showSuccess)

  const [isMobile, setIsMobile] = useState(false)
  const [visibleCount, setVisibleCount] = useState(6)

  useEffect(() => {
    setIsMobile(window.innerWidth <= 640)
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 640)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/account?redirect=/account/orders')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    fetch('/api/customer/orders')
      .then(r => r.json())
      .then(data => { setOrders(data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [status])

  // Auto-dismiss success banner + clean URL
  useEffect(() => {
    if (!showSuccess) return
    const t = setTimeout(() => {
      setBanner(false)
      router.replace('/account/orders')
    }, 5000)
    return () => clearTimeout(t)
  }, [showSuccess, router])

  if (status === 'loading' || loading) {
    return <Loader />
  }

  const displayedOrders = isMobile ? orders.slice(0, visibleCount) : orders

  return (
    <div>
      {/* Success Banner */}
      {banner && (
        <div style={{
          background: '#DCFCE7', border: '1px solid #BBF7D0', borderRadius: '12px',
          padding: '16px 20px', marginBottom: '28px',
          display: 'flex', alignItems: 'center', gap: '12px',
        }}>
          <CheckCircle size={20} color="#15803D" />
          <p style={{ flex: 1, color: '#15803D', fontWeight: 500, fontSize: '14px' }}>
            🎉 Order placed successfully! You&apos;ll receive a confirmation email shortly.
          </p>
          <button onClick={() => setBanner(false)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
            <X size={16} color="#15803D" />
          </button>
        </div>
      )}

      <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '28px' }}>Orders</h1>

      {/* Empty state */}
      {orders.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '16px', padding: '60px 24px', textAlign: 'center', border: '1px solid #E8E8E8' }}>
          <Package size={40} color="#ccc" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>No orders yet</p>
          <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
            Go to store to place an order.
          </p>
          <Link href="/" style={{
            background: '#1A1A1A', color: 'white', padding: '12px 28px',
            borderRadius: '999px', textDecoration: 'none', fontSize: '14px', fontWeight: 500,
          }}>
            Shop Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {displayedOrders.map((order: any) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
            return (
              <Link
                key={order._id}
                href={`/account/orders/${order._id}`}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div
                  className="account-order-row"
                  style={{
                    background: 'white', borderRadius: '16px', padding: '20px 24px',
                    border: '1px solid #E8E8E8',
                    display: 'flex', alignItems: 'center', gap: '16px',
                    transition: 'box-shadow 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.06)')}
                  onMouseLeave={e => (e.currentTarget.style.boxShadow = 'none')}
                >
                  {/* Product thumbnails */}
                  <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
                    {order.items.slice(0, 3).map((item: any, i: number) => (
                      <img key={i} src={item.image}
                        style={{ width: 56, height: 72, objectFit: 'cover', borderRadius: '8px' }}
                        alt={item.name} />
                    ))}
                    {order.items.length > 3 && (
                      <div style={{ width: 56, height: 72, borderRadius: '8px', background: '#F5F3F0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '13px', color: '#666' }}>
                        +{order.items.length - 3}
                      </div>
                    )}
                  </div>

                  {/* Order info */}
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
                      <span style={{ fontSize: '13px', color: '#888' }}>
                        Order #{order._id.slice(-8).toUpperCase()}
                      </span>
                      <span style={{
                        fontSize: '12px', fontWeight: 500, padding: '3px 10px',
                        borderRadius: '999px', background: cfg.bg, color: cfg.color,
                      }}>
                        {cfg.label}
                      </span>
                    </div>
                    <p style={{ fontSize: '14px', fontWeight: 500, marginBottom: '4px' }}>
                      {order.items.map((i: any) => i.name).join(', ').slice(0, 60)}
                      {order.items.map((i: any) => i.name).join(', ').length > 60 ? '...' : ''}
                    </p>
                    <p style={{ fontSize: '13px', color: '#888' }}>
                      {order.items.length} item{order.items.length > 1 ? 's' : ''} ·{' '}
                      ₹{order.total} · {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </p>
                  </div>

                  <ChevronRight size={18} color="#ccc" />
                </div>
              </Link>
            )
          })}

          {isMobile && orders.length > visibleCount && (
            <button
              onClick={() => setVisibleCount(prev => prev + 6)}
              style={{
                background: 'white',
                border: '1px solid #E0E0E0',
                borderRadius: '999px',
                padding: '12px 24px',
                fontSize: '13px',
                fontWeight: 600,
                color: '#1A1A1A',
                cursor: 'pointer',
                margin: '24px auto 0',
                display: 'block',
                transition: 'all 0.2s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)',
                fontFamily: 'inherit',
              }}
              onMouseEnter={e => e.currentTarget.style.background = '#F9F7F4'}
              onMouseLeave={e => e.currentTarget.style.background = 'white'}
            >
              Load More
            </button>
          )}
        </div>
      )}
    </div>
  )
}

export default function OrdersPage() {
  return (
    <Suspense fallback={<Loader />}>
      <OrdersPageContent />
    </Suspense>
  )
}
