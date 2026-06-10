'use client'
import { useState } from 'react'

const OCCASIONS     = ['Wedding', 'Engagement', 'Festive / Eid', 'Party', 'Casual', 'Other']
const GARMENT_TYPES = ['Lehenga Set', 'Anarkali', 'Saree & Blouse', 'Kurta Set', 'Sharara Set', 'Co-ord Set', 'Other']
const BUDGETS       = ['₹2,000 – ₹5,000', '₹5,000 – ₹10,000', '₹10,000 – ₹20,000', '₹20,000 – ₹50,000', '₹50,000+']
const TIMELINES     = ['2–3 weeks', '1 month', '2 months', '3+ months', 'No rush']

export default function CustomizePage() {
  const [step,    setStep]    = useState(1)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error,   setError]   = useState('')

  const [form, setForm] = useState({
    name: '', email: '', phone: '',
    occasion: '', garmentType: '',
    colors: '', fabric: '', embroidery: '',
    budgetRange: '', timeline: '',
    measurements: { bust: '', waist: '', hip: '', height: '' },
    additionalNotes: '',
  })

  const setField = (field: string, value: string) =>
    setForm(prev => ({ ...prev, [field]: value }))

  const setMeasurement = (field: string, value: string) =>
    setForm(prev => ({ ...prev, measurements: { ...prev.measurements, [field]: value } }))

  const handleSubmit = async () => {
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/bespoke', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      setSuccess(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', border: '1px solid #E0E0E0', borderRadius: '10px',
    padding: '12px 14px', fontSize: '14px', outline: 'none',
    fontFamily: 'inherit', boxSizing: 'border-box',
    background: 'white',
  }

  const chipStyle = (active: boolean): React.CSSProperties => ({
    padding: '8px 18px', borderRadius: '999px', fontSize: '13px',
    fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit',
    background: active ? '#1A1A1A' : 'white',
    color:      active ? 'white'   : '#555',
    border:     active ? 'none'    : '1px solid #E0E0E0',
    transition: 'all 0.15s',
  })

  if (success) {
    return (
      <main style={{ minHeight: '100vh', background: '#FAF8F5', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 24px' }}>
        <div style={{ textAlign: 'center', maxWidth: '480px' }}>
          <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 24px', fontSize: '32px' }}>
            ✓
          </div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '36px', fontWeight: 400, marginBottom: '12px' }}>
            Request Submitted!
          </h2>
          <p style={{ color: '#555', lineHeight: 1.7, marginBottom: '32px' }}>
            Thank you! Our design team will review your request and get back to you within 48 hours with a personalised quote.
          </p>
          <a href="/" style={{ background: '#1A1A1A', color: 'white', padding: '14px 32px', borderRadius: '999px', textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
            Back to Store
          </a>
        </div>
      </main>
    )
  }

  return (
    <main style={{ minHeight: '100vh', background: '#FAF8F5' }}>
      {/* Hero */}
      <section style={{ background: 'linear-gradient(135deg, #E8B4C8 0%, #F5E6EE 100%)', padding: '120px 0 60px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px,5vw,64px)', fontWeight: 400, marginBottom: '12px' }}>
          Bespoke Order
        </h1>
        <p style={{ color: 'rgba(0,0,0,0.55)', fontSize: '17px', maxWidth: '480px', margin: '0 auto' }}>
          Dream it. We&apos;ll stitch it. Tell us exactly what you want and we&apos;ll craft it to perfection.
        </p>
        {/* Step indicator */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '32px' }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: step >= s ? '#1A1A1A' : 'rgba(0,0,0,0.15)',
                color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '13px', fontWeight: 600,
              }}>{s}</div>
              {s < 3 && <div style={{ width: 40, height: 1, background: step > s ? '#1A1A1A' : 'rgba(0,0,0,0.2)' }} />}
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', marginTop: '8px', fontSize: '12px', color: 'rgba(0,0,0,0.5)' }}>
          <span>Your Details</span>
          <span>Design Vision</span>
          <span>Measurements</span>
        </div>
      </section>

      {/* Form */}
      <section style={{ padding: '60px 0 100px' }}>
        <div className="container" style={{ maxWidth: '640px' }}>
          <div style={{ background: 'white', borderRadius: '20px', padding: '40px', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

            {/* STEP 1 */}
            {step === 1 && (
              <>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 400, marginBottom: '28px' }}>
                  Your Details
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Full Name *</label>
                    <input style={inputStyle} value={form.name} onChange={e => setField('name', e.target.value)} placeholder="Priya Sharma" />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Email *</label>
                    <input style={inputStyle} type="email" value={form.email} onChange={e => setField('email', e.target.value)} placeholder="priya@email.com" />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>WhatsApp Number *</label>
                    <input style={inputStyle} type="tel" value={form.phone} maxLength={10} onChange={e => setField('phone', e.target.value.replace(/\D/g, '').slice(0, 10))} placeholder="9876543210" />
                  </div>
                </div>
              </>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 400, marginBottom: '28px' }}>
                  Design Vision
                </h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '10px' }}>Occasion *</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {OCCASIONS.map(o => (
                        <button key={o} type="button" onClick={() => setField('occasion', o)} style={chipStyle(form.occasion === o)}>{o}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '10px' }}>Garment Type *</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {GARMENT_TYPES.map(g => (
                        <button key={g} type="button" onClick={() => setField('garmentType', g)} style={chipStyle(form.garmentType === g)}>{g}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Preferred Colors</label>
                    <input style={inputStyle} value={form.colors} onChange={e => setField('colors', e.target.value)} placeholder="e.g. Royal blue and gold, Soft pink..." />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Fabric Preference</label>
                    <input style={inputStyle} value={form.fabric} onChange={e => setField('fabric', e.target.value)} placeholder="e.g. Georgette, Silk, Cotton, No preference" />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Embroidery / Work</label>
                    <input style={inputStyle} value={form.embroidery} onChange={e => setField('embroidery', e.target.value)} placeholder="e.g. Zari border, Mirror work, Minimal, None" />
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '10px' }}>Budget Range *</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {BUDGETS.map(b => (
                        <button key={b} type="button" onClick={() => setField('budgetRange', b)} style={chipStyle(form.budgetRange === b)}>{b}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '10px' }}>Timeline Needed *</label>
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                      {TIMELINES.map(t => (
                        <button key={t} type="button" onClick={() => setField('timeline', t)} style={chipStyle(form.timeline === t)}>{t}</button>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '28px', fontWeight: 400, marginBottom: '8px' }}>
                  Your Measurements
                </h2>
                <p style={{ color: '#888', fontSize: '14px', marginBottom: '24px' }}>
                  In inches. Don&apos;t worry if you&apos;re unsure — our team will guide you.
                </p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
                  {[
                    { key: 'bust',   label: 'Bust',   placeholder: 'e.g. 36"' },
                    { key: 'waist',  label: 'Waist',  placeholder: 'e.g. 30"' },
                    { key: 'hip',    label: 'Hip',    placeholder: 'e.g. 38"' },
                    { key: 'height', label: 'Height', placeholder: 'e.g. 162 cm' },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>{field.label}</label>
                      <input
                        style={inputStyle}
                        value={form.measurements[field.key as keyof typeof form.measurements]}
                        onChange={e => setMeasurement(field.key, e.target.value)}
                        placeholder={field.placeholder}
                      />
                    </div>
                  ))}
                </div>
                <div style={{ marginBottom: '16px' }}>
                  <label style={{ fontSize: '13px', fontWeight: 500, display: 'block', marginBottom: '6px' }}>Additional Notes</label>
                  <textarea
                    style={{ ...inputStyle, resize: 'vertical' as const }}
                    rows={4}
                    value={form.additionalNotes}
                    onChange={e => setField('additionalNotes', e.target.value)}
                    placeholder="Any other details — neckline style, sleeve length, special occasion date..."
                  />
                </div>
              </>
            )}

            {error && <p style={{ color: '#EF4444', fontSize: '13px', marginTop: '12px' }}>{error}</p>}

            {/* Navigation */}
            <div style={{ display: 'flex', gap: '12px', marginTop: '32px' }}>
              {step > 1 && (
                <button
                  onClick={() => setStep(s => s - 1)}
                  style={{ padding: '14px 24px', borderRadius: '999px', border: '1.5px solid #E0E0E0', background: 'white', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  ← Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={() => {
                    if (step === 1 && (!form.name || !form.email || !form.phone)) {
                      setError('Please fill Name, Email and Phone')
                      return
                    }
                    if (step === 2 && (!form.occasion || !form.garmentType || !form.budgetRange || !form.timeline)) {
                      setError('Please select Occasion, Garment Type, Budget and Timeline')
                      return
                    }
                    setError('')
                    setStep(s => s + 1)
                  }}
                  style={{ flex: 1, padding: '14px', borderRadius: '999px', background: '#1A1A1A', color: 'white', border: 'none', fontSize: '14px', fontWeight: 500, cursor: 'pointer', fontFamily: 'inherit' }}
                >
                  Continue →
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={loading}
                  style={{ flex: 1, padding: '14px', borderRadius: '999px', background: '#1A1A1A', color: 'white', border: 'none', fontSize: '14px', fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer', fontFamily: 'inherit', opacity: loading ? 0.7 : 1 }}
                >
                  {loading ? 'Submitting...' : 'Submit Bespoke Request ✨'}
                </button>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
