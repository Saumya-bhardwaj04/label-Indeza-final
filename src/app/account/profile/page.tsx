'use client'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Pencil, Check } from 'lucide-react'

export default function ProfilePage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [name, setName]       = useState('')
  const [editing, setEditing] = useState(false)
  const [saving, setSaving]   = useState(false)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/account')
    if (session?.user?.name) setName(session.user.name)
  }, [status, session, router])

  const handleSaveName = async () => {
    setSaving(true)
    // Save name to customer profile using PATCH
    await fetch('/api/customer/profile', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name }),
    })
    await update({ name })
    setSaving(false)
    setEditing(false)
  }

  if (status === 'loading') return null

  return (
    <div>
      <h1 style={{ fontSize: '28px', fontWeight: 600, marginBottom: '28px' }}>Profile</h1>

      {/* Name + Email card */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '16px', border: '1px solid #E8E8E8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Name</span>
          <button onClick={() => setEditing(!editing)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#666' }}>
            <Pencil size={15} />
          </button>
        </div>
        {editing ? (
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input value={name} onChange={e => setName(e.target.value)}
              style={{ flex: 1, border: '1px solid #E0E0E0', borderRadius: '8px', padding: '10px 12px', fontSize: '14px', outline: 'none', fontFamily: 'inherit' }} />
            <button onClick={handleSaveName} disabled={saving}
              style={{ background: '#1A1A1A', color: 'white', border: 'none', borderRadius: '8px', padding: '10px 16px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px' }}>
              <Check size={14} /> {saving ? 'Saving...' : 'Save'}
            </button>
          </div>
        ) : (
          <p style={{ fontSize: '15px' }}>{session?.user?.name || <span style={{ color: '#999' }}>Not set</span>}</p>
        )}

        <div style={{ borderTop: '1px solid #F0F0F0', marginTop: '16px', paddingTop: '16px' }}>
          <span style={{ fontSize: '13px', fontWeight: 600, color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Email</span>
          <p style={{ fontSize: '15px', color: '#555' }}>{session?.user?.email}</p>
        </div>
      </div>

      {/* Sign out */}
      <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
        <button
          onClick={() => signOut({ callbackUrl: '/' })}
          style={{ padding: '10px 20px', border: '1.5px solid #E0E0E0', borderRadius: '10px', background: 'white', fontSize: '14px', cursor: 'pointer', fontFamily: 'inherit' }}
        >
          Sign out
        </button>
        <button
          onClick={async () => { await signOut({ redirect: false }); router.push('/') }}
          style={{ padding: '10px 20px', border: 'none', borderRadius: '10px', background: 'transparent', fontSize: '14px', cursor: 'pointer', color: '#888', fontFamily: 'inherit' }}
        >
          Sign out of all devices
        </button>
      </div>
    </div>
  )
}
