'use client'
import { useState } from 'react'

export default function AdminSetupPage() {
  const [secret,  setSecret]  = useState('')
  const [email,   setEmail]   = useState('')
  const [name,    setName]    = useState('')
  const [message, setMessage] = useState('')
  const [error,   setError]   = useState('')
  const [loading, setLoading] = useState(false)

  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')
    setError('')
    try {
      const res  = await fetch('/api/admin/invite', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, name, secret }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setMessage(`Invitation sent to ${email}! They can now set their own password.`)
      setEmail('')
      setName('')
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#EFE9DF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '420px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
        <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>Label Indeza</h1>
        <p style={{ color: '#888', fontSize: '14px', marginBottom: '28px' }}>Admin Setup — Invite a new admin</p>

        {message && (
          <div style={{ background: '#DCFCE7', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#15803D', fontSize: '14px' }}>
            ✓ {message}
          </div>
        )}
        {error && (
          <div style={{ background: '#FEE2E2', borderRadius: '10px', padding: '12px 16px', marginBottom: '20px', color: '#991B1B', fontSize: '14px' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleInvite} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px', color: '#555' }}>Setup Secret *</label>
            <input
              type="password"
              value={secret}
              onChange={e => setSecret(e.target.value)}
              placeholder="Enter the ADMIN_SETUP_SECRET from .env"
              required
              style={{ width: '100%', border: '1px solid #E0E0E0', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px', color: '#555' }}>Admin Name *</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. Harsh"
              required
              style={{ width: '100%', border: '1px solid #E0E0E0', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px', color: '#555' }}>Admin Email *</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="harsh@gmail.com"
              required
              style={{ width: '100%', border: '1px solid #E0E0E0', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#1A1A1A', color: 'white', border: 'none',
              borderRadius: '10px', padding: '14px', fontSize: '14px',
              fontWeight: 500, cursor: 'pointer', marginTop: '4px', fontFamily: 'inherit',
            }}
          >
            {loading ? 'Sending invite...' : 'Send Invite Email →'}
          </button>
        </form>

        <p style={{ fontSize: '12px', color: '#999', marginTop: '20px', textAlign: 'center', lineHeight: 1.5 }}>
          The admin will receive an email with a link to set their own password.
          You will never see their password.
        </p>
      </div>
    </div>
  )
}
