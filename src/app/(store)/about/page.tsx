'use client'
import { useState, useEffect } from 'react'

export default function AboutPage() {
  const [s, setS] = useState<Record<string, string>>({})

  useEffect(() => {
    fetch('/api/settings?group=about', { cache: 'no-store' })
      .then(r => r.json())
      .then(setS)
      .catch(() => {})
  }, [])

  const stats = [
    {
      number: s.about_stat_1_num || '16K+',
      label: s.about_stat_1_label || 'Pieces sold worldwide',
      sub: 'Loved by customers worldwide.',
      bg: '#F5C5D5'
    },
    {
      number: s.about_stat_2_num || '12+',
      label: s.about_stat_2_label || 'Countries reached',
      sub: 'Spreading comfort globally.',
      bg: '#D4C5E8'
    },
    {
      number: s.about_stat_3_num || '98%',
      label: s.about_stat_3_label || 'Customer satisfaction rate',
      sub: 'Our buyers fall in love with the fit.',
      bg: '#FFF3B0'
    },
    {
      number: s.about_stat_4_num || '0%',
      label: s.about_stat_4_label || "We don't overproduce",
      sub: 'Rooted in slow fashion.',
      bg: '#A8C4A2'
    },
  ]

  const galleryImages = [
    'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=400',
    'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
    'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=400',
    'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=400',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=400',
  ]

  return (
    <main style={{ marginTop: 64 }}>
      <section className="about-hero">
        <h1
          style={{
            fontFamily: 'Cormorant Garamond, serif',
            fontSize: 'clamp(36px,5vw,64px)',
            fontWeight: 400,
          }}
        >
          About us
        </h1>
        <p style={{ fontSize: 18, color: 'rgba(0,0,0,0.55)', marginTop: 16 }}>
          Get to know the story, values, and vision behind Label Indeza —<br />
          where modern fashion meets mindful design.
        </p>
      </section>

      <section style={{ padding: '80px 0' }}>
        <div className="container about-images-grid">
          {[
            'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=600',
            'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=600',
            'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600',
          ].map((src, i) => (
            <div key={i} style={{ borderRadius: 16, overflow: 'hidden', aspectRatio: '3/4' }}>
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </section>

      <section style={{ padding: '40px 0 80px' }}>
        <div className="container">
          <blockquote
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(20px,3vw,36px)',
              fontWeight: 400,
              lineHeight: 1.5,
              textAlign: 'center',
              maxWidth: 860,
              margin: '0 auto',
              color: '#1A1A1A',
            }}
          >
            {s.about_pull_quote || (
              <>
                Label Indeza is an online clothing brand built around the beauty of contrast — clean
                silhouettes in expressive tones. Whether it&apos;s a lavender tee or a peach-toned hoodie,
                our collections are designed to be both{' '}
                <em style={{ color: '#9B7FBB' }}>effortless and eye-catching.</em>
              </>
            )}
          </blockquote>
        </div>
      </section>

      <section style={{ padding: '60px 0' }}>
        <div className="container about-section-split">
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 40, fontWeight: 400 }}>
              Our Vision
            </h2>
            <p style={{ marginTop: 20, color: '#6B6B6B', lineHeight: 1.8 }}>
              {s.about_vision_text || 'At Label Indeza, we believe that beauty lives in the balance of contrast, bold simplicity, soft structure, and expressive tones. Our vision is to redefine everyday fashion with calm confidence and effortless charm.'}
            </p>
          </div>
          <div style={{ flex: 1, borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3' }}>
            <img
              src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800"
              alt="Our Vision"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 0' }}>
        <div className="container about-section-split reverse">
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 40, fontWeight: 400 }}>
              Our Mission
            </h2>
            <p style={{ marginTop: 20, color: '#6B6B6B', lineHeight: 1.8 }}>
              {s.about_mission_text || 'We exist to create thoughtful pieces designed to be worn, loved, and lived in. Every garment is made with attention to detail, embracing slow fashion principles that respect both people and planet.'}
            </p>
          </div>
          <div style={{ flex: 1, borderRadius: 16, overflow: 'hidden', aspectRatio: '4/3' }}>
            <img
              src="https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800"
              alt="Our Mission"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </div>
        </div>
      </section>

      <section style={{ padding: '80px 0', textAlign: 'center' }}>
        <div className="container">
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 36, fontWeight: 400 }}>
            Label Indeza by the Numbers
          </h2>
          <p style={{ color: '#6B6B6B', marginTop: 8, fontSize: 14 }}>
            A glimpse into the reach and impact — measured through purpose, not just numbers.
          </p>
          <div className="about-stats-grid">
            {stats.map((st, i) => (
              <div
                key={i}
                style={{
                  background: st.bg,
                  borderRadius: 16,
                  padding: '32px 24px',
                  textAlign: 'left',
                }}
              >
                <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 52, fontWeight: 500 }}>
                  {st.number}
                </h3>
                <p style={{ fontWeight: 500, marginTop: 8 }}>{st.label}</p>
                <p style={{ fontSize: 13, color: '#6B6B6B', marginTop: 6 }}>{st.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section style={{ padding: '60px 0 80px' }}>
        <div className="container" style={{ marginBottom: 32 }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, fontWeight: 400 }}>
            What You&apos;ll Find at Label Indeza
          </h2>
          <p style={{ color: '#6B6B6B', marginTop: 8 }}>
            Essential hoodies, breezy tees, timeless accessories, and small seasonal collections.
          </p>
        </div>
        <div className="about-gallery-scroll">
          {galleryImages.map((src, i) => (
            <div
              key={i}
              style={{
                flexShrink: 0,
                width: 240,
                borderRadius: 16,
                overflow: 'hidden',
                aspectRatio: '3/4',
              }}
            >
              <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ))}
        </div>
      </section>
    </main>
  )
}
