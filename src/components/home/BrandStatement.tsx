'use client'
import { useState, useEffect } from 'react'
import PhysicsPills from '@/components/PhysicsPills'
import ScrollReveal from '@/components/ScrollReveal'

export default function BrandStatement({
  imageSrc,
  imageAlt = 'Label Indeza brand story',
}: {
  imageSrc?: string
  imageAlt?: string
}) {
  const [s, setS] = useState<Record<string, string>>({})

  useEffect(() => {
    let cancelled = false
    fetch('/api/settings?group=brand_story', { cache: 'no-store' })
      .then(r => r.json())
      .then(data => { if (!cancelled) setS(data) })
      .catch(() => {})
    return () => { cancelled = true }
  }, [])

  const title = s.brand_story_title || 'A softer take on style.'
  const copy = s.brand_story_body || 'We believe in clothing that whispers rather than shouts — pieces crafted with intention, designed for the rhythm of everyday life. From blush linens to sage knits, every garment is a quiet celebration of comfort and craft.'
  const resolvedSrc = s.brand_story_image || imageSrc || '/images/brand-model.jpg'

  const customPills = s.stat_1_text ? [
    { text: s.stat_1_text, bg: s.stat_1_color || '#D4C5E8' },
    { text: s.stat_2_text, bg: s.stat_2_color || '#A8C4A2' },
    { text: s.stat_3_text, bg: s.stat_3_color || '#F5C5D5' },
    { text: s.stat_4_text, bg: s.stat_4_color || '#FFF3B0' },
    { text: s.stat_5_text, bg: s.stat_5_color || '#F5C5D5' },
  ].filter(p => p.text) : undefined

  return (
    <section className="brand-story section-pad">
      <div className="container brand-inner">
        <ScrollReveal className="brand-left">
          <h2 className="section-title">{title}</h2>
          <p className="brand-copy">{copy}</p>
          <PhysicsPills customPills={customPills} />
        </ScrollReveal>
        <ScrollReveal className="brand-right" delay={0.12}>
          <img src={resolvedSrc} alt={imageAlt} />
        </ScrollReveal>
      </div>
    </section>
  )
}
