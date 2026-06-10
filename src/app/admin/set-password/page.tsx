'use client'
import { useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Suspense } from 'react'

function SetPasswordForm() {
  const params   = useSearchParams()
  const router   = useRouter()
  const token    = params.get('token') || ''

  const [password,  setPassword]  = useState('')
  const [confirm,   setConfirm]   = useState('')
  const [loading,   setLoading]   = useState(false)
  const [error,     setError]     = useState('')
  const [success,   setSuccess]   = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password.length < 8) { setError('Password must be at least 8 characters'); return }
    if (password !== confirm) { setError('Passwords do not match'); return }

    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/admin/set-password', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ token, password }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(true)
      setTimeout(() => router.push('/admin/login'), 2000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ background: 'white', borderRadius: '20px', padding: '40px', width: '100%', maxWidth: '400px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, marginBottom: '6px' }}>Label Indeza</h1>
      <p style={{ color: '#888', fontSize: '14px', marginBottom: '28px' }}>Set your admin password</p>

      {success ? (
        <div style={{ background: '#DCFCE7', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
          <p style={{ color: '#15803D', fontWeight: 600 }}>✓ Password set successfully!</p>
          <p style={{ color: '#15803D', fontSize: '13px', marginTop: '8px' }}>Redirecting to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>New Password *</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="Min 8 characters"
              required
              style={{ width: '100%', border: '1px solid #E0E0E0', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
          <div>
            <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Confirm Password *</label>
            <input
              type="password"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              placeholder="Repeat password"
              required
              style={{ width: '100%', border: '1px solid #E0E0E0', borderRadius: '10px', padding: '11px 14px', fontSize: '14px', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>
          {error && <p style={{ color: '#EF4444', fontSize: '13px' }}>{error}</p>}
          <button type="submit" disabled={loading}
            style={{ background: '#1A1A1A', color: 'white', border: 'none', borderRadius: '10px', padding: '14px', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}>
            {loading ? 'Setting password...' : 'Set Password →'}
          </button>
        </form>
      )}
    </div>
  )
}

export default function SetPasswordPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#EFE9DF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui', padding: '24px' }}>
      <Suspense fallback={<p>Loading...</p>}>
        <SetPasswordForm />
      </Suspense>
    </div>
  )
}
