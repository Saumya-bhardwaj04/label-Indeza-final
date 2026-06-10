'use client'

import { useEffect, useState } from 'react'

export default function SubscribeModal() {
  const [open,    setOpen]    = useState(false)
  const [email,   setEmail]   = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error,   setError]   = useState('')

  useEffect(() => {
    const lastShownKey = 'li_subscribe_last_shown'
    const lastShown = localStorage.getItem(lastShownKey)
    const now = Date.now()
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000

    if (!lastShown || now - parseInt(lastShown, 10) > thirtyDaysMs) {
      const timer = setTimeout(() => {
        setOpen(true)
        localStorage.setItem(lastShownKey, now.toString())
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true); setMessage(''); setError('')
    try {
      const res  = await fetch('/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email: email.trim(), source: 'popup' }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessage(data.message || 'Subscribed! Check your inbox for 20% off.')
      setEmail('')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  return (
    <div className="subscribe-modal open" id="subscribe-modal">
      <div className="subscribe-modal-card">
        <button
          type="button"
          className="modal-close"
          onClick={() => setOpen(false)}
          aria-label="Close"
        >
          ✕
        </button>
        <div className="modal-image">
          <img src="/images/hero-poster.jpg" alt="Subscribe to Label Indeza" />
        </div>
        <div className="modal-content">
          <h2>Get 20% Off Your First Order</h2>
          <p>Join Label Indeza for style updates, new drops, and exclusive offers.</p>
          <form onSubmit={handleSubmit}>
            <div className="email-input-wrap" style={{ marginTop: 24 }}>
              <input
                type="email"
                placeholder="Enter Your Email"
                className="email-input"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="email-submit" disabled={loading}>
                {loading ? '…' : '→'}
              </button>
            </div>
            {message && <p style={{ color: '#15803D', fontSize: '13px', marginTop: '8px' }}>{message}</p>}
            {error   && <p style={{ color: '#EF4444', fontSize: '13px', marginTop: '8px' }}>{error}</p>}
          </form>
          <p style={{ fontSize: 12, color: '#6B6B6B', marginTop: 12 }}>
            No spam, ever. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  )
}
