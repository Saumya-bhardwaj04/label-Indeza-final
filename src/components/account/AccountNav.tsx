'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'

const tabs = [
  { label: 'Orders', href: '/account/orders' },
  { label: 'Profile', href: '/account/profile' },
]

export default function AccountNav() {
  const path = usePathname()
  const { data: session } = useSession()

  return (
    <nav
      style={{
        background: '#EFE9DF',
        borderBottom: '1px solid rgba(0,0,0,0.08)',
        padding: '0 24px',
        display: 'flex',
        alignItems: 'center',
        height: 56,
      }}
    >
      <Link href="/" style={{ fontWeight: 700, fontSize: 17, marginRight: 48, textDecoration: 'none', color: 'inherit' }}>
        Label Indeza
      </Link>
      <div style={{ display: 'flex', gap: 4, flex: 1 }}>
        {tabs.map((tab) => (
          <Link
            key={tab.href}
            href={tab.href}
            style={{
              padding: '6px 16px',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: path === tab.href ? 'underline' : 'none',
              color: path === tab.href ? '#1A1A1A' : '#555',
            }}
          >
            {tab.label}
          </Link>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        {session?.user && (
          <span style={{ fontSize: 13, color: '#666' }}>{session.user.email}</span>
        )}
        {session?.user && (
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: '/account' })}
            style={{
              background: 'white',
              border: '1px solid #E0E0E0',
              borderRadius: 8,
              padding: '6px 14px',
              fontSize: 13,
              cursor: 'pointer',
            }}
          >
            Sign out
          </button>
        )}
        <div
          style={{
            width: 36,
            height: 36,
            borderRadius: '50%',
            border: '1.5px solid #ccc',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {session?.user?.image ? (
            <img src={session.user.image} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} referrerPolicy="no-referrer" alt="" />
          ) : (
            <div style={{
              width: '100%',
              height: '100%',
              borderRadius: '50%',
              background: '#E14D76',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '14px',
              fontWeight: '600',
            }}>
              {(session?.user?.name || session?.user?.email || '?').charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}
