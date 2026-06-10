'use client'
import { useState, useEffect } from 'react'
import { Plus, Trash2 } from 'lucide-react'

const EMPTY_FORM = {
  code: '', type: 'percent' as 'percent' | 'flat',
  value: '', minOrderValue: '', maxUses: '',
  expiresAt: '', description: '',
}

export default function AdminCouponsPage() {
  const [coupons,   setCoupons]   = useState<any[]>([])
  const [showForm,  setShowForm]  = useState(false)
  const [form,      setForm]      = useState(EMPTY_FORM)
  const [saving,    setSaving]    = useState(false)

  const fetchCoupons = () => {
    fetch('/api/admin/coupons').then(r => r.json()).then(setCoupons)
  }

  useEffect(() => { fetchCoupons() }, [])

  const handleCreate = async () => {
    if (!form.code || !form.value) { alert('Code and value are required'); return }
    setSaving(true)
    await fetch('/api/admin/coupons', {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({
        code:          form.code,
        type:          form.type,
        value:         Number(form.value),
        minOrderValue: Number(form.minOrderValue) || 0,
        maxUses:       Number(form.maxUses)       || 0,
        expiresAt:     form.expiresAt ? new Date(form.expiresAt) : undefined,
        description:   form.description,
      }),
    })
    setForm(EMPTY_FORM)
    setShowForm(false)
    setSaving(false)
    fetchCoupons()
  }

  const handleToggle = async (coupon: any) => {
    await fetch(`/api/admin/coupons/${coupon._id}`, {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ active: !coupon.active }),
    })
    fetchCoupons()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this coupon?')) return
    await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' })
    fetchCoupons()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1px solid #E0E0E0', borderRadius: '8px',
    padding: '9px 12px', fontSize: '14px', outline: 'none',
    fontFamily: 'inherit', background: 'white', boxSizing: 'border-box',
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 600 }}>Coupons</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#1A1A1A', color: 'white', border: 'none',
            borderRadius: '10px', padding: '10px 20px', fontSize: '14px',
            fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
          }}
        >
          <Plus size={16} /> {showForm ? 'Cancel' : 'Create Coupon'}
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', border: '1px solid #E8E8E8', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 600, marginBottom: '20px' }}>New Coupon</h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Coupon Code *</label>
              <input style={inputStyle} value={form.code}
                onChange={e => setForm(p => ({ ...p, code: e.target.value.toUpperCase() }))}
                placeholder="e.g. WELCOME20" />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Discount Type *</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value as any }))}>
                <option value="percent">Percentage (%) off</option>
                <option value="flat">Flat (₹) off</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>
                {form.type === 'percent' ? 'Discount % *' : 'Discount ₹ Amount *'}
              </label>
              <input style={inputStyle} type="number" value={form.value}
                onChange={e => setForm(p => ({ ...p, value: e.target.value }))}
                placeholder={form.type === 'percent' ? 'e.g. 20' : 'e.g. 200'} />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Min Order Value (₹)</label>
              <input style={inputStyle} type="number" value={form.minOrderValue}
                onChange={e => setForm(p => ({ ...p, minOrderValue: e.target.value }))}
                placeholder="0 = no minimum" />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Max Uses (0 = unlimited)</label>
              <input style={inputStyle} type="number" value={form.maxUses}
                onChange={e => setForm(p => ({ ...p, maxUses: e.target.value }))}
                placeholder="0" />
            </div>
            <div>
              <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Expiry Date (optional)</label>
              <input style={inputStyle} type="date" value={form.expiresAt}
                onChange={e => setForm(p => ({ ...p, expiresAt: e.target.value }))} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={{ fontSize: '12px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Description (internal note)</label>
              <input style={inputStyle} value={form.description}
                onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                placeholder="e.g. Welcome offer for new subscribers" />
            </div>
          </div>
          <button
            onClick={handleCreate}
            disabled={saving}
            style={{
              background: '#1A1A1A', color: 'white', border: 'none',
              borderRadius: '10px', padding: '12px 28px',
              fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
            }}
          >
            {saving ? 'Creating...' : 'Create Coupon'}
          </button>
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #E8E8E8', overflow: 'hidden' }}>
        {coupons.length === 0 ? (
          <p style={{ padding: '48px', textAlign: 'center', color: '#888' }}>No coupons yet. Create your first one.</p>
        ) : coupons.map((coupon: any, i: number) => (
          <div key={coupon._id} className="coupon-row-item" style={{
            borderBottom: i < coupons.length - 1 ? '1px solid #F5F5F5' : 'none',
          }}>
            <div>
              <span style={{
                fontFamily: 'monospace', fontSize: '15px', fontWeight: 700,
                letterSpacing: '0.05em',
                color: coupon.active ? '#1A1A1A' : '#999',
              }}>
                {coupon.code}
              </span>
            </div>
            <div>
              <div className="coupon-badge-container">
                <span style={{
                  background: coupon.type === 'percent' ? '#DBEAFE' : '#DCFCE7',
                  color:      coupon.type === 'percent' ? '#1D4ED8' : '#15803D',
                  fontSize: '12px', fontWeight: 600, padding: '3px 10px',
                  borderRadius: '999px',
                }}>
                  {coupon.type === 'percent' ? `${coupon.value}% off` : `₹${coupon.value} off`}
                </span>
                {coupon.minOrderValue > 0 && (
                  <span style={{ fontSize: '12px', color: '#888' }}>
                    Min ₹{coupon.minOrderValue}
                  </span>
                )}
              </div>
              {coupon.description && (
                <p style={{ fontSize: '12px', color: '#999', marginTop: '4px', marginBottom: 0 }}>{coupon.description}</p>
              )}
            </div>
            <div className="coupon-stats-container">
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', fontWeight: 500, margin: 0 }}>
                  {coupon.usedCount}{coupon.maxUses > 0 ? ` / ${coupon.maxUses}` : ''}
                </p>
                <p style={{ fontSize: '11px', color: '#999', margin: 0 }}>used</p>
              </div>
              <div>
                {coupon.expiresAt ? (
                  <p style={{ fontSize: '12px', color: new Date(coupon.expiresAt) < new Date() ? '#EF4444' : '#666', margin: 0 }}>
                    {new Date(coupon.expiresAt) < new Date() ? '⚠ Expired' : `Exp: ${new Date(coupon.expiresAt).toLocaleDateString('en-IN')}`}
                  </p>
                ) : (
                  <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>No expiry</p>
                )}
              </div>
            </div>
            <div className="coupon-actions-container">
              <button
                onClick={() => handleToggle(coupon)}
                style={{
                  background: coupon.active ? '#DCFCE7' : '#F5F5F5',
                  color:      coupon.active ? '#15803D' : '#888',
                  border: 'none', borderRadius: '8px',
                  padding: '6px 14px', fontSize: '12px',
                  fontWeight: 600, cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {coupon.active ? 'Active' : 'Inactive'}
              </button>
              <button
                onClick={() => handleDelete(coupon._id)}
                style={{ background: '#FEE2E2', color: '#991B1B', border: 'none', borderRadius: '8px', padding: '7px', cursor: 'pointer' }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
