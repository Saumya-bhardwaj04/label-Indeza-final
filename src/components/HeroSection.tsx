'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

export default function HeroSection() {
  const [heroMedia, setHeroMedia] = useState<any>(null)
  const [content, setContent] = useState<any>({})
  const [loaded, setLoaded] = useState(false)
  const [mediaLoaded, setMediaLoaded] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fetchHero = async () => {
      try {
        const [mediaRes, contentRes] = await Promise.all([
          fetch('/api/hero', { cache: 'no-store' }),
          fetch('/api/content', { cache: 'no-store' }),
        ])
        const [media, cont] = await Promise.all([
          mediaRes.json(),
          contentRes.json(),
        ])
        if (!cancelled) {
          setHeroMedia(media)
          setContent(cont)
          setLoaded(true)
        }
      } catch (e) {
        console.error('Hero fetch failed', e)
        if (!cancelled) {
          setLoaded(true)
          setMediaLoaded(true) // Fail-safe
        }
      }
    }

    fetchHero()

    // Safety timeout: auto-hide loader after 4.5 seconds if media fails to load or slow connection
    const timer = setTimeout(() => {
      setMediaLoaded(true)
    }, 4500)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, []) // runs on every mount, including back-navigation

  useEffect(() => {
    const targetSection = sessionStorage.getItem('last_clicked_section')
    if (!targetSection) return

    let attempts = 0
    const interval = setInterval(() => {
      attempts++
      const element = document.getElementById(targetSection)
      if (element) {
        const rect = element.getBoundingClientRect()
        if (rect.top !== 0 || attempts > 30) {
          element.scrollIntoView({ behavior: 'auto', block: 'center' })
          sessionStorage.removeItem('last_clicked_section')
          clearInterval(interval)
        }
      }
      if (attempts > 50) {
        clearInterval(interval)
      }
    }, 100)

    return () => clearInterval(interval)
  }, [])


  const videoUrl = heroMedia?.type === 'video' ? heroMedia.url : null
  const imageUrl = heroMedia?.type === 'image' ? heroMedia.url : null
  const title = content?.hero_title || 'Effortless Style,\nThoughtfully Made'
  const subtitle = content?.hero_subtitle || 'Modern essentials in soft tones and timeless cuts.'

  return (
    <section className="hero">
      {/* Fullscreen Embroidery Preloader */}
      <div className={`preloader ${mediaLoaded ? 'fade-out' : ''}`}>
        <div className="embroidery-wrapper">
          <div className="embroidery-hoop-outer" />
          <div className="embroidery-hoop" />
          <svg className="embroidery-needle-svg" width="130" height="130" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Thread (Back/Behind Needle Loop) */}
            <path
              className="embroidery-thread-path"
              d="M52,12 C58,2 68,14 62,28 C58,36 48,32 42,26 C34,20 30,32 32,46 C33,52 31,50 28,56"
              stroke="#8C8275"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
            
            {/* Spool 1 (Back, Dark Charcoal) */}
            <g transform="translate(30, 60) rotate(35)">
              <rect x="-6" y="-8" width="12" height="1.8" rx="0.4" fill="#C4BDB3" stroke="#8C8275" strokeWidth="0.4" />
              <rect x="-6" y="6.2" width="12" height="1.8" rx="0.4" fill="#C4BDB3" stroke="#8C8275" strokeWidth="0.4" />
              <rect x="-5" y="-6.2" width="10" height="12.4" rx="0.8" fill="#423C35" />
              <line x1="-5" y1="-4" x2="5" y2="-4" stroke="#524A42" strokeWidth="0.5" />
              <line x1="-5" y1="-2" x2="5" y2="-2" stroke="#524A42" strokeWidth="0.5" />
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#524A42" strokeWidth="0.5" />
              <line x1="-5" y1="2" x2="5" y2="2" stroke="#524A42" strokeWidth="0.5" />
              <line x1="-5" y1="4" x2="5" y2="4" stroke="#524A42" strokeWidth="0.5" />
            </g>

            {/* Spool 2 (Front, Warm Plum/Brown) */}
            <g transform="translate(24, 55) rotate(-25)">
              <rect x="-6" y="-8" width="12" height="1.8" rx="0.4" fill="#D5CEC4" stroke="#8C8275" strokeWidth="0.4" />
              <rect x="-6" y="6.2" width="12" height="1.8" rx="0.4" fill="#D5CEC4" stroke="#8C8275" strokeWidth="0.4" />
              <rect x="-5" y="-6.2" width="10" height="12.4" rx="0.8" fill="#7E6C5C" stroke="#5E4F42" strokeWidth="0.4" />
              <line x1="-5" y1="-4" x2="5" y2="-4" stroke="#927E6D" strokeWidth="0.5" />
              <line x1="-5" y1="-2" x2="5" y2="-2" stroke="#927E6D" strokeWidth="0.5" />
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#927E6D" strokeWidth="0.5" />
              <line x1="-5" y1="2" x2="5" y2="2" stroke="#927E6D" strokeWidth="0.5" />
              <line x1="-5" y1="4" x2="5" y2="4" stroke="#927E6D" strokeWidth="0.5" />
            </g>

            {/* Needle (Front/Over Thread with Pointed Tip) */}
            <g className="embroidery-needle-group">
              <path
                d="M51.5,8 C51.5,5.5 52.5,5.5 52.5,8 L52.4,50 L52,57 L51.6,50 Z"
                fill="#E8E4DF"
                stroke="#8C8275"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
              <ellipse cx="52" cy="12" rx="0.3" ry="2.2" fill="#FAF8F5" />
            </g>
          </svg>
        </div>
        <p style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', fontSize: '20px', color: '#8C8275', marginTop: '24px', letterSpacing: '0.08em', fontWeight: 300, margin: '24px 0 0 0' }}>
          Label Indeza
        </p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
          <span style={{ width: '16px', height: '1px', backgroundColor: '#D0C8BC' }} />
          <p style={{ fontSize: '10px', textTransform: 'uppercase', color: '#B0A696', letterSpacing: '0.25em', margin: 0 }}>
            Crafting Elegance
          </p>
          <span style={{ width: '16px', height: '1px', backgroundColor: '#D0C8BC' }} />
        </div>
      </div>

      {/* Background media — only mount once the API has resolved */}
      {loaded && (
        <>
          {videoUrl ? (
            <video
              className="hero-video"
              autoPlay
              muted
              loop
              playsInline
              poster={imageUrl || '/images/serene-flow-dress.png'}
              onLoadedData={() => setMediaLoaded(true)}
              onCanPlay={() => setMediaLoaded(true)}
            >
              <source src={videoUrl} type="video/mp4" />
              <img
                src={imageUrl || '/images/serene-flow-dress.png'}
                className="hero-image"
                alt="Label Indeza"
                onLoad={() => setMediaLoaded(true)}
              />
            </video>
          ) : (
            <img
              src={imageUrl || '/images/serene-flow-dress.png'}
              className="hero-image"
              alt="Label Indeza hero"
              onLoad={() => setMediaLoaded(true)}
              onError={(e) => {
                e.currentTarget.src = '/images/serene-flow-dress.png'
                setMediaLoaded(true)
              }}
            />
          )}
        </>
      )}

      <div className="hero-overlay" />

      {/* Content — visible immediately for seamless SSR and instant load */}
      <div className="hero-content container">
        <div className="hero-text" style={{ transition: 'opacity 0.4s ease' }}>
          <h1 className="hero-title" style={{ color: '#DECBA7' }}>
            {title.split('\n').map((line: string, i: number) => (
              <span key={i}>{line}{i < title.split('\n').length - 1 && <br />}</span>
            ))}
          </h1>
          <p className="hero-subtitle" style={{ color: '#DECBA7', marginTop: '20px', fontSize: '16px', lineHeight: 1.6, maxWidth: '440px' }}>
            {subtitle}
          </p>
          <div style={{ display: 'flex', gap: '12px', marginTop: '36px', flexWrap: 'wrap' }}>
            <Link href="/shop/women" className="btn-primary">Shop Women →</Link>
            <Link href="/customize" className="btn-secondary" style={{ color: '#DECBA7', borderColor: '#DECBA7' }}>Customize →</Link>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator" style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', zIndex: 2 }}>
        <span style={{ color: '#DECBA7', fontSize: '20px', opacity: 0.7 }}>↓</span>
      </div>
    </section>
  )
}
