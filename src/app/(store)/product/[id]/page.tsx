'use client'
import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

const SIZE_GUIDE = [
  { size: 'XS', bust: '32"', waist: '26"', hip: '35"' },
  { size: 'S',  bust: '34"', waist: '28"', hip: '37"' },
  { size: 'M',  bust: '36"', waist: '30"', hip: '39"' },
  { size: 'L',  bust: '38"', waist: '32"', hip: '41"' },
  { size: 'XL', bust: '40"', waist: '34"', hip: '43"' },
  { size: 'XXL',bust: '42"', waist: '36"', hip: '45"' },
]

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { addItem } = useCart()

  const [product,       setProduct]       = useState<any>(null)
  const [loading,       setLoading]       = useState(true)
  const [related,       setRelated]       = useState<any[]>([])
  const [selectedSize,  setSelectedSize]  = useState('')
  const [customMode,    setCustomMode]    = useState(false)
  const [showSizeGuide, setShowSizeGuide] = useState(false)
  const [added,         setAdded]         = useState(false)
  const [error,         setError]         = useState('')

  const [measurements, setMeasurements] = useState({
    bust: '', waist: '', hip: '', height: '', sleeve: '', notes: '',
  })

  useEffect(() => {
    if (!params.id) return
    fetch(`/api/products/${params.id}`)
      .then(r => r.json())
      .then(data => {
        if (data.error) { setLoading(false); router.push('/shop/women'); return }
        setProduct(data)
        setLoading(false)
        if (data.collection) {
          fetch(`/api/products?collection=${data.collection}&limit=4`)
            .then(r => r.json())
            .then(rel => {
              if (Array.isArray(rel)) setRelated(rel.filter((p: any) => p._id !== data._id).slice(0, 3))
            })
        }
      })
      .catch(() => { setLoading(false); router.push('/shop/women') })
  }, [params.id, router])

  const handleMeasurement = (field: string, value: string) => {
    setMeasurements(prev => ({ ...prev, [field]: value }))
  }

  const validateAndAdd = () => {
    setError('')
    if (!customMode && !selectedSize) {
      setError('Please select a size before adding to cart')
      return
    }
    if (customMode) {
      if (!measurements.bust || !measurements.waist || !measurements.hip || !measurements.height) {
        setError('Please fill Bust, Waist, Hip and Height for custom fit')
        return
      }
    }

    addItem({
      id:           product._id,
      name:         product.name,
      price:        product.price,
      image:        product.image,
      quantity:     1,
      selectedSize: customMode ? 'Custom Fit' : selectedSize,
      measurements: customMode ? measurements : undefined,
    })

    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  if (loading) {
    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid #1A1A1A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  if (!product) return null

  const availableSizes = product.sizes || ['S', 'M', 'L', 'XL']
  const isCustomOnly   = availableSizes.includes('Custom Only') && availableSizes.length === 1
  const showStdSizes   = !isCustomOnly && !customMode
  const showCustomForm = customMode || isCustomOnly

  const inputStyle: React.CSSProperties = {
    border: '1px solid #E0E0E0', borderRadius: '8px',
    padding: '10px 12px', fontSize: '14px',
    outline: 'none', fontFamily: 'inherit',
    width: '100%', boxSizing: 'border-box',
  }

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F5', paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="container" style={{ maxWidth: '1100px' }}>

        {/* Breadcrumb */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', color: '#888', marginBottom: '32px' }}>
          <a href="/" style={{ color: '#888', textDecoration: 'none' }}>Home</a>
          <span>›</span>
          <a href="/shop/women" style={{ color: '#888', textDecoration: 'none' }}>Women</a>
          <span>›</span>
          <span style={{ color: '#1A1A1A' }}>{product.name}</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '64px', alignItems: 'start' }}>

          {/* LEFT — Image */}
          <div>
            <div style={{ borderRadius: '20px', overflow: 'hidden', aspectRatio: '3/4', marginBottom: '16px', background: '#F5F3F0' }}>
              <img
                src={product.image}
                alt={product.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>
          </div>

          {/* RIGHT — Info */}
          <div style={{ position: 'sticky', top: '100px' }}>

            {product.collection && (
              <span style={{ fontSize: '11px', fontWeight: 600, color: '#C4B5D4', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                {product.collection.replace(/-/g, ' ')}
              </span>
            )}

            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(28px, 3.5vw, 40px)', fontWeight: 400, margin: '8px 0 16px', lineHeight: 1.2 }}>
              {product.name}
            </h1>

            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
              <span style={{ fontSize: '24px', fontWeight: 700 }}>₹{product.price}</span>
              {product.originalPrice && (
                <span style={{ fontSize: '18px', color: '#999', textDecoration: 'line-through' }}>₹{product.originalPrice}</span>
              )}
              {product.originalPrice && (
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#15803D', background: '#DCFCE7', padding: '3px 10px', borderRadius: '999px' }}>
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            {product.description && (
              <p style={{ color: '#555', fontSize: '15px', lineHeight: 1.7, marginBottom: '28px' }}>
                {product.description}
              </p>
            )}

            <div style={{ height: '1px', background: '#E8E8E8', marginBottom: '24px' }} />

            {product.inStock !== false ? (
            <>
            {/* SIZE SECTION */}
            {!isCustomOnly && (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '14px', fontWeight: 600 }}>
                    {customMode ? 'Custom Measurements' : 'Select Size'}
                  </span>
                  <button
                    onClick={() => setShowSizeGuide(!showSizeGuide)}
                    style={{ fontSize: '12px', color: '#888', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'underline' }}
                  >
                    📏 Size Guide
                  </button>
                </div>

                {showSizeGuide && (
                  <div style={{ background: '#F9F7F4', borderRadius: '12px', padding: '16px', marginBottom: '16px', overflow: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
                      <thead>
                        <tr style={{ borderBottom: '1px solid #E8E8E8' }}>
                          {['Size', 'Bust', 'Waist', 'Hip'].map(h => (
                            <th key={h} style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#888' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {SIZE_GUIDE.map(row => (
                          <tr key={row.size} style={{ borderBottom: '1px solid #F0F0F0' }}>
                            <td style={{ padding: '8px 12px', fontWeight: 600 }}>{row.size}</td>
                            <td style={{ padding: '8px 12px', color: '#555' }}>{row.bust}</td>
                            <td style={{ padding: '8px 12px', color: '#555' }}>{row.waist}</td>
                            <td style={{ padding: '8px 12px', color: '#555' }}>{row.hip}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <button
                    onClick={() => { setCustomMode(false); setSelectedSize('') }}
                    style={{
                      padding: '8px 18px', borderRadius: '999px', fontSize: '13px',
                      fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                      background: !customMode ? '#1A1A1A' : 'white',
                      color:      !customMode ? 'white'   : '#555',
                      border:     !customMode ? 'none'    : '1px solid #E0E0E0',
                    }}
                  >
                    Standard Sizes
                  </button>
                  {product.allowCustomMeasurements !== false && (
                    <button
                      onClick={() => { setCustomMode(true); setSelectedSize('') }}
                      style={{
                        padding: '8px 18px', borderRadius: '999px', fontSize: '13px',
                        fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
                        background: customMode ? '#1A1A1A' : 'white',
                        color:      customMode ? 'white'   : '#555',
                        border:     customMode ? 'none'    : '1px solid #E0E0E0',
                      }}
                    >
                      Custom Fit
                    </button>
                  )}
                </div>
              </>
            )}

            {showStdSizes && (
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '24px' }}>
                {availableSizes.map((size: string) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      width: '52px', height: '52px', borderRadius: '10px',
                      border: selectedSize === size ? '2px solid #1A1A1A' : '1.5px solid #E0E0E0',
                      background: selectedSize === size ? '#1A1A1A' : 'white',
                      color:      selectedSize === size ? 'white'   : '#1A1A1A',
                      fontSize: '13px', fontWeight: 600, cursor: 'pointer',
                      fontFamily: 'inherit', transition: 'all 0.15s',
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            )}

            {showCustomForm && (
              <div style={{ background: '#F9F7F4', borderRadius: '14px', padding: '20px', marginBottom: '24px' }}>
                <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px', lineHeight: 1.6 }}>
                  Enter your measurements in inches. Our tailors will stitch this piece to your exact fit.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
                  {[
                    { key: 'bust',   label: 'Bust *',   placeholder: 'e.g. 36"' },
                    { key: 'waist',  label: 'Waist *',  placeholder: 'e.g. 30"' },
                    { key: 'hip',    label: 'Hip *',    placeholder: 'e.g. 38"' },
                    { key: 'height', label: 'Height *', placeholder: 'e.g. 162 cm' },
                    { key: 'sleeve', label: 'Sleeve',   placeholder: 'e.g. 24" (optional)' },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{ fontSize: '12px', fontWeight: 500, color: '#555', display: 'block', marginBottom: '6px' }}>{field.label}</label>
                      <input
                        type="text"
                        value={measurements[field.key as keyof typeof measurements]}
                        onChange={e => handleMeasurement(field.key, e.target.value)}
                        placeholder={field.placeholder}
                        style={inputStyle}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={{ fontSize: '12px', fontWeight: 500, color: '#555', display: 'block', marginBottom: '6px' }}>Special Instructions</label>
                  <textarea
                    value={measurements.notes}
                    onChange={e => handleMeasurement('notes', e.target.value)}
                    placeholder="Any specific requirements — neckline, sleeve style, lining preference..."
                    rows={2}
                    style={{ ...inputStyle, resize: 'vertical' as const }}
                  />
                </div>
                <p style={{ fontSize: '11px', color: '#999', marginTop: '10px' }}>
                  ⏱ Custom fit orders take 15–21 working days to deliver
                </p>
              </div>
            )}

            {error && (
              <p style={{ color: '#EF4444', fontSize: '13px', marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                ✕ {error}
              </p>
            )}

            <button
              onClick={validateAndAdd}
              style={{
                width: '100%', background: added ? '#15803D' : '#1A1A1A',
                color: 'white', border: 'none', borderRadius: '999px',
                padding: '18px', fontSize: '15px', fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                transition: 'background 0.2s',
                marginBottom: '16px',
              }}
            >
              {added
                ? '✓ Added to Cart!'
                : customMode ? '🛍 Add Custom Order to Cart' : '🛍 Add to Cart'
              }
            </button>
            </>
            ) : (
              <div>
                <div style={{
                  background: '#F5F3F0', borderRadius: '14px',
                  padding: '20px 24px', marginBottom: '20px',
                  display: 'flex', alignItems: 'center', gap: '12px',
                }}>
                  <span style={{ fontSize: '20px' }}>😔</span>
                  <div>
                    <p style={{ fontWeight: 600, marginBottom: '4px' }}>Currently Out of Stock</p>
                    <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.5 }}>
                      This piece is currently unavailable. Check back soon or
                      join our mailing list to be notified when it's back in stock!
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-subscribe', { detail: { mode: 'notify', product: product.name } }))}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#1A1A1A'
                    e.currentTarget.style.color = 'white'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'white'
                    e.currentTarget.style.color = '#1A1A1A'
                  }}
                  style={{
                    width: '100%',
                    display: 'block', textAlign: 'center',
                    background: 'white', color: '#1A1A1A',
                    border: '1.5px solid #1A1A1A',
                    borderRadius: '999px', padding: '16px',
                    fontSize: '14px', fontWeight: 500,
                    cursor: 'pointer', fontFamily: 'inherit',
                    transition: 'all 0.2s ease',
                  }}
                >
                  Notify Me →
                </button>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '24px', paddingTop: '24px', borderTop: '1px solid #E8E8E8' }}>
              {[
                { icon: '🚚', text: 'Free delivery on orders above ₹999' },
                { icon: '↩️', text: '30-day easy returns' },
                { icon: '🔒', text: 'Secure payment via Razorpay' },
                { icon: '✂️', text: 'Custom fit orders stitched in 15–21 days' },
              ].map((item, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px', color: '#555' }}>
                  <span>{item.icon}</span>
                  <span>{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {related.length > 0 && (
          <div style={{ marginTop: '80px' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '32px', fontWeight: 400, marginBottom: '32px', textAlign: 'center' }}>
              You might also love
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px' }}>
              {related.map((p: any) => (
                <a key={p._id} href={`/product/${p._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '3/4', marginBottom: '14px', background: '#F5F3F0' }}>
                    <img src={p.image} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease' }} />
                  </div>
                  <p style={{ fontWeight: 500, fontSize: '14px', marginBottom: '4px' }}>{p.name}</p>
                  <p style={{ fontSize: '14px', color: '#666' }}>₹{p.price}</p>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          main > .container > div:nth-child(2) { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </main>
  )
}
