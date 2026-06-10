export default function TermsPage() {
  return (
    <main style={{ marginTop: 64 }}>
      <section style={{ background: '#FAF8F5', padding: '120px 0 40px' }}>
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', fontWeight: 400, marginBottom: '8px' }}>
            Terms &amp; Conditions
          </h1>
          <p style={{ color: '#888', fontSize: '13px' }}>Last updated: June 2026</p>
        </div>
      </section>
      <section style={{ padding: '40px 0 100px' }}>
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ color: '#555', lineHeight: 1.8, fontSize: '15px' }}>
            <p>By using Label Indeza, you agree to these terms. We reserve the right to update our policies at any time. Continued use of the site constitutes acceptance.</p>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A1A', margin: '32px 0 12px' }}>Use of Service</h2>
            <p>All content on this website is the property of Label Indeza. You may not reproduce, distribute, or create derivative works without prior written consent.</p>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A1A', margin: '32px 0 12px' }}>Orders & Payments</h2>
            <p>All prices are listed in Indian Rupees (₹). Payment is processed securely via Razorpay. We reserve the right to cancel orders in case of pricing errors or stock issues.</p>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A1A', margin: '32px 0 12px' }}>Limitation of Liability</h2>
            <p>Label Indeza shall not be liable for any indirect, incidental, or consequential damages arising from the use of our services or products.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
