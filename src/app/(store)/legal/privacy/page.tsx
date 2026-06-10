export default function PrivacyPage() {
  return (
    <main style={{ marginTop: 64 }}>
      <section style={{ background: '#FAF8F5', padding: '120px 0 40px' }}>
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', fontWeight: 400, marginBottom: '8px' }}>
            Privacy Policy
          </h1>
          <p style={{ color: '#888', fontSize: '13px' }}>Last updated: June 2026</p>
        </div>
      </section>
      <section style={{ padding: '40px 0 100px' }}>
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ color: '#555', lineHeight: 1.8, fontSize: '15px' }}>
            <p>Your privacy matters to us. This policy explains how we collect, use, and protect your personal information when you use Label Indeza.</p>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A1A', margin: '32px 0 12px' }}>Information We Collect</h2>
            <p>We collect your name, email, phone number, and delivery address when you place an order or subscribe to our newsletter. Payment details are processed securely by Razorpay and are never stored on our servers.</p>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A1A', margin: '32px 0 12px' }}>How We Use Your Data</h2>
            <p>We use your information to process orders, send order updates, and — only if you opt in — share style tips and promotions via email. We never sell your data to third parties.</p>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A1A', margin: '32px 0 12px' }}>Your Rights</h2>
            <p>You may request access to, correction of, or deletion of your personal data at any time by contacting us at hello@labelindeza.com.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
