'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { signOut, useSession } from 'next-auth/react'
import { User } from 'lucide-react'

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router   = useRouter()
  const { data: session } = useSession()

  const getFormattedName = (nameStr: string) => {
    if (!nameStr) return '';
    const cleanName = nameStr.includes('@') ? nameStr.split('@')[0] : nameStr;
    const parts = cleanName.trim().split(/\s+/);
    return parts.slice(0, 2).join(' ');
  };

  // Don't show account nav on the sign-in page itself
  const isSignInPage = pathname === '/account'
  if (isSignInPage) return <>{children}</>

  return (
    <div style={{ minHeight: '100vh', background: '#EFE9DF', fontFamily: 'system-ui' }}>
      {/* Account Navbar — clean minimal like Pankh reference */}
      <nav className="account-nav">
        {/* Brand */}
        <Link href="/" className="account-nav-brand">
          <img src="/photos/logo.png" alt="" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
          <span className="account-nav-brand-text">
            Label Indeza
          </span>
        </Link>

        {/* Tabs */}
        <div className="account-nav-tabs">
          {[
            { label: 'Orders',  href: '/account/orders'  },
            { label: 'Profile', href: '/account/profile' },
          ].map(tab => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`account-nav-tab ${pathname === tab.href ? 'active' : ''}`}
              style={{
                fontWeight: pathname === tab.href ? 600 : 400,
                borderBottom: pathname === tab.href ? '2px solid #1A1A1A' : '2px solid transparent',
                color: pathname === tab.href ? '#1A1A1A' : '#666',
              }}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {/* Account icon */}
        <div className="account-nav-user">
          <span className="account-nav-username">
            {getFormattedName(session?.user?.name || session?.user?.email || '')}
          </span>
          <div className="account-nav-avatar">
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

      <main style={{ maxWidth: '860px', margin: '0 auto', padding: '40px 24px' }}>
        {/* Mobile Tabs — only shown below navbar on mobile */}
        <div className="account-mobile-tabs-container">
          {[
            { label: 'Orders',  href: '/account/orders'  },
            { label: 'Profile', href: '/account/profile' },
          ].map(tab => (
            <Link
              key={tab.href}
              href={tab.href}
              className={`account-nav-tab ${pathname === tab.href ? 'active' : ''}`}
              style={{
                fontWeight: pathname === tab.href ? 600 : 400,
                color: pathname === tab.href ? '#1A1A1A' : '#666',
              }}
            >
              {tab.label}
            </Link>
          ))}
        </div>

        {children}
      </main>
    </div>
  )
}
