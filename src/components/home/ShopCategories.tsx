'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'

const TRUST_BADGES = [
  {
    icon: '🔒',
    bg: '#E8F5E9',
    title: 'Secure Checkout',
    text: 'Your info stays safe with us. All payments are encrypted and protected.',
  },
  {
    icon: '🔄',
    bg: '#FCE4EC',
    title: 'Easy Returns',
    text: 'Changed your mind? No worries — 30 days to send it back, stress-free.',
  },
  {
    icon: '🌍',
    bg: '#E3F2FD',
    title: 'Worldwide Delivery',
    text: 'From our shop to your doorstep. Fast, reliable shipping wherever you are.',
  },
  {
    icon: '💬',
    bg: '#FFFDE7',
    title: 'Here to Help',
    text: "Need something? Our support team's just a message away — always happy to chat.",
  },
]

export default function ShopCategories() {
  const [s, setS] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false
    fetch('/api/settings?group=categories', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => { if (!cancelled) setS(data) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const categories = [
    {
      name: 'Outerwear',
      sub: 'Light, flowy, easy',
      image: s.cat_outwear_image || '/images/cat-outwear.jpg',
      barBg: 'rgba(168, 196, 162, 0.85)',
      href: '/shop/women?category=outwear',
    },
    {
      name: 'Tops',
      sub: 'Cute meets comfy',
      image: s.cat_tops_image || '/images/cat-tops.jpg',
      barBg: 'rgba(245, 197, 213, 0.9)',
      href: '/shop/women?category=tops',
    },
    {
      name: 'Bottoms',
      sub: 'Reached this, always',
      image: s.cat_bottoms_image || '/images/cat-bottoms.jpg',
      barBg: 'rgba(212, 197, 232, 0.9)',
      href: '/shop/women?category=bottoms',
    },
    {
      name: 'Accessories',
      sub: 'Small things, big vibe',
      image: s.cat_accessories_image || '/images/cat-accessories.jpg',
      barBg: 'rgba(245, 230, 168, 0.92)',
      href: '/shop/women?category=accessories',
    },
  ]

  return (
    <>
      <section className="categories section-pad" id="categories">
        <div className="container">
          <ScrollReveal className="categories-header">
            <h2 className="section-title">Shop Categories</h2>
            <p className="section-subtitle">Find exactly what you want</p>
          </ScrollReveal>
          <div className="categories-grid">
            {categories.map((cat, index) => (
              <ScrollReveal key={cat.name} delay={index * 0.08}>
                <Link
                  href={cat.href}
                  className="category-tile"
                  onClick={() => {
                    sessionStorage.setItem('last_clicked_section', 'categories')
                  }}
                >
                  <img src={cat.image} alt={cat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }} />
                  <div className="category-bar" style={{ background: cat.barBg }}>
                    <h3>{cat.name}</h3>
                    <p>{cat.sub}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-badges section-pad">
        <div className="container badges-grid">
          {TRUST_BADGES.map((b, index) => (
            <ScrollReveal key={b.title} delay={index * 0.08}>
              <div className="badge">
                <div className="badge-icon" style={{ background: b.bg }}>
                  {b.icon}
                </div>
                <div>
                  <h4>{b.title}</h4>
                  <p>{b.text}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  )
}
