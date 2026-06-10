'use client'

import { useState, useEffect, useCallback } from 'react'

const PROVIDER_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  google: { label: 'Google',    color: '#1D4ED8', bg: '#EFF6FF' },
  email:  { label: 'Email OTP', color: '#15803D', bg: '#F0FDF4' },
  both:   { label: 'Linked',    color: '#7C3AED', bg: '#F5F3FF' },
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<any[]>([])
  const [loading,   setLoading]   = useState(true)
  const [query,     setQuery]     = useState('')
  const [debouncedQ, setDebouncedQ] = useState('')

  // Debounce search
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQ(query), 300)
    return () => clearTimeout(t)
  }, [query])

  const fetchCustomers = useCallback(async (q: string) => {
    setLoading(true)
    try {
      const url = q ? `/api/admin/customers?q=${encodeURIComponent(q)}` : '/api/admin/customers'
      const res  = await fetch(url)
      const data = await res.json()
      setCustomers(Array.isArray(data) ? data : [])
    } catch {
      setCustomers([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchCustomers(debouncedQ) }, [debouncedQ, fetchCustomers])

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Customers</h1>
          <p style={{ color: '#888', fontSize: 14, margin: '4px 0 0' }}>
            {loading ? 'Loading…' : `${customers.length} customer${customers.length !== 1 ? 's' : ''}`}
          </p>
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', maxWidth: 400, marginBottom: 24 }}>
        <svg
          width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#999" strokeWidth="2"
          style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}
        >
          <circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" />
        </svg>
        <input
          type="text"
          placeholder="Search by name or email…"
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 14px 10px 40px',
            border: '1px solid #E0E0E0',
            borderRadius: 10,
            fontSize: 14,
            outline: 'none',
            boxSizing: 'border-box',
          }}
        />
      </div>

      {/* Table */}
      <div style={{ background: 'white', borderRadius: 14, border: '1px solid #F0EDE8', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '600px' }}>
            <thead>
            <tr style={{ background: '#FAF8F5', borderBottom: '1px solid #F0EDE8' }}>
              {['Customer', 'Email', 'Login Method', 'Joined'].map(h => (
                <th
                  key={h}
                  style={{
                    padding: '12px 20px',
                    textAlign: 'left',
                    fontSize: 12,
                    fontWeight: 600,
                    color: '#888',
                    textTransform: 'uppercase',
                    letterSpacing: '0.05em',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading && (
              <tr>
                <td colSpan={4} style={{ padding: '48px 20px', textAlign: 'center', color: '#888', fontSize: 14 }}>
                  Loading customers…
                </td>
              </tr>
            )}
            {!loading && customers.length === 0 && (
              <tr>
                <td colSpan={4} style={{ padding: '48px 20px', textAlign: 'center', color: '#888', fontSize: 14 }}>
                  {query ? 'No customers match your search.' : 'No customers yet.'}
                </td>
              </tr>
            )}
            {!loading && customers.map((c, i) => {
              const p = PROVIDER_LABELS[c.provider] || PROVIDER_LABELS.email
              const initials = (c.name || 'C').split(' ').map((w: string) => w[0]).join('').slice(0, 2).toUpperCase()
              return (
                <tr
                  key={c._id}
                  style={{
                    borderBottom: i < customers.length - 1 ? '1px solid #F7F5F2' : 'none',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#FAFAF9')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Name + avatar */}
                  <td style={{ padding: '14px 20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      {c.image ? (
                        <img
                          src={c.image}
                          alt={c.name}
                          referrerPolicy="no-referrer"
                          style={{ width: 36, height: 36, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
                        />
                      ) : (
                        <div style={{
                          width: 36, height: 36, borderRadius: '50%', background: '#1A1A1A',
                          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                          fontSize: 13, fontWeight: 600, flexShrink: 0,
                        }}>
                          {initials}
                        </div>
                      )}
                      <span style={{ fontSize: 14, fontWeight: 500 }}>{c.name || '—'}</span>
                    </div>
                  </td>

                  {/* Email */}
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#555' }}>{c.email}</td>

                  {/* Provider badge */}
                  <td style={{ padding: '14px 20px' }}>
                    <span style={{
                      fontSize: 12, fontWeight: 600, padding: '3px 10px',
                      borderRadius: 999, background: p.bg, color: p.color,
                      whiteSpace: 'nowrap',
                    }}>
                      {p.label}
                    </span>
                  </td>

                  {/* Join date */}
                  <td style={{ padding: '14px 20px', fontSize: 13, color: '#888' }}>
                    {c.createdAt ? formatDate(c.createdAt) : '—'}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
        </div>
      </div>
    </div>
  )
}
