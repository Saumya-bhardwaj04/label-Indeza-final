'use client'
import { useState, useEffect } from 'react'

export default function AdminMessagesPage() {
  const [messages, setMessages] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/messages').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setMessages(data)
    })
  }, [])

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>
        Messages ({messages.length})
      </h1>
      <div className={`admin-split-layout ${selected ? 'has-selected' : ''}`}>
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
          {messages.map((msg, i) => (
            <div
              key={msg._id}
              onClick={() => setSelected(msg)}
              style={{
                padding: '16px 20px', cursor: 'pointer',
                borderBottom: i < messages.length - 1 ? '1px solid #F5F5F5' : 'none',
                background: selected?._id === msg._id ? '#F9F7F4' : 'white',
                borderLeft: !msg.read ? '3px solid #1A1A1A' : '3px solid transparent',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ fontWeight: msg.read ? 400 : 600, fontSize: '14px' }}>{msg.name} {msg.surname}</span>
                <span style={{ fontSize: '12px', color: '#888' }}>{new Date(msg.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              <p style={{ margin: 0, fontSize: '13px', color: '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.message}</p>
            </div>
          ))}
          {messages.length === 0 && <p style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No messages yet.</p>}
        </div>
        {selected && (
          <div className="admin-detail-modal-backdrop" onClick={() => setSelected(null)}>
            <div className="admin-detail-modal-card" onClick={e => e.stopPropagation()}>
              <button
                className="admin-detail-modal-close"
                onClick={() => setSelected(null)}
                style={{
                  position: 'absolute',
                  top: '16px',
                  right: '16px',
                  background: '#F5F5F5',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  border: 'none',
                  color: '#666',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  zIndex: 10,
                }}
              >
                ✕
              </button>
              <h3 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px', paddingRight: '30px' }}>{selected.name} {selected.surname}</h3>
              <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>📧 {selected.email}</p>
              {selected.phone && <p style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>📱 {selected.phone}</p>}
              {selected.topic && <p style={{ fontSize: '13px', color: '#666', marginBottom: '16px' }}>Topic: {selected.topic}</p>}
              <div style={{ background: '#F9F7F4', borderRadius: '10px', padding: '16px', fontSize: '14px', lineHeight: 1.7 }}>
                {selected.message}
              </div>
              <button
                onClick={() => {
                  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selected.email)}&su=${encodeURIComponent('Regarding your Message - Label Indeza')}`
                  window.open(gmailUrl, '_blank')
                }}
                style={{
                  display: 'inline-block',
                  marginTop: '16px',
                  background: '#1A1A1A',
                  color: 'white',
                  padding: '10px 20px',
                  borderRadius: '8px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: 500,
                }}
              >
                Reply via Email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
