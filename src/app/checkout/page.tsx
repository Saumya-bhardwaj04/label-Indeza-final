'use client'
import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import { MapPin, ChevronRight, Loader2 } from 'lucide-react'
import RazorpayCheckout from '@/components/RazorpayCheckout'

interface Address {
  fullName:     string
  phone:        string
  addressLine1: string
  addressLine2: string
  city:         string
  state:        string
  pincode:      string
  country:      string
}

const EMPTY_ADDRESS: Address = {
  fullName: '', phone: '', addressLine1: '', addressLine2: '',
  city: '', state: '', pincode: '', country: 'India',
}

const INDIAN_STATES = [
  'Andhra Pradesh','Arunachal Pradesh','Assam','Bihar','Chhattisgarh',
  'Goa','Gujarat','Haryana','Himachal Pradesh','Jharkhand','Karnataka',
  'Kerala','Madhya Pradesh','Maharashtra','Manipur','Meghalaya','Mizoram',
  'Nagaland','Odisha','Punjab','Rajasthan','Sikkim','Tamil Nadu','Telangana',
  'Tripura','Uttar Pradesh','Uttarakhand','West Bengal',
  'Delhi','Jammu & Kashmir','Ladakh','Puducherry',
]

export default function CheckoutPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { items, total, count, clearCart } = useCart()

  const [address,       setAddress]       = useState<Address>(EMPTY_ADDRESS)
  const [savedAddress,  setSavedAddress]  = useState<Address | null>(null)
  const [useSaved,      setUseSaved]      = useState(false)
  const [saveAddress,   setSaveAddress]   = useState(true)
  const [loading,       setLoading]       = useState(false)
  const [fetchingAddr,  setFetchingAddr]  = useState(true)
  const [notes,         setNotes]         = useState('')
  const [paymentError,  setPaymentError]  = useState('')

  const [couponCode,    setCouponCode]    = useState('')
  const [couponApplied, setCouponApplied] = useState<any>(null)
  const [couponLoading, setCouponLoading] = useState(false)
  const [couponError,   setCouponError]   = useState('')

  const couponDiscount  = couponApplied?.discountAmount || 0
  const DELIVERY_CHARGE = (total - couponDiscount) >= 2999 ? 0 : 99
  const orderTotal      = total + DELIVERY_CHARGE - couponDiscount

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return
    setCouponLoading(true); setCouponError(''); setCouponApplied(null)
    try {
      const res  = await fetch('/api/coupons/validate', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponCode, orderTotal: total }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setCouponApplied(data)
    } catch (err: any) {
      setCouponError(err.message || 'Invalid coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  // Redirect if not logged in
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/account?redirect=/checkout')
    }
  }, [status, router])

  // Redirect if cart empty (but bypass if a payment is currently pending/verifying)
  useEffect(() => {
    if (status === 'authenticated' && count === 0) {
      const isPaying = typeof window !== 'undefined' && sessionStorage.getItem('pendingOrderId')
      if (!isPaying) {
        router.push('/')
      }
    }
  }, [count, status, router])

  const isCompleteAddress = (addr: Address | null | undefined): addr is Address => {
    if (!addr) return false
    return !!(
      addr.fullName?.trim() &&
      addr.phone?.trim() &&
      addr.addressLine1?.trim() &&
      addr.city?.trim() &&
      addr.state?.trim() &&
      addr.pincode?.trim()
    )
  }

  // Fetch saved address
  useEffect(() => {
    if (status !== 'authenticated') return
    const fetchAddress = async () => {
      try {
        const res  = await fetch('/api/customer/address')
        const data = await res.json()
        if (data.address && isCompleteAddress(data.address)) {
          setSavedAddress(data.address)
          setAddress(data.address)
          setUseSaved(true)
        } else {
          setUseSaved(false)
        }
      } catch (e) {
        console.error('Failed to fetch address')
      } finally {
        setFetchingAddr(false)
      }
    }
    fetchAddress()
  }, [status])

  const handleField = (field: keyof Address, value: string) => {
    setAddress(prev => ({ ...prev, [field]: value }))
  }

  const isAddressValid = () => {
    const a = useSaved && savedAddress && isCompleteAddress(savedAddress) ? savedAddress : address
    return !!(a.fullName?.trim() && a.phone?.trim() && a.addressLine1?.trim() && a.city?.trim() && a.state && a.pincode?.trim())
  }

  const handleProceedToPayment = async () => {
    if (!isAddressValid()) {
      alert('Please fill all required address fields')
      return
    }
    setLoading(true)
    setPaymentError('')
    try {
      const finalAddress = useSaved && savedAddress ? savedAddress : address

      // Optionally save address to profile
      if (saveAddress && !useSaved) {
        await fetch('/api/customer/address', {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ address: finalAddress }),
        })
      }

      // Create Razorpay order
      const res = await fetch('/api/orders/create-razorpay', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({
          items,
          deliveryAddress: finalAddress,
          subtotal:        total,
          deliveryCharge:  DELIVERY_CHARGE,
          total:           orderTotal,
          notes,
          couponCode:      couponApplied?.code || undefined,
          couponDiscount:  couponDiscount,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)

      // Store pending order ID in session storage, then open Razorpay
      sessionStorage.setItem('pendingOrderId', data.orderId)
      sessionStorage.setItem('razorpayOrderId', data.razorpayOrderId)

      // Trigger Razorpay (Phase C will handle this)
      ;(window as any).__openRazorpay?.({
        orderId:        data.razorpayOrderId,
        amount:         orderTotal * 100,
        pendingOrderId: data.orderId,
      })
    } catch (err: any) {
      alert(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'loading' || fetchingAddr) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} style={{ animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1px solid #E0E0E0', borderRadius: '10px',
    padding: '12px 14px', fontSize: '14px', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box',
    transition: 'border-color 0.15s',
  }

  const labelStyle: React.CSSProperties = {
    fontSize: '13px', fontWeight: 500,
    color: '#444', display: 'block', marginBottom: '6px',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F5' }} className="checkout-main-padding">
      <RazorpayCheckout
        customerName={session?.user?.name || ''}
        customerEmail={session?.user?.email || ''}
        onPaymentError={(msg: string) => {
          setPaymentError(msg)
          setLoading(false)
        }}
      />
      <div style={{ maxWidth: 1000, margin: '0 auto' }}>
        <h1 style={{ fontFamily: 'var(--font-display), Cormorant Garamond, serif', fontSize: 36, fontWeight: 400, marginBottom: 48 }}>
          Checkout
        </h1>

        {paymentError && (
          <div style={{
            background: '#FEE2E2',
            border: '1.5px solid #F87171',
            borderRadius: '12px',
            padding: '16px 20px',
            marginBottom: '32px',
            color: '#991B1B',
            fontSize: '14px',
            fontWeight: 500,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <span>❌ {paymentError}</span>
            <button 
              onClick={() => setPaymentError('')} 
              style={{ background: 'none', border: 'none', color: '#991B1B', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer' }}
            >
              ✕
            </button>
          </div>
        )}

        <div className="checkout-grid-container">

          {/* LEFT — Address Form */}
          <div>
            {/* Saved address toggle */}
            {isCompleteAddress(savedAddress) && (
              <div style={{ background: 'white', borderRadius: 16, padding: '20px 24px', marginBottom: 24, border: '1.5px solid #E8E8E8' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: useSaved ? 16 : 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <MapPin size={16} />
                    <span style={{ fontWeight: 500 }}>Saved Address</span>
                  </div>
                  <button
                    onClick={() => setUseSaved(!useSaved)}
                    style={{ fontSize: 13, color: '#666', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                  >
                    {useSaved ? 'Use different address' : 'Use saved address'}
                  </button>
                </div>
                {useSaved && (
                  <div style={{ fontSize: 14, color: '#555', lineHeight: 1.6 }}>
                    <p style={{ fontWeight: 500 }}>{savedAddress.fullName} · {savedAddress.phone}</p>
                    <p>{savedAddress.addressLine1}{savedAddress.addressLine2 ? `, ${savedAddress.addressLine2}` : ''}</p>
                    <p>{savedAddress.city}, {savedAddress.state} — {savedAddress.pincode}</p>
                  </div>
                )}
              </div>
            )}

            {/* Address form — hide if using saved */}
            {!useSaved && (
              <div style={{ background: 'white', borderRadius: 16, padding: '28px 24px', border: '1px solid #E8E8E8' }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 24 }}>Delivery Address</h2>

                <div className="checkout-row-2">
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input style={inputStyle} value={address.fullName}
                      onChange={e => handleField('fullName', e.target.value)} placeholder="Priya Sharma" />
                  </div>
                  <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <input style={inputStyle} value={address.phone} type="tel" maxLength={10}
                      onChange={e => handleField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="9876543210" />
                  </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Address Line 1 *</label>
                  <input style={inputStyle} value={address.addressLine1}
                    onChange={e => handleField('addressLine1', e.target.value)} placeholder="House / Flat / Building no." />
                </div>

                <div style={{ marginBottom: 16 }}>
                  <label style={labelStyle}>Address Line 2</label>
                  <input style={inputStyle} value={address.addressLine2}
                    onChange={e => handleField('addressLine2', e.target.value)} placeholder="Street, Area, Landmark (optional)" />
                </div>

                <div className="checkout-row-3">
                  <div>
                    <label style={labelStyle}>City *</label>
                    <input style={inputStyle} value={address.city}
                      onChange={e => handleField('city', e.target.value)} placeholder="Mumbai" />
                  </div>
                  <div>
                    <label style={labelStyle}>State *</label>
                    <select style={{ ...inputStyle, background: 'white', color: address.state ? '#1A1A1A' : '#999' }}
                      value={address.state} onChange={e => handleField('state', e.target.value)}>
                      <option value="">Select state</option>
                      {INDIAN_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label style={labelStyle}>Pincode *</label>
                    <input style={inputStyle} value={address.pincode} maxLength={6}
                      onChange={e => handleField('pincode', e.target.value.replace(/\D/g, ''))} placeholder="400001" />
                  </div>
                </div>

                {/* Save address checkbox */}
                <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', fontSize: 14, color: '#555' }}>
                  <input type="checkbox" checked={saveAddress} onChange={e => setSaveAddress(e.target.checked)}
                    style={{ width: 16, height: 16, cursor: 'pointer' }} />
                  Save this address for future orders
                </label>
              </div>
            )}

            {/* Order notes */}
            <div style={{ marginTop: 20 }}>
              <label style={labelStyle}>Order Notes (optional)</label>
              <textarea
                value={notes}
                onChange={e => setNotes(e.target.value)}
                placeholder="Any special instructions for delivery..."
                rows={3}
                style={{ ...inputStyle, resize: 'vertical' }}
              />
            </div>
          </div>

          {/* RIGHT — Order Summary */}
          <div className="checkout-summary-sticky">
            <div style={{ background: 'white', borderRadius: 16, padding: 24, border: '1px solid #E8E8E8' }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>Order Summary</h2>

              {/* Items */}
              <div style={{ marginBottom: 20 }}>
                {items.map(item => (
                  <div key={item.id} style={{ display: 'flex', gap: 12, marginBottom: 16, paddingBottom: 16, borderBottom: '1px solid #F5F5F5' }}>
                    <div style={{ position: 'relative', flexShrink: 0 }}>
                      <img src={item.image} style={{ width: 56, height: 72, objectFit: 'cover', borderRadius: 8 }} alt={item.name} />
                      <span style={{
                        position: 'absolute', top: -8, right: -8,
                        background: '#1A1A1A', color: 'white',
                        width: 20, height: 20, borderRadius: '50%',
                        fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>{item.quantity}</span>
                    </div>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 500, marginBottom: 4 }}>{item.name}</p>
                      <p style={{ fontSize: 13, color: '#888' }}>₹{item.price.toLocaleString('en-IN')} × {item.quantity}</p>
                    </div>
                    <p style={{ fontSize: 14, fontWeight: 500 }}>₹{(item.price * item.quantity).toLocaleString('en-IN')}</p>
                  </div>
                ))}
              </div>

              {/* Coupon input */}
              <div style={{ marginBottom:'16px', paddingBottom:'16px', borderBottom:'1px solid #F0F0F0' }}>
                {!couponApplied ? (
                  <>
                    <p style={{ fontSize:'13px', fontWeight:500, marginBottom:'10px' }}>Have a coupon?</p>
                    <div style={{ display:'flex', gap:'8px' }}>
                      <input
                        type="text"
                        value={couponCode}
                        onChange={e => { setCouponCode(e.target.value.toUpperCase()); setCouponError('') }}
                        onKeyDown={e => e.key === 'Enter' && handleApplyCoupon()}
                        placeholder="Enter code"
                        style={{ flex:1, border:'1px solid #E0E0E0', borderRadius:'10px', padding:'10px 12px', fontSize:'13px', outline:'none', fontFamily:'inherit', letterSpacing:'0.05em', textTransform:'uppercase' }}
                      />
                      <button onClick={handleApplyCoupon} disabled={couponLoading || !couponCode.trim()}
                        style={{ padding:'10px 16px', borderRadius:'10px', background:'#1A1A1A', color:'white', border:'none', fontSize:'13px', fontWeight:500, cursor:'pointer', fontFamily:'inherit', opacity: !couponCode.trim() ? 0.5 : 1, whiteSpace:'nowrap' }}>
                        {couponLoading ? '...' : 'Apply'}
                      </button>
                    </div>
                    {couponError && <p style={{ fontSize:'12px', color:'#EF4444', marginTop:'8px' }}>{couponError}</p>}
                  </>
                ) : (
                  <div style={{ background:'#F0FDF4', borderRadius:'10px', padding:'12px 16px', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                    <div>
                      <p style={{ fontWeight:600, fontSize:'13px', color:'#15803D' }}>🎉 {couponApplied.code} applied!</p>
                      <p style={{ fontSize:'12px', color:'#15803D', marginTop:'2px' }}>You save ₹{couponApplied.discountAmount.toLocaleString('en-IN')}</p>
                    </div>
                    <button onClick={() => { setCouponApplied(null); setCouponCode(''); setCouponError('') }}
                      style={{ background:'none', border:'none', cursor:'pointer', color:'#999', fontSize:'18px' }}>×</button>
                  </div>
                )}
              </div>

              {/* Totals */}
              <div style={{ borderTop: '1px solid #F0F0F0', paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                  <span style={{ color: '#666' }}>Subtotal</span>
                  <span>₹{total.toLocaleString('en-IN')}</span>
                </div>
                {couponApplied && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10, fontSize: 14 }}>
                    <span style={{ color: '#15803D' }}>Coupon ({couponApplied.code})</span>
                    <span style={{ color: '#15803D' }}>−₹{couponApplied.discountAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16, fontSize: 14 }}>
                  <span style={{ color: '#666' }}>Delivery</span>
                  <span style={{ color: DELIVERY_CHARGE === 0 ? '#22C55E' : '#1A1A1A' }}>
                    {DELIVERY_CHARGE === 0 ? 'FREE' : `₹${DELIVERY_CHARGE}`}
                  </span>
                </div>
                {DELIVERY_CHARGE > 0 && (
                  <p style={{ fontSize: 12, color: '#999', marginBottom: 16 }}>
                    Add ₹{(2999 - (total - couponDiscount)).toLocaleString('en-IN')} more for free delivery
                  </p>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 16, fontWeight: 700, paddingTop: 12, borderTop: '1px solid #E8E8E8', marginBottom: 20 }}>
                  <span>Total</span>
                  <span>₹{orderTotal.toLocaleString('en-IN')}</span>
                </div>

                <button
                  onClick={handleProceedToPayment}
                  disabled={loading || !isAddressValid()}
                  style={{
                    width: '100%', background: loading ? '#666' : (!isAddressValid() ? '#999' : '#1A1A1A'),
                    color: 'white', border: 'none', borderRadius: 999,
                    padding: 16, fontSize: 15, fontWeight: 500,
                    cursor: loading || !isAddressValid() ? 'not-allowed' : 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    transition: 'background 0.2s',
                    opacity: !isAddressValid() ? 0.6 : 1,
                  }}
                >
                  {loading ? (
                    <><Loader2 size={16} style={{ animation: 'spin 0.8s linear infinite' }} /> Processing...</>
                  ) : (
                    <>Pay ₹{orderTotal.toLocaleString('en-IN')} <ChevronRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
