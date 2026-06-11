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
          <div key={s._id} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 24px', borderBottom: i < subs.length - 1 ? '1px solid #F5F5F5' : 'none', fontSize: '14px', alignItems: 'center' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <span style={{ fontWeight: 500 }}>{s.email}</span>
              {s.source && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {s.source.split(' | ').map((tag: string, idx: number) => {
                    const isWaitlist = tag.startsWith('Waitlist')
                    return (
                      <span key={idx} style={{ 
                        fontSize: '11px', 
                        color: isWaitlist ? '#B45309' : '#15803D', 
                        fontWeight: 600, 
                        background: isWaitlist ? '#FEF3C7' : '#DCFCE7', 
                        padding: '2px 8px', 
                        borderRadius: '4px', 
                        width: 'fit-content' 
                      }}>
                        {tag}
                      </span>
                    )
                  })}
                </div>
              )}
            </div>
            <span style={{ color: '#888', fontSize: '12px' }}>{new Date(s.subscribedAt).toLocaleDateString('en-IN')}</span>
          </div>
        ))}
        {subs.length === 0 && <p style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No subscribers yet.</p>}
      </div>
    </div>
  )
}
