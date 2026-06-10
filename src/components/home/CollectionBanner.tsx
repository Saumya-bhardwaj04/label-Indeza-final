import Link from 'next/link'
import type { CollectionDTO } from '@/lib/data'

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

export default function CollectionBanner({
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
    <section className="collection-banner section-pad" style={{ background: bg }}>
      <div className={`container banner-inner${mirrored ? ' mirrored' : ''}`}>
        <div className="banner-image reveal">
          <img src={img} alt={title} />
        </div>
        <div className="banner-text reveal">
          <h2 className="section-title">{title}</h2>
          <p className="banner-description">{body}</p>
          <Link href={`/shop/women?collection=${slug}`} className="btn-primary banner-cta">
            Explore Collection →
          </Link>
        </div>
      </div>
    </section>
  )
}
