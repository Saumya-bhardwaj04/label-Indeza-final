'use client'
import { useState, useEffect } from 'react'

export default function AdminSubscribersPage() {
  const [subs, setSubs] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/admin/subscribers').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setSubs(data)
    })
  }, [])

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>
        Subscribers ({subs.length})
      </h1>
      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
        {subs.map((s, i) => (
          <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 24px', borderBottom: i < subs.length - 1 ? '1px solid #F5F5F5' : 'none', fontSize: '14px' }}>
            <span>{s.email}</span>
            <span style={{ color: '#888', fontSize: '12px' }}>{new Date(s.subscribedAt).toLocaleDateString('en-IN')}</span>
          </div>
        ))}
        {subs.length === 0 && <p style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No subscribers yet.</p>}
      </div>
    </div>
  )
}
