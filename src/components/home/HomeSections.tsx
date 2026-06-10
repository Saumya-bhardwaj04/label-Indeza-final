import Link from 'next/link'
import { CATEGORY_TILES } from '@/lib/home-assets'
import ScrollReveal from '@/components/ScrollReveal'

export default function HomeSections() {
  return (
    <>
      <section className="categories section-pad" id="categories">
        <div className="container">
          <ScrollReveal className="categories-header">
            <h2 className="section-title">Shop Categories</h2>
            <p className="section-subtitle">Find and find what you want</p>
          </ScrollReveal>
          <div className="categories-grid">
            {CATEGORY_TILES.map((cat, index) => (
              <ScrollReveal key={cat.name} delay={index * 0.08}>
                <Link href={cat.href} className="category-tile">
                  <img src={cat.image} alt={cat.name} />
                  <div className="category-bar" style={{ background: cat.barBg }}>
                    <h3>{cat.name}</h3>
                    <p>{cat.sub}</p>
                  </div>
                </Link>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <section className="trust-badges section-pad">
        <div className="container badges-grid">
          {[
            {
              icon: '🔒',
              bg: '#E8F5E9',
              title: 'Secure Checkout',
              text: 'Your info stays safe with us. All payments are encrypted and protected.',
            },
            {
              icon: '🔄',
              bg: '#FCE4EC',
              title: 'Easy Returns',
              text: 'Changed your mind? No worries — 30 days to send it back, stress-free.',
            },
            {
              icon: '🌍',
              bg: '#E3F2FD',
              title: 'Worldwide Delivery',
              text: 'From our shop to your doorstep. Fast, reliable shipping wherever you are.',
            },
            {
              icon: '💬',
              bg: '#FFFDE7',
              title: 'Here to Help',
              text: "Need something? Our support team's just a message away — always happy to chat.",
            },
          ].map((b, index) => (
            <ScrollReveal key={b.title} delay={index * 0.08}>
              <div className="badge">
                <div className="badge-icon" style={{ background: b.bg }}>
                  {b.icon}
                </div>
                <div>
                  <h4>{b.title}</h4>
                  <p>{b.text}</p>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </>
  )
}
