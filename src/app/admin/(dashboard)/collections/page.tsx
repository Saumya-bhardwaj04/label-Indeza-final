'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cardStyle, btnPrimary, btnSecondary, inputBoxStyle, labelStyle } from '@/components/admin/adminStyles'
import Loader from '@/components/Loader'

type Collection = {
  _id: string
  name: string
  slug: string
  description?: string
  bannerImage?: string
  bgColor: string
  active: boolean
}

const emptyForm = {
  name: '',
  slug: '',
  description: '',
  bannerImage: '',
  bgColor: '#F5C5D5',
  active: true,
}

export default function CollectionsPage() {
  const [collections, setCollections] = useState<Collection[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [preview, setPreview] = useState('')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)

  const load = useCallback(async () => {
    const res = await fetch(`/api/collections?t=${Date.now()}`, { cache: 'no-store' })
    setCollections(await res.json())
    setLoading(false)
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const slugify = (name: string) =>
    name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')

  const resetForm = () => {
    setForm(emptyForm)
    setPreview('')
    setEditingId(null)
    setShowForm(false)
  }

  const openAdd = () => {
    resetForm()
    setShowForm(true)
  }

  const openEdit = (c: Collection) => {
    setEditingId(c._id)
    setForm({
      name: c.name,
      slug: c.slug,
      description: c.description || '',
      bannerImage: c.bannerImage || '',
      bgColor: c.bgColor,
      active: c.active,
    })
    setPreview(c.bannerImage || '')
    setShowForm(true)
  }

  const handleBannerUpload = async (file: File) => {
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('type', 'image')
    const res = await fetch('/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    if (data.url) {
      setForm((f) => ({ ...f, bannerImage: data.url }))
      setPreview(data.url)
    }
    setUploading(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    const payload = {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description || undefined,
      bannerImage: form.bannerImage || undefined,
      bgColor: form.bgColor,
      active: form.active,
    }
    if (editingId) {
      await fetch(`/api/collections/${editingId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    } else {
      await fetch('/api/collections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
    }
    setSaving(false)
    resetForm()
    load()
  }

  const toggleActive = async (c: Collection) => {
    await fetch(`/api/collections/${c._id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ active: !c.active }),
    })
    load()
  }

  const handleDelete = async (id: string) => {
    await fetch(`/api/collections/${id}`, { method: 'DELETE' })
    setDeleteId(null)
    load()
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600, margin: 0 }}>Collections</h1>
        <button type="button" onClick={openAdd} style={btnPrimary}>
          + Add Collection
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} style={{ ...cardStyle, marginBottom: 24 }}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 20 }}>
            {editingId ? 'Edit Collection' : 'Add Collection'}
          </h2>
          <div className="collections-form-grid">
            <div style={inputBoxStyle}>
              <label style={labelStyle}>Name</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value,
                    slug: editingId ? form.slug : slugify(e.target.value),
                  })
                }
                required
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15 }}
              />
            </div>
            <div style={inputBoxStyle}>
              <label style={labelStyle}>Slug</label>
              <input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: e.target.value })}
                required
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15 }}
              />
            </div>
            <div style={{ ...inputBoxStyle, gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={2}
                style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15, resize: 'vertical' }}
              />
            </div>
            <div style={inputBoxStyle}>
              <label style={labelStyle}>Background Color</label>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <input
                  type="color"
                  value={form.bgColor}
                  onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                  style={{ width: 48, height: 36, border: 'none', cursor: 'pointer' }}
                />
                <input
                  value={form.bgColor}
                  onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
                  style={{ flex: 1, border: 'none', outline: 'none', fontSize: 15 }}
                />
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', minHeight: '58px', paddingLeft: 4, paddingBottom: 4 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 14, cursor: 'pointer', userSelect: 'none' }}>
                <input
                  type="checkbox"
                  checked={form.active}
                  onChange={(e) => setForm({ ...form, active: e.target.checked })}
                  style={{ width: 18, height: 18, cursor: 'pointer', accentColor: '#1A1A1A' }}
                />
                <span style={{ fontWeight: 500, color: '#1A1A1A' }}>Active Collection</span>
              </label>
            </div>
          </div>
          <div
            onClick={() => fileRef.current?.click()}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              const file = e.dataTransfer.files[0]
              if (file) handleBannerUpload(file)
            }}
            style={{
              border: '2px dashed #D0C8BC',
              borderRadius: 12,
              padding: 32,
              textAlign: 'center',
              cursor: 'pointer',
              background: '#FAF8F5',
              marginBottom: 24,
            }}
          >
            {preview ? (
              <img src={preview} alt="" style={{ maxHeight: 120, borderRadius: 8, objectFit: 'cover' }} />
            ) : (
              <p style={{ color: '#999', margin: 0 }}>
                {uploading ? 'Uploading...' : 'Click or drag banner image here'}
              </p>
            )}
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={(e) => {
                const file = e.target.files?.[0]
                if (file) handleBannerUpload(file)
              }}
            />
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button type="submit" disabled={saving} style={btnPrimary}>
              {saving ? 'Saving...' : editingId ? 'Update' : 'Add Collection'}
            </button>
            <button type="button" onClick={resetForm} style={btnSecondary}>
              Cancel
            </button>
          </div>
        </form>
      )}

      <div style={cardStyle}>
        {loading ? (
          <Loader />
        ) : collections.length === 0 ? (
          <p style={{ color: '#888', textAlign: 'center', padding: 32 }}>No collections yet.</p>
        ) : (
          collections.map((c, i) => (
            <div
              key={c._id}
              className="admin-collection-row"
              style={{
                borderTop: i > 0 ? '1px solid #F0EDE8' : 'none',
                opacity: c.active ? 1 : 0.55,
              }}
            >
              <div
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 8,
                  background: c.bgColor,
                  overflow: 'hidden',
                  flexShrink: 0,
                }}
              >
                {c.bannerImage && (
                  <img src={c.bannerImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
              <div className="collection-info-col" style={{ flex: 1 }}>
                <div style={{ fontWeight: 500 }}>{c.name}</div>
                <div style={{ fontSize: 13, color: '#888' }}>{c.slug}</div>
              </div>
              <span
                className="collection-status-badge"
                style={{
                  fontSize: 12,
                  padding: '4px 10px',
                  borderRadius: 20,
                  background: c.active ? '#e8f5e9' : '#f5f5f5',
                  color: c.active ? '#2d6a4f' : '#888',
                }}
              >
                {c.active ? 'Active' : 'Inactive'}
              </span>
              <div className="collection-actions-group">
                <button type="button" onClick={() => toggleActive(c)} style={btnSecondary}>
                  Toggle
                </button>
                <button type="button" onClick={() => openEdit(c)} style={btnSecondary}>
                  Edit
                </button>
                {deleteId === c._id ? (
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      type="button"
                      onClick={() => handleDelete(c._id)}
                      style={{ ...btnSecondary, color: 'red', borderColor: 'red' }}
                    >
                      Confirm
                    </button>
                    <button type="button" onClick={() => setDeleteId(null)} style={btnSecondary}>
                      Cancel
                    </button>
                  </div>
                ) : (
                  <button type="button" onClick={() => setDeleteId(c._id)} style={{ ...btnSecondary, color: '#888' }}>
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
