export default function ShippingPage() {
  return (
    <main style={{ marginTop: 64 }}>
      <section style={{ background: '#FAF8F5', padding: '120px 0 40px' }}>
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '48px', fontWeight: 400, marginBottom: '8px' }}>
            Shipping &amp; Returns
          </h1>
          <p style={{ color: '#888', fontSize: '13px' }}>Last updated: June 2026</p>
        </div>
      </section>
      <section style={{ padding: '40px 0 100px' }}>
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>
          <div style={{ color: '#555', lineHeight: 1.8, fontSize: '15px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A1A', margin: '0 0 12px' }}>Shipping</h2>
            <p>We ship pan-India. Standard delivery takes 5–7 working days. Express delivery (2–3 days) is available for select pin codes at an additional charge. Orders above ₹999 qualify for free standard shipping.</p>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A1A', margin: '32px 0 12px' }}>Returns</h2>
            <p>We accept returns within 30 days of delivery. Items must be unused, unwashed, with all original tags and packaging intact. To initiate a return, email us at hello@labelindeza.com with your order number.</p>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A1A', margin: '32px 0 12px' }}>Refunds</h2>
            <p>Once your return is received and inspected, we will notify you by email. Refunds are processed within 5–7 business days to your original payment method. Shipping charges are non-refundable.</p>
            <h2 style={{ fontSize: '20px', fontWeight: 600, color: '#1A1A1A', margin: '32px 0 12px' }}>Exchanges</h2>
            <p>We currently do not offer direct exchanges. Please return the item and place a new order for the desired size or variant.</p>
          </div>
        </div>
      </section>
    </main>
  )
}
