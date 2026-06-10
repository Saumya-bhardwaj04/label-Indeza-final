'use client'
import Link from 'next/link'
import type { CollectionDTO } from '@/lib/data'
import ScrollReveal from '@/components/ScrollReveal'

const COPY = {
  'pastel-dreams': {
    description:
      'Step into a world of soft blush, lavender haze, and sage serenity. Our Pastel Dreams collection celebrates gentle color stories with confident silhouettes.',
    image: '/images/pastel-banner.jpg',
  },
  'summer-2026': {
    description:
      'Light layers, fluid lines, and tones that echo golden hour. Discover pieces made for movement, warmth, and effortless elegance.',
    image: '/images/serene-flow-dress.png',
  },
}

export default function CollectionHero({
  collection,
  title,
  mirrored,
  bannerImage,
  description,
}: {
  collection?: CollectionDTO | null
  title: string
  mirrored?: boolean
  bannerImage?: string
  description?: string
}) {
  const slug = collection?.slug || (mirrored ? 'summer-2026' : 'pastel-dreams')
  const bg = collection?.bgColor || (mirrored ? '#D4C5E8' : '#F5C5D5')
  const defaults = COPY[slug as keyof typeof COPY] || COPY['pastel-dreams']
  const img = collection?.bannerImage || bannerImage || defaults.image
  const body = description || collection?.description || defaults.description

  return (
    <section className="collection-hero section-pad" style={{ background: bg }} id={`${slug}-hero`}>
      <div className={`container collection-hero-inner${mirrored ? ' mirrored' : ''}`}>
        <ScrollReveal className="collection-hero-media">
          <img src={img} alt={title} />
        </ScrollReveal>
        <ScrollReveal className="collection-hero-text" delay={0.1}>
          <h2 className="section-title">{title}</h2>
          <p className="collection-hero-copy">{body}</p>
          <Link
            href={`/shop/women?collection=${slug}`}
            className="btn-primary collection-hero-cta"
            onClick={() => {
              sessionStorage.setItem('last_clicked_section', `${slug}-hero`)
            }}
          >
            Explore Collection →
          </Link>
        </ScrollReveal>
      </div>
    </section>
  )
}
