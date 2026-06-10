// src/app/admin/(dashboard)/settings/page.tsx
'use client'
import { useState, useEffect } from 'react'
import { Check, Upload } from 'lucide-react'
import Loader from '@/components/Loader'

type Setting = { key: string; value: string; group: string; label: string }

const GROUP_LABELS: Record<string, string> = {
  general:     'General',
  social:      'Social Media & Contact',
  brand_story: 'Homepage — Brand Story Section',
  categories:  'Homepage — Category Tile Images',
  about:       'About Page Content',
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Setting[]>([])
  const [values,   setValues]   = useState<Record<string, string>>({})
  const [loading,  setLoading]  = useState(true)
  const [saving,   setSaving]   = useState<string | null>(null)
  const [saved,    setSaved]    = useState<string | null>(null)

  useEffect(() => {
    fetch(`/api/admin/settings?t=${Date.now()}`, { cache: 'no-store' })
      .then(r => r.json())
      .then((data: Setting[]) => {
        if (Array.isArray(data)) {
          setSettings(data)
          const vals: Record<string, string> = {}
          data.forEach(s => { vals[s.key] = s.value })
          setValues(vals)
        }
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const handleSaveGroup = async (group: string) => {
    setSaving(group)
    const groupSettings = settings.filter(s => s.group === group)
    const updates: Record<string, string> = {}
    groupSettings.forEach(s => { updates[s.key] = values[s.key] || '' })

    await fetch('/api/admin/settings', {
      method:  'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify(updates),
    })

    setSaving(null)
    setSaved(group)
    setTimeout(() => setSaved(null), 2500)
  }

  const handleImageUpload = async (key: string, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', 'image')

    const res  = await fetch('/api/upload', { method: 'POST', body: formData })
    const data = await res.json()
    if (data.url) {
      setValues(prev => ({ ...prev, [key]: data.url }))
    }
  }

  if (loading) return <Loader />

  // Group settings
  const groups = ['social', 'brand_story', 'categories', 'about']

  const inputStyle = {
    width: '100%', border: '1px solid #E0E0E0', borderRadius: '10px',
    padding: '10px 14px', fontSize: '14px', outline: 'none',
    fontFamily: 'inherit', background: 'white', boxSizing: 'border-box' as const,
  }

  return (
    <div>
      <h1 style={{ fontSize: '24px', fontWeight: 600, marginBottom: '32px' }}>Site Settings</h1>

      {groups.map(group => {
        const groupSettings = settings.filter(s => s.group === group)
        if (groupSettings.length === 0) return null
        const isSaving = saving === group
        const isSaved  = saved  === group

        return (
          <div key={group} style={{
            background: 'white', borderRadius: '16px', padding: '28px',
            border: '1px solid #E8E8E8', marginBottom: '24px',
          }}>
            {/* Group header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', paddingBottom: '16px', borderBottom: '1px solid #F0F0F0' }}>
              <h2 style={{ fontSize: '16px', fontWeight: 600 }}>{GROUP_LABELS[group] || group}</h2>
              <button
                onClick={() => handleSaveGroup(group)}
                disabled={isSaving}
                style={{
                  padding: '8px 20px', borderRadius: '8px',
                  background: isSaved ? '#15803D' : '#1A1A1A',
                  color: 'white', border: 'none', fontSize: '13px',
                  fontWeight: 500, cursor: isSaving ? 'not-allowed' : 'pointer',
                  fontFamily: 'inherit', display: 'flex', alignItems: 'center', gap: '6px',
                  transition: 'background 0.2s',
                }}
              >
                {isSaved ? <><Check size={14} /> Saved!</> : isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>

            {/* Settings fields */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {groupSettings.map(setting => {
                const isImage  = setting.key.includes('image')
                const isLong   = setting.key.includes('body') || setting.key.includes('quote') || setting.key.includes('text')
                const isColor  = setting.key.includes('color')

                return (
                  <div key={setting.key}>
                    <label style={{ fontSize: '13px', fontWeight: 500, color: '#444', display: 'block', marginBottom: '8px' }}>
                      {setting.label}
                    </label>

                    {isColor ? (
                      // Color picker for pill colors
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <input
                          type="color"
                          value={values[setting.key] || '#F5C5D5'}
                          onChange={e => setValues(prev => ({ ...prev, [setting.key]: e.target.value }))}
                          style={{ width: 48, height: 40, border: '1px solid #E0E0E0', borderRadius: '8px', cursor: 'pointer', padding: '2px' }}
                        />
                        <input
                          type="text"
                          value={values[setting.key] || ''}
                          onChange={e => setValues(prev => ({ ...prev, [setting.key]: e.target.value }))}
                          style={{ ...inputStyle, width: '160px' }}
                          placeholder="#F5C5D5"
                        />
                        {/* Preview pill */}
                        <span style={{ background: values[setting.key], borderRadius: '999px', padding: '6px 16px', fontSize: '13px', fontWeight: 500 }}>
                          Preview
                        </span>
                      </div>
                    ) : isImage ? (
                      // Image uploader
                      <div>
                        {values[setting.key] && (
                          <img
                            src={values[setting.key]}
                            alt=""
                            style={{ width: 120, height: 80, objectFit: 'cover', borderRadius: '8px', marginBottom: '10px', border: '1px solid #E0E0E0' }}
                          />
                        )}
                        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                          <input
                            type="text"
                            value={values[setting.key] || ''}
                            onChange={e => setValues(prev => ({ ...prev, [setting.key]: e.target.value }))}
                            placeholder="Image URL or upload below"
                            style={{ ...inputStyle, flex: 1 }}
                          />
                          <label style={{
                            display: 'flex', alignItems: 'center', gap: '6px',
                            padding: '10px 16px', borderRadius: '8px',
                            border: '1px solid #E0E0E0', background: 'white',
                            fontSize: '13px', cursor: 'pointer', whiteSpace: 'nowrap',
                          }}>
                            <Upload size={14} />
                            Upload
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: 'none' }}
                              onChange={e => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(setting.key, file)
                              }}
                            />
                          </label>
                        </div>
                      </div>
                    ) : isLong ? (
                      // Textarea for long text
                      <textarea
                        value={values[setting.key] || ''}
                        onChange={e => setValues(prev => ({ ...prev, [setting.key]: e.target.value }))}
                        rows={4}
                        style={{ ...inputStyle, resize: 'vertical' }}
                      />
                    ) : (
                      // Regular text input
                      <input
                        type="text"
                        value={values[setting.key] || ''}
                        onChange={e => setValues(prev => ({ ...prev, [setting.key]: e.target.value }))}
                        style={inputStyle}
                      />
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
