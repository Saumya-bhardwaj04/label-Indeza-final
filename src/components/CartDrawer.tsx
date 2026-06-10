'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useCart } from '@/context/CartContext'
import { X, Plus, Minus, Trash2 } from 'lucide-react'

export default function CartDrawer({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { items, removeItem, updateQuantity, total, count } = useCart()
  const { data: session } = useSession()
  const router = useRouter()

  const handleCheckout = async () => {
    if (items.length === 0) return

    // Login gate: redirect to sign-in if not authenticated
    if (!session) {
      router.push('/account?redirect=/checkout')
      onClose()
      return
    }

    // Logged in → go to checkout page
    router.push('/checkout')
    onClose()
  }

  return (
    <>
      {open && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.3)',
            zIndex: 1000,
          }}
          onClick={onClose}
        />
      )}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 400,
          maxWidth: '100vw',
          background: 'white',
          zIndex: 1001,
          transform: open ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            padding: '20px 24px',
            borderBottom: '1px solid #F0F0F0',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <h3 style={{ fontSize: 18, fontWeight: 600, color: '#1A1A1A' }}>Your Cart</h3>
            <span
              style={{
                width: 24,
                height: 24,
                borderRadius: '50%',
                backgroundColor: '#F5EFEB',
                color: '#8C8275',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 600,
                marginLeft: 10,
              }}
            >
              {count}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1A1A1A' }}
            aria-label="Close cart"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable list or Empty State */}
        <style>{`.cart-scroll-area::-webkit-scrollbar { display: none; }`}</style>
        <div className="cart-scroll-area" style={{ flex: 1, overflowY: 'auto', padding: 24, display: 'flex', flexDirection: 'column', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
          {items.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', padding: '40px 0', margin: 'auto' }}>
              <div style={{
                width: 120,
                height: 120,
                borderRadius: '50%',
                backgroundColor: '#F5EFEB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#8C8275',
              }}>
                <svg viewBox="0 0 100 100" width="60" height="60">
                  <rect x="25" y="35" width="50" height="48" rx="8" fill="none" stroke="currentColor" strokeWidth="6" />
                  <path d="M 38 35 A 12 12 0 0 1 62 35" fill="none" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                  <circle cx="42" cy="53" r="4" fill="currentColor" />
                  <circle cx="58" cy="53" r="4" fill="currentColor" />
                  <path d="M 43 63 Q 50 71 57 63" fill="none" stroke="currentColor" strokeWidth="5" strokeLinecap="round" />
                </svg>
              </div>
              <p style={{ fontSize: 16, fontWeight: 500, color: '#1A1A1A', marginTop: 24, marginBottom: 16 }}>Your cart is empty</p>
              <Link
                href="/collections"
                onClick={onClose}
                style={{
                  backgroundColor: '#8C8275',
                  color: 'white',
                  fontWeight: 500,
                  fontSize: 15,
                  padding: '12px 32px',
                  borderRadius: 50,
                  textDecoration: 'none',
                  transition: 'background 0.2s',
                }}
              >
                Explore Collections
              </Link>
            </div>
          ) : (
            items.map((item) => (
              <div
                key={item.id}
                style={{
                  display: 'flex',
                  gap: 16,
                  marginBottom: 24,
                  paddingBottom: 24,
                  borderBottom: '1px solid #F0F0F0',
                }}
              >
                <img
                  src={item.image}
                  alt=""
                  style={{ width: 80, height: 100, objectFit: 'cover', borderRadius: 8 }}
                />
                <div style={{ flex: 1 }}>
                  <p style={{ fontWeight: 500, marginBottom: 4 }}>{item.name}</p>
                  {item.selectedSize && (
                    <p style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
                      {item.selectedSize === 'Custom Fit'
                        ? '✂️ Custom Fit'
                        : `Size: ${item.selectedSize}`
                      }
                    </p>
                  )}
                  {item.measurements && item.selectedSize === 'Custom Fit' && (
                    <p style={{ fontSize: 11, color: '#aaa', marginTop: 2 }}>
                      B:{item.measurements.bust} W:{item.measurements.waist} H:{item.measurements.hip}
                    </p>
                  )}
                  <p style={{ color: '#666', fontSize: 14 }}>₹{item.price.toLocaleString('en-IN')}</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 12 }}>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity - 1)}>
                      <Minus size={14} />
                    </button>
                    <span>{item.quantity}</span>
                    <button type="button" onClick={() => updateQuantity(item.id, item.quantity + 1)}>
                      <Plus size={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      style={{ marginLeft: 'auto', color: '#999', background: 'none', border: 'none' }}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer — always visible */}
        <div style={{ padding: 24, borderTop: '1px solid #F0F0F0', backgroundColor: 'white' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 20 }}>
            <span style={{ fontSize: 16, fontWeight: 500, color: '#1A1A1A' }}>Subtotal</span>
            <span style={{ fontSize: 16, fontWeight: 600, color: '#1A1A1A' }}>
              ₹{total.toLocaleString('en-IN')}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={items.length === 0}
            style={{
              width: '100%',
              background: items.length === 0 ? '#F2F2F2' : '#1A1A1A',
              color: items.length === 0 ? '#A1A1A1' : 'white',
              border: 'none',
              borderRadius: 50,
              padding: '16px',
              fontSize: 15,
              fontWeight: 500,
              cursor: items.length === 0 ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background-color 0.2s, color 0.2s',
            }}
          >
            {items.length === 0 ? 'Checkout' : (session ? 'Checkout' : 'Sign in to Checkout')}
          </button>
        </div>
      </div>
    </>
  )
}