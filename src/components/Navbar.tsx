'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/context/CartContext'
import CartDrawer from '@/components/CartDrawer'
import SearchOverlay from '@/components/SearchOverlay'

const dropdowns = {
  Women: {
    image: '/images/nav-model.jpg',
    links: [
      { label: 'Shop All', href: '/shop/women' },
      { label: 'Outwear', href: '/shop/women?category=outwear' },
      { label: 'Tops', href: '/shop/women?category=tops' },
      { label: 'Bottoms', href: '/shop/women?category=bottoms' },
      { label: 'Accessories', href: '/shop/women?category=accessories' },
    ],
  },
  Collections: {
    image: '/images/pastel-banner.jpg',
    links: [
      { label: 'All Collections', href: '/collections' },
      { label: 'Pastel Dreams', href: '/shop/women?collection=pastel-dreams' },
      { label: 'Summer 2026', href: '/shop/women?collection=summer-2026' },
    ],
  },
  Company: {
    image: '/images/brand-model.jpg',
    links: [
      { label: 'About us', href: '/about' },
      { label: 'Journal', href: '/journal' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact us', href: '/contact' },
    ],
  },
} as const

type DropdownKey = keyof typeof dropdowns

function NavDropdown({ name }: { name: DropdownKey }) {
  const config = dropdowns[name]
  return (
    <li className="nav-item has-dropdown">
      <span className="nav-trigger">{name}</span>
      <div className="nav-dropdown">
        <div className="nav-dropdown-image-wrap">
          <img src={config.image} alt="" className="nav-dropdown-image" />
        </div>
        <ul className="nav-dropdown-links">
          {config.links.map((link) => (
            <li key={link.href}>
              <Link href={link.href}>{link.label}</Link>
            </li>
          ))}
        </ul>
      </div>
    </li>
  )
}

export default function Navbar() {
  const { count } = useCart()
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [expandedMenu, setExpandedMenu] = useState<string | null>(null)
  const pathname = usePathname()

  const toggleExpand = (menu: string) => {
    setExpandedMenu(prev => (prev === menu ? null : menu))
  }

  useEffect(() => {
    const handleScroll = () => {
      const navbar = document.getElementById('navbar')
      if (!navbar) return

      const isHome = pathname === '/'
      if (isHome && window.scrollY < 80) {
        navbar.classList.add('transparent')
        navbar.classList.remove('scrolled')
      } else {
        navbar.classList.remove('transparent')
        navbar.classList.add('scrolled')
      }
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [pathname])

  // Reset menu expansion when opening/closing or navigating
  useEffect(() => {
    setExpandedMenu(null)
  }, [pathname, mobileOpen])

  return (
    <>
      <nav className={`navbar ${pathname === '/' ? 'transparent' : 'scrolled'}`} id="navbar">
        <div className="nav-inner container">
          <ul className="nav-links left">
            <NavDropdown name="Women" />
            <li>
              <Link href="/customize">Customize</Link>
            </li>
            <NavDropdown name="Collections" />
            <NavDropdown name="Company" />
          </ul>

          <Link
            href="/"
            className="nav-logo"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: '22px',
              fontWeight: 500,
              fontStyle: 'italic',
              letterSpacing: '0.02em',
              whiteSpace: 'nowrap',
              textDecoration: 'none',
              display: 'inline-block',
            }}
          >
            Label Indeza
          </Link>

          <div className="nav-actions">
            <button
              type="button"
              className="nav-icon"
              aria-label="Search"
              onClick={() => setSearchOpen(true)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </button>
            <button
              onClick={() => setCartOpen(true)}
              className="nav-cart-btn"
              style={{ position: 'relative', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: 'inherit' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <span className="cart-text">Cart ({count})</span>
              {count > 0 && (
                <span className="cart-badge">{count}</span>
              )}
            </button>
            <Link href="/account" className="nav-icon" aria-label="Account">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7" />
              </svg>
            </Link>
            <button
              type="button"
              className="hamburger"
              aria-label="Menu"
              onClick={() => setMobileOpen(true)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>
      </nav>

      <div className={`mobile-menu${mobileOpen ? ' open' : ''}`}>
        <div className="mobile-menu-header">
          <span style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '20px', fontWeight: 600, fontStyle: 'italic', letterSpacing: '0.02em', color: '#1A1A1A' }}>
            Label Indeza
          </span>
          <button type="button" style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#1A1A1A', padding: '4px' }} onClick={() => setMobileOpen(false)}>
            ✕
          </button>
        </div>
        <div className="mobile-menu-body">
          <nav className="mobile-nav">
            {/* Women Sub-nav */}
            <div className="mobile-nav-item">
              <div className="mobile-nav-trigger-row">
                <Link href="/shop/women" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
                  Women
                </Link>
                <button
                  type="button"
                  className="mobile-nav-expand-btn"
                  onClick={() => toggleExpand('women')}
                >
                  {expandedMenu === 'women' ? '−' : '+'}
                </button>
              </div>
              {expandedMenu === 'women' && (
                <div className="mobile-sub-nav">
                  <Link href="/shop/women" onClick={() => setMobileOpen(false)}>Shop All</Link>
                  <Link href="/shop/women?category=outwear" onClick={() => setMobileOpen(false)}>Outerwear</Link>
                  <Link href="/shop/women?category=tops" onClick={() => setMobileOpen(false)}>Tops</Link>
                  <Link href="/shop/women?category=bottoms" onClick={() => setMobileOpen(false)}>Bottoms</Link>
                  <Link href="/shop/women?category=accessories" onClick={() => setMobileOpen(false)}>Accessories</Link>
                </div>
              )}
            </div>

            {/* Customize */}
            <div className="mobile-nav-item">
              <Link href="/customize" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
                Customize
              </Link>
            </div>

            {/* Collections Sub-nav */}
            <div className="mobile-nav-item">
              <div className="mobile-nav-trigger-row">
                <Link href="/collections" onClick={() => setMobileOpen(false)} className="mobile-nav-link">
                  Collections
                </Link>
                <button
                  type="button"
                  className="mobile-nav-expand-btn"
                  onClick={() => toggleExpand('collections')}
                >
                  {expandedMenu === 'collections' ? '−' : '+'}
                </button>
              </div>
              {expandedMenu === 'collections' && (
                <div className="mobile-sub-nav">
                  <Link href="/collections" onClick={() => setMobileOpen(false)}>All Collections</Link>
                  <Link href="/shop/women?collection=pastel-dreams" onClick={() => setMobileOpen(false)}>Pastel Dreams</Link>
                  <Link href="/shop/women?collection=summer-2026" onClick={() => setMobileOpen(false)}>Summer 2026</Link>
                </div>
              )}
            </div>

            {/* Company Sub-nav */}
            <div className="mobile-nav-item">
              <div className="mobile-nav-trigger-row">
                <span className="mobile-nav-link-span">
                  Company
                </span>
                <button
                  type="button"
                  className="mobile-nav-expand-btn"
                  onClick={() => toggleExpand('company')}
                >
                  {expandedMenu === 'company' ? '−' : '+'}
                </button>
              </div>
              {expandedMenu === 'company' && (
                <div className="mobile-sub-nav">
                  <Link href="/about" onClick={() => setMobileOpen(false)}>About us</Link>
                  <Link href="/journal" onClick={() => setMobileOpen(false)}>Journal</Link>
                  <Link href="/faq" onClick={() => setMobileOpen(false)}>FAQ</Link>
                  <Link href="/contact" onClick={() => setMobileOpen(false)}>Contact us</Link>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
      <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  )
}
