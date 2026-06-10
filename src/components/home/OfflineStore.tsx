'use client'

import ScrollReveal from '@/components/ScrollReveal'

export default function OfflineStore() {
  return (
    <section className="offline-store" aria-labelledby="offline-store-title">
      <div className="offline-store-grid">
        <ScrollReveal>
          <img
            src="/photos/offline-store.png"
            alt="Label Indeza Store"
            className="offline-store-image"
          />
        </ScrollReveal>

        <ScrollReveal className="offline-store-content" delay={0.08}>
          <p className="offline-store-eyebrow">Shop Offline</p>
          <h2 id="offline-store-title" className="offline-store-title" style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
            <img
              src="/photos/logo.png"
              alt="Label Indeza"
              style={{
                height: '64px',
                width: 'auto',
                objectFit: 'contain',
                display: 'block'
              }}
            />
          </h2>
          <p className="offline-store-address">
            GF-5, Plot no. 478, opp. Shipra Srishti,
            <br />
            Niti Khand 2, Indirapuram,
            <br />
            Ghaziabad, Uttar Pradesh 201014
          </p>
          <p className="offline-store-note">New drop comes offline first</p>
          <a
            href="https://www.google.com/maps/place/LABEL+INDEZA/@28.6416068,77.366961,17z/data=!3m1!4b1!4m6!3m5!1s0x390cfb07e641b5d9:0x175a763fbd5b21b3!8m2!3d28.6416022!4d77.3715744!16s%2Fg%2F11z27cmyjk?entry=ttu&g_ep=EgoyMDI2MDUyNy4wIKXMDSoASAFQAw%3D%3D"
            target="_blank"
            rel="noopener noreferrer"
            className="offline-store-button"
          >
            Direction
          </a>
        </ScrollReveal>
      </div>
    </section>
  )
}
