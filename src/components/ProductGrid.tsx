'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import ProductCard from '@/components/ProductCard'
import { fadeUp, stagger } from '@/lib/motion'
import type { ProductDTO } from '@/lib/data'

type Props = {
  title?: string
  subtitle?: string
  products: ProductDTO[]
  viewAllHref?: string
  columns?: 4 | 3
  centered?: boolean
  bordered?: boolean
  priceLocale?: 'usd' | 'inr'
  showProductDescription?: boolean
  paginate?: boolean
}

export default function ProductGrid({
  title,
  subtitle,
  products,
  viewAllHref,
  columns = 4,
  centered = true,
  bordered = false,
  priceLocale = 'usd',
  showProductDescription = false,
  paginate = false,
}: Props) {
  const [visibleCount, setVisibleCount] = useState(16)

  if (products.length === 0) return null

  const visibleProducts = paginate ? products.slice(0, visibleCount) : products
  const hasMore = paginate && visibleCount < products.length

  const hasHeader = Boolean(title)
  const sectionClassName = `collection-grid ${hasHeader ? 'section-pad' : 'collection-grid--tight'}${bordered ? ' collection-grid--bordered' : ''}`

  return (
    <section
      id={title?.toLowerCase().replace(/\s+/g, '-')}
      className={sectionClassName}
    >
      <div className="container">
        {title && (
          <motion.div
            className="collection-header"
            style={{
              textAlign: centered ? 'center' : 'left',
              marginBottom: 48,
            }}
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-60px' }}
          >
            <h2 className="section-title">{title}</h2>
            {subtitle && <p className="section-subtitle">{subtitle}</p>}
          </motion.div>
        )}
        <div
          className="product-grid"
          style={columns === 3 ? { gridTemplateColumns: 'repeat(3, 1fr)' } : undefined}
        >
          {visibleProducts.map((p) => (
            <motion.div 
              key={p.id} 
              variants={fadeUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-40px' }}
            >
              <ProductCard
                product={p}
                priceLocale={priceLocale}
                showDescription={showProductDescription || priceLocale === 'usd'}
              />
            </motion.div>
          ))}
        </div>
        {viewAllHref && (
          <motion.div
            className="view-all"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <Link
              href={viewAllHref}
              onClick={() => {
                const sectionId = title?.toLowerCase().replace(/\s+/g, '-') || ''
                if (sectionId) sessionStorage.setItem('last_clicked_section', sectionId)
              }}
            >
              View all →
            </Link>
          </motion.div>
        )}
        
        {hasMore && !viewAllHref && (
          <div style={{ textAlign: 'center', marginTop: 48 }}>
            <button
              onClick={() => setVisibleCount(prev => prev + 16)}
              className="btn-secondary"
              style={{ padding: '12px 32px', fontSize: 14, fontWeight: 500, borderRadius: 999 }}
            >
              Load More
            </button>
          </div>
        )}
      </div>
    </section>
  )
}
