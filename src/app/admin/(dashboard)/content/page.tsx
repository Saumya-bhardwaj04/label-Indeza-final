'use client'

import { useEffect, useState } from 'react'
import { cardStyle, btnPrimary, inputBoxStyle, labelStyle } from '@/components/admin/adminStyles'
import Loader from '@/components/Loader'

const fields = [
  { key: 'hero_title', label: 'Hero Title' },
  { key: 'hero_subtitle', label: 'Hero Subtitle' },
  { key: 'pastel_title', label: 'Pastel Dreams — Title' },
  { key: 'summer_title', label: 'Summer 2026 — Title' },
  { key: 'instafeed_shortcodes', label: 'Instagram Feed Shortcodes (Comma Separated)' },
]

export default function ContentPage() {
  const [content, setContent] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch(`/api/content?t=${Date.now()}`, { cache: 'no-store' })
      .then((r) => r.json())
      .then((data) => {
        setContent(data)
        setLoading(false)
      })
  }, [])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setSaved(false)
    await fetch('/api/content', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(content),
    })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 24 }}>Site Content</h1>
      <form onSubmit={handleSave} style={cardStyle}>
        {loading ? (
          <Loader />
        ) : (
          <>
            {fields.map((f) => (
              <div key={f.key} style={{ marginBottom: 20 }}>
                <div style={inputBoxStyle}>
                  <label style={labelStyle}>{f.label}</label>
                  {f.key === 'hero_title' || f.key === 'hero_subtitle' ? (
                    <textarea
                      value={content[f.key] || ''}
                      onChange={(e) => setContent({ ...content, [f.key]: e.target.value })}
                      rows={f.key === 'hero_title' ? 2 : 2}
                      style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15, resize: 'vertical' }}
                    />
                  ) : (
                    <input
                      value={content[f.key] || ''}
                      onChange={(e) => setContent({ ...content, [f.key]: e.target.value })}
                      style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15 }}
                    />
                  )}
                </div>
              </div>
            ))}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 8 }}>
              <button type="submit" disabled={saving} style={btnPrimary}>
                {saving ? 'Saving...' : 'Save All Changes'}
              </button>
              {saved && <span style={{ fontSize: 14, color: '#2d6a4f' }}>Saved successfully</span>}
            </div>
          </>
        )}
      </form>
    </div>
  )
}
