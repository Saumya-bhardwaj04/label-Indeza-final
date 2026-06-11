'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import ScrollReveal from '@/components/ScrollReveal'
import HiddenAdminDot from '@/components/HiddenAdminDot'

export default function SiteFooter() {
  const [s, setS] = useState<Record<string, string>>({})
  const [subEmail, setSubEmail] = useState('')
  const [subLoading, setSubLoading] = useState(false)
  const [subMessage, setSubMessage] = useState('')
  const [subError, setSubError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetch('/api/settings?group=social', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => { if (!cancelled) setS(data) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubLoading(true)
    setSubMessage('')
    setSubError('')
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subEmail, source: 'footer' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSubMessage(data.message)
      setSubEmail('')
    } catch (err: any) {
      setSubError(err.message || 'Failed to subscribe')
    } finally {
      setSubLoading(false)
    }
  }

  return (
    <footer className="footer">
      <div className="footer-wave footer-wave--top" aria-hidden>
        <svg viewBox="0 0 1440 56" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
          <path
            className="footer-wave-fill"
            d="M0,28 C120,4 240,52 360,28 S600,4 720,28 S960,52 1080,28 S1320,4 1440,28 L1440,56 L0,56 Z"
          />
        </svg>
      </div>

      <div className="footer-watermark" aria-hidden>
        Label Indeza
      </div>

      <div className="container footer-inner">
        <ScrollReveal className="footer-newsletter">
          <h3 className="footer-newsletter-title">
            Subscribe to our mailing list &amp; Earn 20% off code to your inbox
          </h3>
          <form onSubmit={handleSubscribe}>
            <div className="email-input-wrap footer-email-wrap">
              <input
                type="email"
                value={subEmail}
                onChange={e => setSubEmail(e.target.value)}
                placeholder="Enter Your Email"
                className="email-input"
                aria-label="Email address"
                required
              />
              <button type="submit" className="email-submit" aria-label="Subscribe" disabled={subLoading}>
                {subLoading ? '...' : '→'}
              </button>
            </div>
            {subMessage && <p style={{ color: '#22C55E', fontSize: '13px', marginTop: '8px' }}>{subMessage}</p>}
            {subError && <p style={{ color: '#EF4444', fontSize: '13px', marginTop: '8px' }}>{subError}</p>}
          </form>
          <p className="footer-newsletter-note">
            By joining our email list, you&apos;re saying yes to style updates, cozy vibes, and
            thoughtful emails. We&apos;ll always treat your info with care.
          </p>
        </ScrollReveal>

        <ScrollReveal className="footer-col" delay={0.08}>
          <h5>PRODUCTS</h5>
          <Link href="/shop/women">Women</Link>
          <Link href="/customize">Customize</Link>
          <Link href="/collections">Collections</Link>
          <Link href="/shop/women">Categories</Link>
        </ScrollReveal>
        <ScrollReveal className="footer-col" delay={0.16}>
          <h5>COMPANY</h5>
          <Link href="/about">About us</Link>
          <Link href="/journal">Journal</Link>
          <Link href="/faq">FAQ</Link>
          <Link href="/contact">Contact us</Link>
        </ScrollReveal>
        <ScrollReveal className="footer-col" delay={0.24}>
          <h5>FIND US ON</h5>
          <a href={s.social_instagram || 'https://instagram.com/labelindeza'} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={s.social_whatsapp || 'https://wa.me/919999999999'} target="_blank" rel="noopener noreferrer">
            WhatsApp
          </a>
          <a href={s.social_threads || 'https://threads.net/@labelindeza'} target="_blank" rel="noopener noreferrer">
            Threads
          </a>
          <a href={s.social_facebook || 'https://facebook.com/labelindeza'} target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        </ScrollReveal>
        <ScrollReveal className="footer-col" delay={0.32}>
          <h5>LEGAL</h5>
          <Link href="/legal/terms">Terms &amp; Conditions</Link>
          <Link href="/legal/shipping">Shipping &amp; Returns</Link>
          <Link href="/legal/privacy">Privacy Policy</Link>
          <Link href="/faq">FAQ</Link>
        </ScrollReveal>
      </div>

      <div className="footer-bottom">
        <div className="container footer-bottom-inner" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>© Label Indeza, 2026</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {/* Hidden admin dot — barely visible */}
            <HiddenAdminDot />
            <span>All Right Reserved</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
