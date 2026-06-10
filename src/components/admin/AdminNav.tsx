'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { useState, useRef, useEffect } from 'react'

// ── Dropdown group type ───────────────────────────────────────
interface DropdownItem { label: string; href: string }
interface NavItem {
  label: string
  href?: string
  children?: DropdownItem[]
}

const navItems: NavItem[] = [
  { label: 'Orders',    href: '/admin/orders' },
  { label: 'Products',  href: '/admin/products' },
  { label: 'Bespoke',   href: '/admin/bespoke' },
  { label: 'Coupons',   href: '/admin/coupons' },
  {
    label: 'People',
    children: [
      { label: 'Customers',   href: '/admin/customers' },
      { label: 'Messages',    href: '/admin/messages' },
      { label: 'Subscribers', href: '/admin/subscribers' },
    ],
  },
  {
    label: 'Site',
    children: [
      { label: 'Media',       href: '/admin/media' },
      { label: 'Collections', href: '/admin/collections' },
      { label: 'Content',     href: '/admin/content' },
    ],
  },
  { label: 'Settings',  href: '/admin/settings' },
]

// ── Dropdown button ───────────────────────────────────────────
function DropdownTab({
  item,
  path,
  isOpen,
  onToggle,
  onClose,
}: {
  item: NavItem
  path: string
  isOpen: boolean
  onToggle: () => void
  onClose: () => void
}) {
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const buttonRef = useRef<HTMLButtonElement | null>(null)
  const [coords, setCoords] = useState<{ top: number; left: number }>({ top: 0, left: 0 })
  const [isMobile, setIsMobile] = useState(false)

  const isActive = item.children?.some(c => path.startsWith(c.href)) || isOpen

  useEffect(() => {
    setIsMobile(window.innerWidth <= 900)
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 900)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    const updateCoords = () => {
      if (isOpen && buttonRef.current) {
        const rect = buttonRef.current.getBoundingClientRect()
        setCoords({
          top: rect.bottom + 6,
          left: rect.left,
        })
      }
    }

    const handleScroll = () => {
      if (isOpen) {
        onClose()
      }
    }

    if (isOpen) {
      updateCoords()
      window.addEventListener('scroll', handleScroll, true)
      window.addEventListener('resize', updateCoords)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll, true)
      window.removeEventListener('resize', updateCoords)
    }
  }, [isOpen, onClose])

  const handleEnter = () => {
    if (window.innerWidth > 900) {
      if (timer.current) clearTimeout(timer.current)
      if (!isOpen) onToggle()
    }
  }
  const handleLeave = () => {
    if (window.innerWidth > 900) {
      timer.current = setTimeout(() => onClose(), 120)
    }
  }
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onToggle()
  }

  return (
    <div
      className="admin-nav-dropdown-tab-wrapper"
      style={{ position: 'relative', display: 'flex', alignItems: 'center' }}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      <button
        ref={buttonRef}
        type="button"
        onClick={handleClick}
        className={isActive ? 'active' : ''}
        style={{
          padding: '6px 14px',
          borderRadius: 8,
          fontSize: 14,
          fontWeight: 500,
          background: isActive ? '#1A1A1A' : 'transparent',
          color: isActive ? 'white' : '#555',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: 4,
          whiteSpace: 'nowrap',
        }}
      >
        {item.label}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor" style={{ marginLeft: 2, opacity: 0.6 }}>
          <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" fill="none" strokeLinecap="round" />
        </svg>
      </button>

      {isOpen && (
        <div
          className="admin-nav-dropdown-menu"
          style={{
            position: isMobile ? 'fixed' : 'absolute',
            top: isMobile ? coords.top : '100%',
            left: isMobile ? coords.left : 0,
            background: 'white',
            border: '1px solid rgba(0,0,0,0.1)',
            borderRadius: 10,
            padding: '6px',
            minWidth: 160,
            zIndex: 99999,
            boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
          }}
        >
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={`admin-nav-dropdown-item ${path.startsWith(child.href) ? 'active' : ''}`}
              onClick={() => onClose()}
              style={{
                display: 'block',
                padding: '7px 12px',
                borderRadius: 7,
                fontSize: 13,
                fontWeight: 500,
                background: path.startsWith(child.href) ? '#F5F0EB' : 'transparent',
                color: path.startsWith(child.href) ? '#1A1A1A' : '#555',
                textDecoration: 'none',
                transition: 'background 0.15s',
              }}
              onMouseEnter={e => { if (!path.startsWith(child.href)) (e.target as HTMLElement).style.background = '#F9F7F4' }}
              onMouseLeave={e => { if (!path.startsWith(child.href)) (e.target as HTMLElement).style.background = 'transparent' }}
            >
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Main admin nav ────────────────────────────────────────────
export default function AdminNav({ adminName }: { adminName: string }) {
  const path = usePathname()
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)

  useEffect(() => {
    const handleGlobalClick = () => {
      setActiveDropdown(null)
    }
    window.addEventListener('click', handleGlobalClick)
    return () => window.removeEventListener('click', handleGlobalClick)
  }, [])

  return (
    <nav className="admin-nav">
      {/* Logo */}
      <Link href="/admin" className="admin-nav-brand" onClick={() => setActiveDropdown(null)}>
        <img src="/photos/logo.png" alt="" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
        <span className="admin-nav-brand-text">
          Label Indeza
        </span>
      </Link>

      {/* Nav items */}
      <div className="admin-nav-links">
        {navItems.map((item) => {
          if (item.children) {
            return (
              <DropdownTab
                key={item.label}
                item={item}
                path={path}
                isOpen={activeDropdown === item.label}
                onToggle={() => setActiveDropdown(activeDropdown === item.label ? null : item.label)}
                onClose={() => setActiveDropdown(null)}
              />
            )
          }
          const isActive = item.href === '/admin'
            ? path === '/admin'
            : path.startsWith(item.href!)
          return (
            <Link
              key={item.href}
              href={item.href!}
              onClick={() => setActiveDropdown(null)}
              className={isActive ? 'active' : ''}
              style={{
                padding: '6px 14px',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 500,
                background: isActive ? '#1A1A1A' : 'transparent',
                color: isActive ? 'white' : '#555',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              {item.label}
            </Link>
          )
        })}
      </div>

      {/* Right side */}
      <div className="admin-nav-right" onClick={() => setActiveDropdown(null)}>
        <span className="admin-nav-username">
          Admin: {adminName || 'harsh'}
        </span>
        <button
          onClick={() => signOut({ callbackUrl: '/admin/login' })}
          className="admin-nav-signout-btn"
        >
          Sign out
        </button>
      </div>
    </nav>
  )
}
