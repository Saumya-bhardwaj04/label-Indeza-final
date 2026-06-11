'use client'

import { useState, useEffect } from 'react'

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    topic: '',
    message: '',
  })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState('')
  const [s, setS] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/settings?group=social', { cache: 'no-store' })
      .then(r => r.json())
      .then(setS)
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSent(true)
      setForm({ name: '', surname: '', email: '', phone: '', topic: '', message: '' })
      setTimeout(() => {
        setSent(false)
      }, 6500)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setSending(false)
    }
  }

  return (
    <main style={{ marginTop: 64 }}>
      <section className="contact-hero">
        <div className="container contact-hero-inner">
          <div>
            <h1
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                fontSize: 'clamp(40px,5vw,72px)',
                fontWeight: 400,
              }}
            >
              Contact us
            </h1>
            <p
              style={{
                color: 'rgba(0,0,0,0.55)',
                fontSize: 16,
                marginTop: 12,
                maxWidth: 380,
                lineHeight: 1.6,
              }}
            >
              We&apos;re here for you — reach out about orders, sizing, collaborations, or anything
              else on your mind.
            </p>
          </div>
          <img
            src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=500"
            alt="Contact Label Indeza"
            className="contact-hero-img"
          />
        </div>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div className="container contact-layout-grid">
          <div className="contact-sidebar">
            <p
              style={{
                fontWeight: 600,
                fontSize: 14,
                marginBottom: 16,
                paddingBottom: 12,
                borderBottom: '1px solid #E0E0E0',
              }}
            >
              Contacts
            </p>
            <a href="#contacts" style={{ display: 'block', fontSize: 14, color: '#6B6B6B', marginBottom: 12 }}>
              Contacts
            </a>
            <a href="#message" style={{ display: 'block', fontSize: 14, color: '#6B6B6B' }}>
              Send a message
            </a>
          </div>

          <div>
            <div id="contacts" style={{ marginBottom: 64 }}>
              <h2
                style={{
                  fontWeight: 600,
                  fontSize: 18,
                  paddingBottom: 20,
                  borderBottom: '1px solid #E8E8E8',
                }}
              >
                Contacts
              </h2>

              <div
                style={{
                  padding: '24px 0',
                  borderBottom: '1px solid #F0F0F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <p style={{ fontWeight: 500, marginBottom: 4 }}>Call us</p>
                  <p style={{ color: '#6B6B6B', fontSize: 15 }}>{s.contact_phone || '+91 99999 99999'}</p>
                </div>
              </div>

              <div
                style={{
                  padding: '24px 0',
                  borderBottom: '1px solid #F0F0F0',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                  gap: '16px',
                }}
              >
                <div>
                  <p style={{ fontWeight: 500, marginBottom: 4 }}>Chat on WhatsApp</p>
                  <p style={{ color: '#6B6B6B', fontSize: 15 }}>{s.contact_phone || '+91 99999 99999'}</p>
                </div>
                <a
                  href={s.social_whatsapp || 'https://wa.me/919999999999'}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    border: '1.5px solid #1A1A1A',
                    borderRadius: 999,
                    padding: '10px 24px',
                    fontSize: 14,
                    fontWeight: 500,
                    textDecoration: 'none',
                    color: '#1A1A1A',
                  }}
                >
                  Chat →
                </a>
              </div>

              <div style={{ padding: '24px 0', borderBottom: '1px solid #F0F0F0' }}>
                <p style={{ fontWeight: 500, marginBottom: 4 }}>Send an email</p>
                <a
                  href={`mailto:${s.contact_email || 'labelindeza@gmail.com'}`}
                  style={{ color: '#6B6B6B', fontSize: 15, textDecoration: 'none', wordBreak: 'break-all' }}
                >
                  {s.contact_email || 'labelindeza@gmail.com'}
                </a>
              </div>
            </div>

            <div id="message">
              <h2 style={{ fontWeight: 600, fontSize: 18, marginBottom: 28 }}>Send a Message</h2>

              {sent && (
                <div
                  style={{
                    background: '#E8F5E9',
                    borderRadius: 10,
                    padding: '16px 20px',
                    marginBottom: 24,
                    color: '#2E7D32',
                    fontSize: 14,
                  }}
                >
                  Message sent! We&apos;ll get back to you within 24 hours.
                </div>
              )}

              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div className="contact-form-row">
                  {(['name', 'surname'] as const).map((field) => (
                    <input
                      key={field}
                      type="text"
                      placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                      value={form[field]}
                      onChange={(e) => setForm((p) => ({ ...p, [field]: e.target.value }))}
                      style={{
                        border: '1px solid #E0E0E0',
                        borderRadius: 10,
                        padding: '14px 16px',
                        fontSize: 14,
                        outline: 'none',
                        fontFamily: 'inherit',
                        width: '100%',
                        boxSizing: 'border-box',
                      }}
                    />
                  ))}
                </div>
                <input
                  type="email"
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
                  required
                  style={{
                    border: '1px solid #E0E0E0',
                    borderRadius: 10,
                    padding: '14px 16px',
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: 'inherit',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
                <input
                  type="tel"
                  placeholder="Phone Number"
                  value={form.phone}
                  maxLength={10}
                  onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value.replace(/\D/g, '').slice(0, 10) }))}
                  style={{
                    border: '1px solid #E0E0E0',
                    borderRadius: 10,
                    padding: '14px 16px',
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: 'inherit',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
                <select
                  value={form.topic}
                  onChange={(e) => setForm((p) => ({ ...p, topic: e.target.value }))}
                  style={{
                    border: '1px solid #E0E0E0',
                    borderRadius: 10,
                    padding: '14px 16px',
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: 'inherit',
                    color: form.topic ? '#1A1A1A' : '#999',
                    background: 'white',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                >
                  <option value="" disabled>
                    I need help about...
                  </option>
                  <option value="order">My Order</option>
                  <option value="returns">Returns & Refunds</option>
                  <option value="sizing">Sizing</option>
                  <option value="collab">Collaboration</option>
                  <option value="other">Other</option>
                </select>
                <textarea
                  placeholder="Message"
                  value={form.message}
                  onChange={(e) => setForm((p) => ({ ...p, message: e.target.value }))}
                  rows={5}
                  style={{
                    border: '1px solid #E0E0E0',
                    borderRadius: 10,
                    padding: '14px 16px',
                    fontSize: 14,
                    outline: 'none',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    width: '100%',
                    boxSizing: 'border-box',
                  }}
                />
                <button
                  type="submit"
                  disabled={sending}
                  style={{
                    background: '#1A1A1A',
                    color: 'white',
                    border: 'none',
                    borderRadius: 999,
                    padding: 16,
                    fontSize: 15,
                    fontWeight: 500,
                    cursor: sending ? 'not-allowed' : 'pointer',
                    opacity: sending ? 0.7 : 1,
                  }}
                >
                  {sending ? 'Sending...' : 'Submit'}
                </button>
                {error && <p style={{ color: '#EF4444', fontSize: '13px', marginTop: '12px' }}>{error}</p>}
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
