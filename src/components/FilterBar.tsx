'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'

const tabs = ['all', 'outwear', 'tops', 'bottoms', 'accessories'] as const

export default function FilterBar() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const active = searchParams.get('category') || 'all'
  const activeSort = searchParams.get('sort') || 'suggested'

  const [isOpen, setIsOpen] = useState(false)

  const sortOptions = [
    { label: 'Suggested', value: 'suggested' },
    { label: 'Price: Low to High', value: 'price-asc' },
    { label: 'Price: High to Low', value: 'price-desc' },
    { label: 'Newest', value: 'newest' },
  ]

  const activeSortLabel = sortOptions.find(o => o.value === activeSort)?.label || 'Suggested'

  const handleFilter = (cat: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (cat === 'all') params.delete('category')
    else params.set('category', cat)
    router.push(`${pathname}?${params.toString()}`)
  }

  const handleSort = (sortVal: string) => {
    const params = new URLSearchParams(searchParams.toString())
    if (sortVal === 'suggested') params.delete('sort')
    else params.set('sort', sortVal)
    router.push(`${pathname}?${params.toString()}`)
  }

  return (
    <div className="filter-bar container">
      <div className="filter-tabs">
        {tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            className={`filter-tab${active === tab ? ' active' : ''}`}
            onClick={() => handleFilter(tab)}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>
      <div className="sort-wrap" style={{ position: 'relative' }}>
        <span style={{ fontSize: 13, color: '#6B6B6B' }}>Sort by:</span>
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            fontSize: '13px',
            border: '1px solid #E0E0E0',
            borderRadius: '6px',
            background: 'white',
            cursor: 'pointer',
            fontFamily: 'inherit',
            minWidth: '140px',
            justifyContent: 'space-between',
            outline: 'none',
          }}
        >
          <span>{activeSortLabel}</span>
          <ChevronDown size={14} style={{ opacity: 0.6 }} />
        </button>
        {isOpen && (
          <>
            <div 
              onClick={() => setIsOpen(false)} 
              style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, zIndex: 998 }} 
            />
            <div
              style={{
                position: 'absolute',
                top: '100%',
                right: 0,
                marginTop: '4px',
                background: 'white',
                border: '1px solid rgba(0,0,0,0.1)',
                borderRadius: '6px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                zIndex: 999,
                minWidth: '150px',
                padding: '4px 0',
              }}
            >
              {sortOptions.map((opt) => (
                <div
                  key={opt.value}
                  onClick={() => {
                    handleSort(opt.value)
                    setIsOpen(false)
                  }}
                  style={{
                    padding: '8px 12px',
                    fontSize: '13px',
                    cursor: 'pointer',
                    background: activeSort === opt.value ? '#F5F0EB' : 'transparent',
                    color: activeSort === opt.value ? '#1A1A1A' : '#555',
                    fontWeight: activeSort === opt.value ? 600 : 500,
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {opt.label}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
