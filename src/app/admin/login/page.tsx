'use client'

import { signIn } from 'next-auth/react'
import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setLoading(true)
    setError('')
    const res = await signIn('credentials', {
      email,
      password,
      redirect: false,
    })
    if (res?.error) {
      setError('Invalid email or password')
      setLoading(false)
    } else {
      router.push('/admin/orders')
    }
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#EFE9DF',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'system-ui',
      }}
    >
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 48 }}>Label Indeza</h1>
      <div
        style={{
          background: 'white',
          borderRadius: 16,
          padding: '40px 32px',
          width: 420,
          boxShadow: '0 2px 16px rgba(0,0,0,0.06)',
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 600, marginBottom: 8 }}>Admin Sign In</h2>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 28 }}>Sign in to manage Label Indeza</p>
        {error && <p style={{ color: 'red', fontSize: 13, marginBottom: 16 }}>{error}</p>}
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div style={{ border: '1px solid #E0E0E0', borderRadius: 10, padding: '10px 16px' }}>
            <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 4 }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15 }}
              placeholder="admin@labelindeza.com"
              required
            />
          </div>
          <div style={{ border: '1px solid #E0E0E0', borderRadius: 10, padding: '10px 16px' }}>
            <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 4 }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15 }}
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{
              background: '#1A1A1A',
              color: 'white',
              border: 'none',
              borderRadius: 10,
              padding: '14px',
              fontSize: 15,
              fontWeight: 500,
              cursor: loading ? 'not-allowed' : 'pointer',
              marginTop: 8,
              opacity: loading ? 0.6 : 1,
              pointerEvents: loading ? 'none' : 'auto',
            }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
      </div>
    </div>
  )
}
