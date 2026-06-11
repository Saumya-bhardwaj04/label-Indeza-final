'use client'

import { useEffect, useState } from 'react'

export default function SubscribeModal() {
  const [open,    setOpen]    = useState(false)
  const [mode,        setMode]        = useState<'newsletter' | 'notify'>('newsletter')
  const [productName, setProductName] = useState('')
  const [email,       setEmail]       = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error,   setError]   = useState('')

  useEffect(() => {
    const handleOpen = (e: any) => {
      if (e.detail?.mode === 'notify') {
        setMode('notify')
        setProductName(e.detail?.product || '')
      } else {
        setMode('newsletter')
        setProductName('')
      }
      setOpen(true)
    }
    window.addEventListener('open-subscribe', handleOpen)

    const lastShownKey = 'li_subscribe_last_shown'
    const lastShown = localStorage.getItem(lastShownKey)
    const now = Date.now()
    const thirtyDaysMs = 30 * 24 * 60 * 60 * 1000

    if (!lastShown || now - parseInt(lastShown, 10) > thirtyDaysMs) {
      const timer = setTimeout(() => {
        setOpen(true)
        localStorage.setItem(lastShownKey, now.toString())
      }, 3000)
      return () => {
        clearTimeout(timer)
        window.removeEventListener('open-subscribe', handleOpen)
      }
    }
    return () => window.removeEventListener('open-subscribe', handleOpen)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true); setMessage(''); setError('')
    try {
      const res  = await fetch('/api/subscribe', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ 
          email: email.trim(), 
          source: mode === 'notify' ? `Waitlist: ${productName}` : 'popup' 
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      
      let finalMessage = ''
      if (mode === 'notify') {
        finalMessage = data.message === 'You are already subscribed!' 
          ? 'You are already on the waitlist!' 
          : 'You are on the list! We will notify you.'
      } else {
        finalMessage = data.message || 'Subscribed! Check your inbox for your 20% off code.'
      }
      
      setMessage(finalMessage)
      setEmail('')
      
      setTimeout(() => {
        setOpen(false)
        setTimeout(() => {
          setMessage('')
          setMode('newsletter')
        }, 300)
      }, 5000)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  if (!open) return null

  const isNotify = mode === 'notify'
  const title = isNotify ? 'Notify Me When Available' : 'Get 20% Off Your First Order'
  const description = isNotify 
    ? 'Enter your email to join the waitlist for this piece. We\'ll email you the moment it\'s restocked.' 
    : 'Join Label Indeza for style updates, new drops, and exclusive offers.'

  return (
    <div className="subscribe-modal open" id="subscribe-modal">
      <div className="subscribe-modal-card">
        <button
          type="button"
          className="modal-close"
          onClick={() => { 
            setOpen(false); 
            setTimeout(() => {
              setMode('newsletter');
              setMessage('');
              setError('');
            }, 300) 
          }}
          aria-label="Close"
        >
          ✕
        </button>
        <div className="modal-image">
          <img src="/images/hero-poster.jpg" alt={isNotify ? 'Restock Notification' : 'Subscribe to Label Indeza'} />
        </div>
        <div className="modal-content">
          <h2>{title}</h2>
          <p>{description}</p>
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
