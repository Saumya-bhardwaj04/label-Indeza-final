'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Search, X } from 'lucide-react'

type SearchProduct = {
  id?: string
  _id?: string
  name: string
  price: number
  image: string
}

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchProduct[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 100)
      document.body.style.overflow = 'hidden'
    } else {
      setQuery('')
      setResults([])
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      return
    }
    const t = setTimeout(async () => {
      const res = await fetch(`/api/products?q=${encodeURIComponent(query)}`)
      setResults(await res.json())
    }, 300)
    return () => clearTimeout(t)
  }, [query])

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 2000,
        background: 'rgba(0,0,0,0.35)',
        backdropFilter: 'blur(4px)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        paddingTop: '120px',
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: 'white',
          borderRadius: '16px',
          width: '90%',
          maxWidth: '600px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '18px 20px',
            borderBottom: results.length > 0 ? '1px solid #F0F0F0' : 'none',
          }}
        >
          <Search size={20} color="#999" />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="What are you looking for today?"
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              fontSize: '16px',
              fontFamily: 'inherit',
              background: 'transparent',
            }}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#999' }}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {results.length > 0 && (
          <div style={{ maxHeight: '320px', overflowY: 'auto' }}>
            {results.map((p) => {
              const id = p.id || String(p._id)
              return (
                <Link
                  key={id}
                  href={`/shop/women?q=${encodeURIComponent(p.name)}`}
                  onClick={onClose}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '14px',
                    padding: '12px 20px',
                    textDecoration: 'none',
                    color: 'inherit',
                    borderBottom: '1px solid #F7F7F7',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#FAFAFA'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent'
                  }}
                >
                  <img
                    src={p.image}
                    alt=""
                    style={{ width: 44, height: 56, objectFit: 'cover', borderRadius: 6 }}
                  />
                  <div>
                    <p style={{ fontWeight: 500, fontSize: 14 }}>{p.name}</p>
                    <p style={{ color: '#888', fontSize: 13, marginTop: 2 }}>
                      ₹{p.price.toLocaleString('en-IN')}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        )}

        {!query && (
          <div style={{ padding: '16px 20px', color: '#999', fontSize: 13 }}>
            Try searching for &ldquo;dress&rdquo;, &ldquo;tops&rdquo;, or &ldquo;accessories&rdquo;
          </div>
        )}

        {query && results.length === 0 && (
          <div style={{ padding: '16px 20px', color: '#999', fontSize: 13 }}>No products found.</div>
        )}
      </div>
    </div>
  )
}
