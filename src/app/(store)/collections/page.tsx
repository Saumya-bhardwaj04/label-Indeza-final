import Link from 'next/link'
import { getCollections } from '@/lib/data'

export default async function CollectionsPage() {
  const collections = await getCollections(true)

  return (
    <main style={{ marginTop: 64, padding: '80px 0' }}>
      <div className="container">
        <h1 className="section-title" style={{ textAlign: 'center', marginBottom: 48 }}>
          Collections
        </h1>
        <div className="collections-grid">
          {collections.map((col) => (
            <Link
              key={col.id}
              href={`/shop/women?collection=${col.slug}`}
              className="collection-card"
              style={{
                background: col.bgColor,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 280,
                position: 'relative',
                overflow: 'hidden',
                borderRadius: 16,
                padding: 32,
              }}
            >
              {col.bannerImage && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.15, zIndex: 0 }}>
                  <img src={col.bannerImage} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              )}
              <div style={{ position: 'relative', zIndex: 1 }}>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 32, fontWeight: 500 }}>{col.name}</h2>
                {col.description && (
                  <p style={{ marginTop: 12, color: '#333', lineHeight: 1.6 }}>{col.description}</p>
                )}
              </div>
              <span style={{ display: 'inline-block', marginTop: 24, fontWeight: 500, position: 'relative', zIndex: 1 }}>
                Shop collection →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
