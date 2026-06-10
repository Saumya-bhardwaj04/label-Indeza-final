'use client'
import { useState, useEffect } from 'react'

const STATUS_COLORS: Record<string, { color: string; bg: string }> = {
  new:       { color: '#B45309', bg: '#FEF3C7' },
  reviewed:  { color: '#1D4ED8', bg: '#DBEAFE' },
  quoted:    { color: '#6D28D9', bg: '#EDE9FE' },
  confirmed: { color: '#15803D', bg: '#DCFCE7' },
  rejected:  { color: '#991B1B', bg: '#FEE2E2' },
}

export default function AdminBespokePage() {
  const [requests, setRequests] = useState<any[]>([])
  const [selected, setSelected] = useState<any>(null)

  useEffect(() => {
    fetch('/api/admin/bespoke').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setRequests(data)
    })
  }, [])

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '24px' }}>
        Bespoke Requests ({requests.length})
      </h1>
      <div className={`admin-split-layout ${selected ? 'has-selected' : ''}`}>
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
          {requests.map((req, i) => {
            const sc = STATUS_COLORS[req.status] || STATUS_COLORS.new
            return (
              <div
                key={req._id}
                onClick={() => setSelected(req)}
                style={{
                  padding: '16px 20px', cursor: 'pointer',
                  borderBottom: i < requests.length - 1 ? '1px solid #F5F5F5' : 'none',
                  background: selected?._id === req._id ? '#F9F7F4' : 'white',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 600, fontSize: '14px' }}>{req.name}</span>
                  <span style={{
                    fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '999px',
                    color: sc.color, background: sc.bg, textTransform: 'capitalize',
                  }}>{req.status}</span>
                </div>
                <p style={{ margin: 0, fontSize: '13px', color: '#666' }}>
                  {req.garmentType} · {req.occasion} · {req.budgetRange}
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#999' }}>
                  {new Date(req.createdAt).toLocaleDateString('en-IN')}
                </p>
              </div>
            )
          })}
          {requests.length === 0 && <p style={{ padding: '40px', textAlign: 'center', color: '#888' }}>No bespoke requests yet.</p>}
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
              <h3 style={{ fontSize: '18px', fontWeight: 600, marginBottom: '20px', paddingRight: '30px' }}>{selected.name}</h3>
              <div className="admin-details-grid" style={{ marginBottom: '20px' }}>
                <div>
                  <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Email</p>
                  <p style={{ fontSize: '14px' }}>{selected.email}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Phone</p>
                  <p style={{ fontSize: '14px' }}>{selected.phone}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Occasion</p>
                  <p style={{ fontSize: '14px' }}>{selected.occasion}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Garment Type</p>
                  <p style={{ fontSize: '14px' }}>{selected.garmentType}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Budget</p>
                  <p style={{ fontSize: '14px' }}>{selected.budgetRange}</p>
                </div>
                <div>
                  <p style={{ fontSize: '11px', color: '#999', marginBottom: '4px' }}>Timeline</p>
                  <p style={{ fontSize: '14px' }}>{selected.timeline}</p>
                </div>
              </div>

              {(selected.colors || selected.fabric || selected.embroidery) && (
                <div style={{ background: '#F9F7F4', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                  {selected.colors && <p style={{ fontSize: '13px', marginBottom: '4px' }}><strong>Colors:</strong> {selected.colors}</p>}
                  {selected.fabric && <p style={{ fontSize: '13px', marginBottom: '4px' }}><strong>Fabric:</strong> {selected.fabric}</p>}
                  {selected.embroidery && <p style={{ fontSize: '13px' }}><strong>Embroidery:</strong> {selected.embroidery}</p>}
                </div>
              )}

              {selected.measurements && (selected.measurements.bust || selected.measurements.waist) && (
                <div style={{ background: '#FEF3C7', borderRadius: '10px', padding: '16px', marginBottom: '16px' }}>
                  <p style={{ fontSize: '12px', fontWeight: 600, color: '#92400E', marginBottom: '8px' }}>📏 Measurements</p>
                  <div className="admin-details-grid" style={{ gap: '8px' }}>
                    {selected.measurements.bust && <p style={{ fontSize: '13px', color: '#78350F' }}>Bust: {selected.measurements.bust}</p>}
                    {selected.measurements.waist && <p style={{ fontSize: '13px', color: '#78350F' }}>Waist: {selected.measurements.waist}</p>}
                    {selected.measurements.hip && <p style={{ fontSize: '13px', color: '#78350F' }}>Hip: {selected.measurements.hip}</p>}
                    {selected.measurements.height && <p style={{ fontSize: '13px', color: '#78350F' }}>Height: {selected.measurements.height}</p>}
                  </div>
                </div>
              )}

              {selected.additionalNotes && (
                <div style={{ background: '#F9F7F4', borderRadius: '10px', padding: '16px', marginBottom: '16px', fontSize: '14px', lineHeight: 1.7 }}>
                  <strong>Notes:</strong> {selected.additionalNotes}
                </div>
              )}

              <button
                onClick={() => {
                  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selected.email)}&su=${encodeURIComponent('Regarding your Bespoke Request - Label Indeza')}`
                  window.open(gmailUrl, '_blank')
                }}
                style={{
                  display: 'inline-block',
                  marginTop: '8px',
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
