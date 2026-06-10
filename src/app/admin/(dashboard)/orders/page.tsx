'use client'
import { useState, useEffect, useCallback, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ChevronRight, RefreshCw, Package, ChevronDown } from 'lucide-react'
import Loader from '@/components/Loader'

const STATUS_TABS = [
  { key: 'all',        label: 'All'        },
  { key: 'pending',    label: 'Pending'    },
  { key: 'confirmed',  label: 'Confirmed'  },
  { key: 'processing', label: 'Processing' },
  { key: 'shipped',    label: 'Shipped'    },
  { key: 'completed',  label: 'Delivered'  },
  { key: 'cancelled',  label: 'Cancelled'  },
]

const STATUS_CONFIG: Record<string, { color: string; bg: string }> = {
  pending:    { color: '#B45309', bg: '#FEF3C7' },
  confirmed:  { color: '#1D4ED8', bg: '#DBEAFE' },
  processing: { color: '#6D28D9', bg: '#EDE9FE' },
  shipped:    { color: '#0369A1', bg: '#E0F2FE' },
  completed:  { color: '#15803D', bg: '#DCFCE7' },
  cancelled:  { color: '#991B1B', bg: '#FEE2E2' },
}

function AdminOrdersContent() {
  const params     = useSearchParams()
  const router     = useRouter()
  const activeTab  = params.get('status') || 'all'

  const [orders,       setOrders]       = useState<any[]>([])
  const [statusCounts, setStatusCounts] = useState<Record<string, number>>({})
  const [stats,        setStats]        = useState({ dailyProfit: 0, weeklyProfit: 0, monthlyProfit: 0 })
  const [timeframe,    setTimeframe]    = useState<'daily' | 'weekly' | 'monthly'>('daily')
  const [showProfitMenu, setShowProfitMenu] = useState(false)
  const [loading,      setLoading]      = useState(true)
  const [refreshing,   setRefreshing]   = useState(false)

  const fetchOrders = useCallback(async (showRefresh = false) => {
    if (showRefresh) setRefreshing(true)
    else setLoading(true)

    try {
      const url = `/api/admin/orders${activeTab !== 'all' ? `?status=${activeTab}` : ''}`
      const res  = await fetch(url)
      const data = await res.json()
      setOrders(data.orders || [])
      setStatusCounts(data.statusCounts || {})
      if (data.stats) setStats(data.stats)
    } catch (e) {
      console.error('Failed to fetch orders')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }, [activeTab])

  useEffect(() => { fetchOrders() }, [fetchOrders])

  const setTab = (key: string) => {
    router.push(key === 'all' ? '/admin/orders' : `/admin/orders?status=${key}`)
  }

  const totalCount = Object.values(statusCounts).reduce((a, b) => a + b, 0)
  
  const currentProfit = timeframe === 'daily' ? stats.dailyProfit : timeframe === 'weekly' ? stats.weeklyProfit : stats.monthlyProfit;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600, marginTop: '0px' }}>Orders</h1>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '12px' }}>
          <button
            onClick={() => fetchOrders(true)}
            disabled={refreshing}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', borderRadius: '8px',
              border: '1px solid #E0E0E0', background: 'white',
              fontSize: '13px', cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            <RefreshCw size={14} style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }} />
            Refresh
          </button>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#555', background: '#F9F9F9', padding: '6px 12px', borderRadius: '8px', border: '1px solid #EAEAEA' }}>
            <span style={{ color: '#888' }}>Profit:</span>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <button
                type="button"
                onClick={() => setShowProfitMenu(!showProfitMenu)}
                style={{
                  fontSize: '12px',
                  padding: '5px 10px',
                  border: '1px solid #E0E0E0',
                  borderRadius: '8px',
                  background: 'white',
                  outline: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  fontFamily: 'inherit',
                  minWidth: '110px',
                  justifyContent: 'space-between',
                }}
              >
                <span>{timeframe === 'daily' ? 'Today' : timeframe === 'weekly' ? 'Last 7 Days' : 'Last 30 Days'}</span>
                <ChevronDown size={12} style={{ opacity: 0.6 }} />
              </button>
              {showProfitMenu && (
                <>
                  <div 
                    onClick={() => setShowProfitMenu(false)} 
                    style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} 
                  />
                  <div
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '4px',
                      background: 'white',
                      border: '1px solid rgba(0,0,0,0.1)',
                      borderRadius: '8px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      zIndex: 999,
                      minWidth: '120px',
                      padding: '4px 0',
                    }}
                  >
                    {[
                      { key: 'daily', label: 'Today' },
                      { key: 'weekly', label: 'Last 7 Days' },
                      { key: 'monthly', label: 'Last 30 Days' },
                    ].map(opt => (
                      <div
                        key={opt.key}
                        onClick={() => {
                          setTimeframe(opt.key as any)
                          setShowProfitMenu(false)
                        }}
                        style={{
                          padding: '8px 12px',
                          fontSize: '12px',
                          cursor: 'pointer',
                          background: timeframe === opt.key ? '#F5F0EB' : 'transparent',
                          color: timeframe === opt.key ? '#1A1A1A' : '#555',
                          fontWeight: timeframe === opt.key ? 600 : 500,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {opt.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            <strong style={{ color: '#15803D', marginLeft: '4px' }}>₹{currentProfit.toLocaleString()}</strong>
          </div>
        </div>
      </div>

      {/* Status Tabs with counts */}
      <div className="admin-status-tabs" style={{ marginBottom: '20px' }}>
        {STATUS_TABS.map(tab => {
          const count  = tab.key === 'all' ? totalCount : (statusCounts[tab.key] || 0)
          const active = activeTab === tab.key
          return (
            <button
              key={tab.key}
              onClick={() => setTab(tab.key)}
              style={{
                padding: '7px 14px', borderRadius: '8px',
                background: active ? '#1A1A1A' : 'white',
                color:      active ? 'white'   : '#555',
                fontSize: '13px', fontWeight: active ? 600 : 400,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: '6px',
                border: active ? '1px solid #1A1A1A' : '1px solid #E8E8E8',
              }}
            >
              {tab.label}
              {count > 0 && (
                <span style={{
                  background: active ? 'rgba(255,255,255,0.25)' : '#F0F0F0',
                  color:      active ? 'white' : '#666',
                  borderRadius: '999px', padding: '1px 7px', fontSize: '11px', fontWeight: 600,
                }}>
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Orders list */}
      {loading ? (
        <Loader />
      ) : orders.length === 0 ? (
        <div style={{ background: 'white', borderRadius: '16px', padding: '60px', textAlign: 'center', border: '1px solid #E8E8E8' }}>
          <Package size={40} color="#ccc" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontWeight: 600, marginBottom: '8px' }}>No orders found</p>
          <p style={{ color: '#888', fontSize: '14px' }}>
            {activeTab === 'all' ? 'No orders placed yet.' : `No ${activeTab} orders.`}
          </p>
        </div>
      ) : (
        <div className="admin-orders-card-list" style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
          {orders.map((order: any, i: number) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending
            return (
              <div
                key={order._id}
                onClick={() => router.push(`/admin/orders/${order._id}`)}
                className="admin-order-row"
                style={{
                  display: 'flex', alignItems: 'center', gap: '16px',
                  padding: '16px 24px', cursor: 'pointer',
                  borderBottom: i < orders.length - 1 ? '1px solid #F5F5F5' : 'none',
                  transition: 'background 0.15s',
                }}
                onMouseEnter={e => (e.currentTarget.style.background = '#FAFAFA')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {/* Item thumbnails */}
                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                  {order.items.slice(0, 2).map((item: any, j: number) => (
                    <img key={j} src={item.image}
                      style={{ width: 44, height: 56, objectFit: 'cover', borderRadius: '6px' }}
                      alt={item.name} />
                  ))}
                </div>

                {/* Order info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                    <span style={{ fontSize: '13px', fontWeight: 600 }}>
                      #{order._id.slice(-8).toUpperCase()}
                    </span>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, padding: '2px 8px',
                      borderRadius: '999px', background: cfg.bg, color: cfg.color,
                    }}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </div>
                  <p style={{ fontSize: '13px', color: '#444', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {order.customerName} · {order.customerEmail}
                  </p>
                  <p style={{ fontSize: '12px', color: '#888' }}>
                    {order.items.length} item{order.items.length > 1 ? 's' : ''} ·{' '}
                    {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* Amount */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <p style={{ fontWeight: 700, fontSize: '15px' }}>₹{order.total}</p>
                  <p style={{ fontSize: '11px', color: order.paymentStatus === 'paid' ? '#15803D' : '#B45309', marginTop: '2px' }}>
                    {order.paymentStatus === 'paid' ? '✓ Paid' : 'Unpaid'}
                  </p>
                </div>

                <ChevronRight size={16} color="#ccc" />
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

export default function AdminOrdersPage() {
  return (
    <Suspense fallback={<Loader />}>
      <AdminOrdersContent />
    </Suspense>
  )
}
