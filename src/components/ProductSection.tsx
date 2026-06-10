'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import ProductGrid from './ProductGrid'
import {
  FALLBACK_PASTEL,
  FALLBACK_SUMMER,
  pickHomeProducts,
} from '@/lib/home-assets'

interface Props {
  title: string
  subtitle: string
  collection?: string
  featured?: boolean
  limit?: number
  viewAllHref: string
  bordered?: boolean
  showProductDescription?: boolean
}

export default function ProductSection({
  title,
  subtitle,
  collection,
  featured,
  limit = 4,
  viewAllHref,
  bordered = false,
  showProductDescription = false,
}: Props) {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const pathname = usePathname()

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const params = new URLSearchParams()
    if (collection) params.set('collection', collection)
    if (featured) params.set('featured', 'true')
    params.set('limit', limit.toString())

    fetch(`/api/products?${params.toString()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        if (!cancelled) {
          const list = Array.isArray(data) ? data : []
          const fallback = collection === 'pastel-dreams' ? FALLBACK_PASTEL : FALLBACK_SUMMER
          const items = pickHomeProducts(list, fallback)
          setProducts(items)
          setLoading(false)
        }
      })
      .catch((e) => {
        console.error('Failed to fetch products', e)
        if (!cancelled) {
          const fallback = collection === 'pastel-dreams' ? FALLBACK_PASTEL : FALLBACK_SUMMER
          const items = pickHomeProducts([], fallback)
          setProducts(items)
          setLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [collection, featured, limit, pathname]) // ← pathname forces re-fetch on back-navigation

  if (loading && products.length === 0) {
    return (
      <section className={`collection-grid section-pad${bordered ? ' collection-grid--bordered' : ''}`}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '48px' }}>
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </div>
          <div className="product-grid">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                style={{
                  aspectRatio: '3/4',
                  borderRadius: '16px',
                  background: 'linear-gradient(90deg, #f0f0f0 25%, #e8e8e8 50%, #f0f0f0 75%)',
                  backgroundSize: '200% 100%',
                  animation: 'shimmer 1.5s infinite',
                }}
              />
            ))}
          </div>
        </div>
      </section>
    )
  }

  return (
    <ProductGrid
      title={title}
      subtitle={subtitle}
      products={products}
      viewAllHref={viewAllHref}
      bordered={bordered}
      showProductDescription={showProductDescription}
    />
  )
}
