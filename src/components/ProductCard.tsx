'use client'

import { useState } from 'react'
import { useCart } from '@/context/CartContext'
import { Check, X } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ProductCard({
  product,
  priceLocale = 'usd',
  showDescription = false,
}: {
  product: any
  priceLocale?: 'usd' | 'inr'
  showDescription?: boolean
}) {
  const { addItem } = useCart()
  const router = useRouter()

  const [showSizePicker, setShowSizePicker] = useState(false)
  const [selectedSize,   setSelectedSize]   = useState('')
  const [added,          setAdded]          = useState(false)
  const [hovered,        setHovered]        = useState(false)

  const availableSizes = product.sizes?.length
    ? product.sizes.filter((s: string) => s !== 'Custom Only')
    : ['S', 'M', 'L', 'XL']

  const isCustomOnly = product.sizes?.length === 1 && product.sizes[0] === 'Custom Only'
  const productId = product._id || product.id
  const inStock = product.inStock !== false

  const formatPrice = (n: number) => `₹${n.toLocaleString('en-IN')}`

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (isCustomOnly) {
      const sectionId = product.collection || ''
      if (sectionId) sessionStorage.setItem('last_clicked_section', sectionId)
      window.location.href = `/product/${productId}`
      return
    }

    setShowSizePicker(true)
    setSelectedSize('')
  }

  const handleAddWithSize = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!selectedSize) return

    addItem({
      id:           productId,
      name:         product.name,
      price:        product.price,
      image:        product.image,
      quantity:     1,
      selectedSize,
    })

    setAdded(true)
    setShowSizePicker(false)
    setSelectedSize('')
    setTimeout(() => setAdded(false), 2000)
  }

  const handleClosePicker = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowSizePicker(false)
    setSelectedSize('')
  }

  const href = productId?.startsWith('local-') ? '/shop/women' : `/product/${productId}`

  const handleCardClick = (e: React.MouseEvent) => {
    if (showSizePicker) return
    if ((e.target as HTMLElement).closest('button, a')) return

    const sectionId = product.collection || ''
    if (sectionId) {
      sessionStorage.setItem('last_clicked_section', sectionId)
    }
    router.push(href)
  }

  const handleLinkClick = () => {
    const sectionId = product.collection || ''
    if (sectionId) {
      sessionStorage.setItem('last_clicked_section', sectionId)
    }
  }

  return (
    <div
      className="product-card product-card--velaa"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { setHovered(false); if (!added) setShowSizePicker(false) }}
      onClick={handleCardClick}
      style={{ cursor: 'pointer', position: 'relative' }}
    >
      {/* Image wrapper */}
      <div className="product-img-wrap product-img-wrap--velaa" style={{ position: 'relative', overflow: 'hidden', borderRadius: '16px', aspectRatio: '3/4' }}>
        {/* Clicking image goes to product page */}
        <Link href={href} onClick={handleLinkClick} style={{ textDecoration: 'none', display: 'block', width: '100%', height: '100%' }}>
          <img
            src={product.image}
            alt={product.name}
            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s ease', transform: hovered ? 'scale(1.05)' : 'scale(1)' }}
          />
        </Link>

        {/* Out of stock badge */}
        {!inStock && (
          <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(26,26,26,0.82)', color: 'white', fontSize: 11, fontWeight: 600, padding: '5px 12px', borderRadius: 999, backdropFilter: 'blur(4px)', zIndex: 3 }}>
            Out of Stock
          </div>
        )}

        {/* Size picker popup — shows on Quick Add click */}
        {showSizePicker && (
          <div
            onClick={e => { e.preventDefault(); e.stopPropagation() }}
            style={{
              position: 'absolute', inset: 0, zIndex: 10,
              background: 'rgba(255,255,255,0.97)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              padding: '16px', borderRadius: '16px',
            }}
          >
            {/* Close */}
            <button
              onClick={handleClosePicker}
              style={{ position: 'absolute', top: 10, right: 10, background: '#F5F5F5', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >
              <X size={14} />
            </button>

            <p style={{ fontSize: 13, fontWeight: 600, marginBottom: 12, color: '#1A1A1A' }}>Select Size</p>

            {/* Size buttons */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 12 }}>
              {availableSizes.map((size: string) => (
                <button
                  key={size}
                  onClick={e => { e.preventDefault(); e.stopPropagation(); setSelectedSize(size) }}
                  style={{
                    width: 40, height: 40, borderRadius: 8,
                    border: selectedSize === size ? '2px solid #1A1A1A' : '1.5px solid #E0E0E0',
                    background: selectedSize === size ? '#1A1A1A' : 'white',
                    color:      selectedSize === size ? 'white'   : '#1A1A1A',
                    fontSize: 12, fontWeight: 600, cursor: 'pointer',
                    fontFamily: 'inherit',
                  }}
                >
                  {size}
                </button>
              ))}
            </div>

            {/* Add to cart */}
            <button
              onClick={handleAddWithSize}
              disabled={!selectedSize}
              style={{
                background: selectedSize ? '#1A1A1A' : '#E0E0E0',
                color:      selectedSize ? 'white'   : '#999',
                border: 'none', borderRadius: 999,
                padding: '10px 24px', fontSize: 13, fontWeight: 500,
                cursor: selectedSize ? 'pointer' : 'not-allowed',
                fontFamily: 'inherit', width: '100%',
                transition: 'background 0.15s',
              }}
            >
              {selectedSize ? `Add Size ${selectedSize}` : 'Select a size first'}
            </button>

            {/* Link to full product page for custom */}
            {product.allowCustomMeasurements !== false && (
              <Link
                href={href}
                onClick={handleLinkClick}
                style={{ fontSize: 11, color: '#888', marginTop: 8, textDecoration: 'underline' }}
              >
                Need custom fit?
              </Link>
            )}
          </div>
        )}

        {/* Quick Add overlay — shows on hover when picker is NOT open */}
        {inStock && !showSizePicker && (
          <div
            className="product-overlay"
            style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.12)',
              display: 'flex', alignItems: 'flex-end',
              justifyContent: 'center', paddingBottom: 16,
              opacity: hovered ? 1 : 0,
              transition: 'opacity 0.25s ease',
              zIndex: 2,
            }}
          >
            <button
              onClick={handleQuickAdd}
              style={{
                background: added ? '#15803D' : 'white',
                color:      added ? 'white'   : '#1A1A1A',
                border: 'none', borderRadius: 999,
                padding: '10px 24px', fontSize: 13, fontWeight: 500,
                cursor: 'pointer', fontFamily: 'inherit',
                display: 'flex', alignItems: 'center', gap: 6,
                boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
                transition: 'background 0.15s',
              }}
            >
              {added
                ? <><Check size={14} /> Added!</>
                : isCustomOnly ? 'Customize' : 'Quick Add'
              }
            </button>
          </div>
        )}
      </div>

      {/* Product info — clicking name goes to product page */}
      <Link href={href} onClick={handleLinkClick} style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="product-info" style={{ marginTop: 12 }}>
          <p className="product-name" style={{ fontWeight: 500, fontSize: 14 }}>{product.name}</p>
          <p className="product-price" style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
            <span className="product-price-current">{formatPrice(product.price)}</span>
            {product.originalPrice != null && (
              <s style={{ marginLeft: 8, opacity: 0.5 }}>{formatPrice(product.originalPrice)}</s>
            )}
          </p>
          {showDescription && (
            <p className="product-card-desc">
              {product.description || 'Modern essentials in soft tones — designed to feel good and look even better.'}
            </p>
          )}
        </div>
      </Link>
    </div>
  )
}
