'use client'

const posts = [
  { title: 'The Art of Draping: A Modern Guide', date: 'May 28, 2026', category: 'Style Guide', excerpt: 'Discover how traditional draping techniques are being reimagined for the modern wardrobe.', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600' },
  { title: 'Pastels and Why They Never Go Out of Style', date: 'May 15, 2026', category: 'Trends', excerpt: 'Soft hues have dominated runways for decades. Here is why pastels are timeless.', img: 'https://images.unsplash.com/photo-1485462537746-965f33f7f6a7?w=600' },
  { title: 'Dressing for Every Occasion', date: 'May 2, 2026', category: 'Styling Tips', excerpt: 'From casual brunches to festive celebrations — a complete guide to dressing right.', img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600' },
]

export default function JournalPage() {
  return (
    <main style={{ marginTop: 64 }}>
      <section style={{ background: '#FAF8F5', padding: '120px 0 60px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 400 }}>
          The Journal
        </h1>
        <p style={{ color: '#666', marginTop: '12px' }}>Style stories, trend guides, and behind-the-scenes from Label Indeza</p>
      </section>

      <section style={{ padding: '60px 0 100px' }}>
        <div className="container">
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '32px' }}>
            {posts.map((post, i) => (
              <article key={i} style={{ cursor: 'pointer' }}>
                <div style={{ borderRadius: '16px', overflow: 'hidden', aspectRatio: '4/3', marginBottom: '20px' }}>
                  <img
                    src={post.img}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.5s' }}
                    onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.05)')}
                    onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                  />
                </div>
                <span style={{ fontSize: '11px', fontWeight: 600, color: '#E8B4C8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{post.category}</span>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '22px', fontWeight: 400, margin: '8px 0 10px', lineHeight: 1.3 }}>{post.title}</h2>
                <p style={{ color: '#666', fontSize: '14px', lineHeight: 1.6, marginBottom: '12px' }}>{post.excerpt}</p>
                <span style={{ fontSize: '12px', color: '#999' }}>{post.date}</span>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
