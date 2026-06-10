'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { cardStyle, btnSecondary } from '@/components/admin/adminStyles'

type HeroMedia = {
  _id: string
  type: 'video' | 'image'
  url: string
  active: boolean
  createdAt?: string
}

function UploadZone({
  label,
  hint,
  accept,
  uploadType,
  uploading,
  onFile,
}: {
  label: string
  hint: string
  accept: string
  uploadType: 'video' | 'image'
  uploading: boolean
  onFile: (file: File) => void
}) {
  const fileRef = useRef<HTMLInputElement>(null)

  return (
    <div style={{ flex: 1 }}>
      <h3 style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{label}</h3>
      <p style={{ fontSize: 12, color: '#888', marginBottom: 12 }}>{hint}</p>
      <div
        onClick={() => fileRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          const file = e.dataTransfer.files[0]
          if (file) onFile(file)
        }}
        style={{
          border: '2px dashed #D0C8BC',
          borderRadius: 12,
          padding: 32,
          textAlign: 'center',
          cursor: 'pointer',
          background: '#FAF8F5',
          minHeight: 120,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <p style={{ color: '#999', margin: 0, fontSize: 14 }}>
          {uploading ? 'Uploading...' : `Drag & drop or click (${uploadType})`}
        </p>
        <input
          ref={fileRef}
          type="file"
          accept={accept}
          style={{ display: 'none' }}
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) onFile(file)
          }}
        />
      </div>
    </div>
  )
}

export default function MediaPage() {
  const [activeHero, setActiveHero] = useState<HeroMedia | null>(null)
  const [allMedia, setAllMedia] = useState<HeroMedia[]>([])
  const [uploadingVideo, setUploadingVideo] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const load = useCallback(async () => {
    const [activeRes, allRes] = await Promise.all([
      fetch('/api/hero'),
      fetch('/api/hero?all=true'),
    ])
    const active = await activeRes.json()
    const all = await allRes.json()
    setActiveHero(active?._id ? active : null)
    setAllMedia(Array.isArray(all) ? all : [])
  }, [])

  useEffect(() => {
    load()
  }, [load])

  const uploadAndSetHero = async (file: File, type: 'video' | 'image') => {
    const setUploading = type === 'video' ? setUploadingVideo : setUploadingImage
    setUploading(true)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('type', type)
    const uploadRes = await fetch('/api/upload', { method: 'POST', body: fd })
    const uploadData = await uploadRes.json()
    if (!uploadData.url) {
      setUploading(false)
      alert('Upload failed')
      return
    }
    await fetch('/api/hero', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, url: uploadData.url }),
    })
    setUploading(false)
    load()
  }

  const deleteMedia = async (id: string) => {
    if (!confirm('Delete this hero media? The file will be removed from the site.')) return
    setDeletingId(id)
    await fetch(`/api/hero/${id}`, { method: 'DELETE' })
    setDeletingId(null)
    load()
  }

  const activateMedia = async (id: string) => {
    try {
      const res = await fetch('/api/hero', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      if (!res.ok) throw new Error('Failed to activate media')
      load()
    } catch (e: any) {
      alert(e.message || 'Failed to activate media')
    }
  }

  const getFileName = (url: string) => {
    if (!url) return ''
    const parts = url.split('/')
    return parts[parts.length - 1]
  }

  return (
    <div>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 24 }}>Media</h1>

      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <div className="admin-media-upload-row" style={{ display: 'flex', gap: 24, marginBottom: 0 }}>
          <UploadZone
             label="Hero Video"
             hint="MP4, landscape, min 1280×720. Replaces current active hero."
             accept=".mp4,video/mp4"
             uploadType="video"
             uploading={uploadingVideo}
             onFile={(f) => uploadAndSetHero(f, 'video')}
          />
          <UploadZone
             label="Hero Fallback Image"
             hint="Poster while video loads, or hero when no video."
             accept="image/*"
             uploadType="image"
             uploading={uploadingImage}
             onFile={(f) => uploadAndSetHero(f, 'image')}
          />
        </div>
      </div>

      <div style={{ ...cardStyle, marginBottom: 24 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>Current Active Hero</h2>
        {!activeHero ? (
          <p style={{ color: '#888' }}>
            No active hero. Upload a video or image above, or the site uses{' '}
            <code>/images/hero-poster.jpg</code>.
          </p>
        ) : activeHero.type === 'video' ? (
          <div>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>Hero Video (live on homepage)</p>
            <video
              src={activeHero.url}
              controls
              style={{ width: '100%', maxHeight: 360, borderRadius: 12, background: '#000' }}
            />
            <div className="admin-media-active-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <p className="admin-media-filename" style={{ fontSize: 12, color: '#999', margin: 0 }}>{getFileName(activeHero.url)}</p>
              <button
                type="button"
                className="admin-media-action-btn"
                onClick={() => deleteMedia(activeHero._id)}
                disabled={deletingId === activeHero._id}
                style={{ ...btnSecondary, color: '#c0392b', borderColor: '#c0392b' }}
              >
                {deletingId === activeHero._id ? 'Deleting...' : 'Delete video'}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <p style={{ fontSize: 13, color: '#666', marginBottom: 12 }}>Hero Image (live on homepage)</p>
            <img
              src={activeHero.url}
              alt="Hero"
              style={{ width: '100%', maxHeight: 360, objectFit: 'cover', borderRadius: 12 }}
            />
            <div className="admin-media-active-meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
              <p className="admin-media-filename" style={{ fontSize: 12, color: '#999', margin: 0 }}>{getFileName(activeHero.url)}</p>
              <button
                type="button"
                className="admin-media-action-btn"
                onClick={() => deleteMedia(activeHero._id)}
                disabled={deletingId === activeHero._id}
                style={{ ...btnSecondary, color: '#c0392b', borderColor: '#c0392b' }}
              >
                {deletingId === activeHero._id ? 'Deleting...' : 'Delete image'}
              </button>
            </div>
          </div>
        )}
      </div>

      {allMedia.length > 0 && (
        <div style={cardStyle}>
          <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 16 }}>All uploads</h2>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 16 }}>
            Set older uploads as active or delete ones you no longer need. Only the active item shows on the homepage.
          </p>
          {allMedia.map((item) => (
            <div
              key={item._id}
              className="admin-media-list-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 16,
                padding: '16px 0',
                borderTop: '1px solid #F0EDE8',
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  padding: '4px 10px',
                  borderRadius: 20,
                  background: item.active ? '#e8f5e9' : '#f5f5f5',
                  color: item.active ? '#2d6a4f' : '#888',
                  textTransform: 'capitalize',
                  flexShrink: 0,
                }}
              >
                {item.active ? 'Active' : 'Inactive'} · {item.type}
              </span>
              <p
                style={{
                  flex: 1,
                  fontSize: 12,
                  color: '#666',
                  margin: 0,
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {getFileName(item.url)}
              </p>
              <div className="admin-media-list-actions" style={{ display: 'flex', gap: 8 }}>
                {!item.active && (
                  <button
                    type="button"
                    onClick={() => activateMedia(item._id)}
                    style={{
                      ...btnSecondary,
                      color: '#2d6a4f',
                      borderColor: '#2d6a4f',
                      background: '#e8f5e9',
                    }}
                  >
                    Set active
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => deleteMedia(item._id)}
                  disabled={deletingId === item._id}
                  style={{ ...btnSecondary, color: '#c0392b', borderColor: '#c0392b' }}
                >
                  {deletingId === item._id ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
