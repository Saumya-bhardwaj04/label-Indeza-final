'use client'
import { useState } from 'react'

const faqs = [
  { q: 'What is your return policy?', a: 'We accept returns within 30 days of delivery. Items must be unused, unwashed, and in original packaging. Contact us at hello@labelindeza.com to initiate a return.' },
  { q: 'How long does delivery take?', a: 'Standard delivery takes 5–7 working days across India. Express delivery (2–3 days) is available at checkout for select cities.' },
  { q: 'Do you offer free shipping?', a: 'Yes! Orders above ₹999 qualify for free shipping. For orders below ₹999, a flat delivery charge of ₹99 applies.' },
  { q: 'Can I customize or alter a product?', a: 'Absolutely! Visit our Customize page to request bespoke alterations or fully custom outfits made to your measurements.' },
  { q: 'How do I track my order?', a: 'After placing your order, sign in to your account and visit the Orders section. You will also receive email updates when your order is shipped and delivered.' },
  { q: 'What payment methods do you accept?', a: 'We accept all major credit/debit cards, UPI, net banking, and wallets via Razorpay. All transactions are secured and encrypted.' },
  { q: 'Are the fabric and colours accurate in photos?', a: 'We make every effort to represent colours accurately, but slight variations may occur due to screen calibration. If unsure, contact us before ordering.' },
  { q: 'How do I contact customer support?', a: 'You can reach us via WhatsApp, email at hello@labelindeza.com, or fill out the contact form on our Contact Us page. We respond within 24 hours.' },
]

export default function FAQPage() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <main style={{ marginTop: 64 }}>
      <section style={{ background: '#FAF8F5', padding: '120px 0 60px', textAlign: 'center' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: 'clamp(36px,5vw,60px)', fontWeight: 400 }}>
          Frequently Asked Questions
        </h1>
        <p style={{ color: '#666', marginTop: '12px' }}>Everything you need to know about Label Indeza</p>
      </section>

      <section style={{ padding: '60px 0 100px' }}>
        <div className="container" style={{ maxWidth: '720px', margin: '0 auto' }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderBottom: '1px solid #E8E8E8' }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{
                  width: '100%', textAlign: 'left', padding: '20px 0',
                  background: 'none', border: 'none', cursor: 'pointer',
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  fontFamily: 'inherit', fontSize: '16px', fontWeight: 500,
                }}
              >
                {faq.q}
                <span style={{ fontSize: '20px', color: '#999', flexShrink: 0, marginLeft: '16px', transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.2s' }}>+</span>
              </button>
              {open === i && (
                <p style={{ padding: '0 0 20px', color: '#555', lineHeight: 1.7, fontSize: '15px', margin: 0 }}>
                  {faq.a}
                </p>
              )}
            </div>
          ))}
          <p style={{ marginTop: 40, textAlign: 'center', color: '#6B6B6B' }}>
            Still have questions?{' '}
            <a href="/contact" style={{ color: '#1A1A1A', fontWeight: 500 }}>Contact us</a>
          </p>
        </div>
      </section>
    </main>
  )
}
