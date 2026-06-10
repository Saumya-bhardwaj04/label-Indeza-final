// src/lib/email.ts
import nodemailer from 'nodemailer'
import { Resend } from 'resend'

// Brevo — primary
const brevoTransporter = nodemailer.createTransport({
  host:   'smtp-relay.brevo.com',
  port:   587,
  secure: false,
  auth: {
    user: process.env.BREVO_SMTP_LOGIN,
    pass: process.env.BREVO_SMTP_KEY,
  },
})

// Resend — fallback
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy')

const FROM = process.env.EMAIL_FROM || 'onboarding@resend.dev'
const rawSite = process.env.NEXTAUTH_URL || 'http://localhost:3000'
const SITE = rawSite.replace(/\/api\/(customer\/)?auth$/, '')

// ── Shared HTML layout ────────────────────────────────────────
function emailLayout(content: string): string {
  const logoUrl = 'https://res.cloudinary.com/debyjcluz/image/upload/v1780862687/label-indeza/email-logo.png'
  return `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background:#F5F0EB;font-family:system-ui,sans-serif;">
      <div style="max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        <div style="background:#1A1A1A;padding:24px 36px;text-align:center;">
          <img src="${logoUrl}" height="36" style="display:inline-block;height:36px;width:auto;vertical-align:middle;" alt="Label Indeza Logo" />
          <span style="color:#DECBA7;font-family:'Cormorant Garamond',serif;font-size:24px;vertical-align:middle;margin-left:12px;letter-spacing:1px;font-weight:500;">Label Indeza</span>
        </div>
        <div style="padding:36px;">${content}</div>
        <div style="background:#F9F7F4;padding:20px 36px;border-top:1px solid #EEE;">
          <p style="color:#999;font-size:12px;margin:0;text-align:center;">
            © Label Indeza 2026 · <a href="https://www.google.com/maps/place/LABEL+INDEZA/@28.6416068,77.366961,17z/data=!3m1!4b1!4m6!3m5!1s0x390cfb07e641b5d9:0x175a763fbd5b21b3!8m2!3d28.6416022!4d77.3715744!16s%2Fg%2F11z27cmyjk" style="color:#999;text-decoration:underline;">Visit Store</a>
          </p>
          <p style="color:#AAA;font-size:11px;margin:6px 0 0;text-align:center;line-height:1.4;">
            GF-5, Plot no. 478, opp. Shipra Srishti, Niti Khand 2, Indirapuram, Ghaziabad, Uttar Pradesh 201014
          </p>
        </div>
      </div>
    </body>
    </html>
  `
}

// ── Generic send function ─────────────────────────────────────
export async function sendEmail({
  to,
  subject,
  html,
}: {
  to:      string
  subject: string
  html:    string
}) {
  // --- Try Brevo first ---
  try {
    await brevoTransporter.sendMail({
      from:    `"Label Indeza" <${FROM}>`,
      to,
      subject,
      html,
    })
    return  // success — exit here
  } catch (brevoErr) {
    console.error('Brevo failed, falling back to Resend:', brevoErr)
  }

  // --- Fallback: Resend ---
  try {
    const { error } = await resend.emails.send({
      from:    `Label Indeza <${FROM}>`,
      to:      [to],
      subject,
      html,
    })
    if (error) console.error('Resend fallback error:', error)
  } catch (resendErr) {
    console.error('Resend fallback also failed:', resendErr)
    // Don't throw — email failure should not break the main flow
  }
}

// ── OTP Email ─────────────────────────────────────────────────
export async function sendOTPEmail(email: string, code: string) {
  await sendEmail({
    to:      email,
    subject: 'Your Label Indeza sign-in code',
    html:    emailLayout(`
      <h2 style="font-size:24px;font-weight:600;margin:0 0 8px;">Sign in to Label Indeza</h2>
      <p style="color:#666;margin:0 0 28px;">Your one-time sign-in code:</p>
      <div style="background:#F5F0EB;border-radius:12px;padding:32px;text-align:center;">
        <p style="font-size:13px;color:#888;margin:0 0 12px;">Your code</p>
        <h1 style="font-size:48px;font-weight:700;letter-spacing:10px;color:#1A1A1A;margin:0;">${code}</h1>
        <p style="font-size:13px;color:#999;margin:12px 0 0;">Expires in 10 minutes</p>
      </div>
      <p style="font-size:13px;color:#999;margin-top:24px;text-align:center;">If you didn't request this, ignore this email.</p>
    `),
  })
}

function getEmailImageUrl(itemImage: string, siteUrl: string) {
  if (itemImage && (itemImage.startsWith('http://') || itemImage.startsWith('https://'))) {
    if (itemImage.includes('localhost')) {
      return getPublicMockImage(itemImage)
    }
    return itemImage
  }

  if (siteUrl.includes('localhost')) {
    return getPublicMockImage(itemImage)
  }

  return `${siteUrl}${itemImage}`
}

function getPublicMockImage(itemImage: string) {
  const normalized = (itemImage || '').toLowerCase()
  if (normalized.includes('skirt')) {
    return 'https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=300&q=80'
  }
  if (normalized.includes('hoodie')) {
    return 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=300&q=80'
  }
  if (normalized.includes('dress')) {
    return 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=300&q=80'
  }
  if (normalized.includes('earrings') || normalized.includes('accessories')) {
    return 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=300&q=80'
  }
  return 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=300&q=80'
}

// ── Order Confirmed ───────────────────────────────────────────
export async function sendOrderConfirmedEmail(order: any) {
  const itemsHtml = order.items.map((item: any) => {
    const imgUrl = getEmailImageUrl(item.image, SITE)
    return `
      <div style="display:flex;align-items:center;gap:12px;padding:12px 0;border-bottom:1px solid #F0F0F0;">
        <img src="${imgUrl}" width="52" height="64" style="border-radius:8px;object-fit:cover;" />
        <div style="flex:1;">
          <p style="font-weight:500;margin:0;">${item.name}</p>
          ${item.selectedSize ? `<p style="font-size:13px;color:#888;margin:4px 0 0;">Size: ${item.selectedSize}</p>` : ''}
        </div>
        <span style="font-weight:600;">₹${item.price * item.quantity}</span>
      </div>
    `
  }).join('')

  await sendEmail({
    to:      order.customerEmail,
    subject: `Order Confirmed — #${order._id.toString().slice(-8).toUpperCase()} · Label Indeza`,
    html:    emailLayout(`
      <h2 style="font-size:24px;font-weight:600;margin:0 0 8px;">Order Confirmed! 🎉</h2>
      <p style="color:#666;margin:0 0 24px;">Hi ${order.customerName}, your order has been placed.</p>
      <div style="background:#F0FDF4;border-radius:10px;padding:14px 18px;margin-bottom:24px;">
        <p style="margin:0;color:#15803D;font-weight:500;">✓ Payment confirmed · Order #${order._id.toString().slice(-8).toUpperCase()}</p>
      </div>
      ${itemsHtml}
      <div style="border-top:2px solid #1A1A1A;margin-top:16px;padding-top:16px;display:flex;justify-content:space-between;">
        <span style="font-weight:700;">Total</span>
        <span style="font-weight:700;">₹${order.total}</span>
      </div>
      <div style="background:#F9F7F4;border-radius:10px;padding:16px;margin-top:20px;">
        <p style="font-weight:600;margin:0 0 8px;font-size:14px;">Delivering to</p>
        <p style="margin:0;font-size:13px;color:#555;line-height:1.7;">
          ${order.deliveryAddress.fullName} · ${order.deliveryAddress.phone}<br/>
          ${order.deliveryAddress.city}, ${order.deliveryAddress.state} — ${order.deliveryAddress.pincode}
        </p>
      </div>
      <div style="text-align:center;margin-top:28px;">
        <a href="${SITE}/account/orders/${order._id}"
          style="background:#1A1A1A;color:white;padding:14px 28px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:500;">
          Track Your Order →
        </a>
      </div>
    `),
  })
}

// ── Order Shipped ─────────────────────────────────────────────
export async function sendOrderShippedEmail(order: any) {
  await sendEmail({
    to:      order.customerEmail,
    subject: `Your order is on its way! 🚚 · Label Indeza`,
    html:    emailLayout(`
      <h2 style="font-size:24px;font-weight:600;margin:0 0 8px;">On its way! 🚚</h2>
      <p style="color:#666;margin:0 0 24px;">Hi ${order.customerName}, order #${order._id.toString().slice(-8).toUpperCase()} has been shipped.</p>
      <div style="text-align:center;margin-top:28px;">
        <a href="${SITE}/account/orders/${order._id}"
          style="background:#1A1A1A;color:white;padding:14px 28px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:500;">
          Track Order →
        </a>
      </div>
    `),
  })
}

// ── Order Delivered ───────────────────────────────────────────
export async function sendOrderDeliveredEmail(order: any) {
  await sendEmail({
    to:      order.customerEmail,
    subject: `Your order has arrived! ✨ · Label Indeza`,
    html:    emailLayout(`
      <h2 style="font-size:24px;font-weight:600;margin:0 0 8px;">Delivered! ✨</h2>
      <p style="color:#666;margin:0 0 24px;">Hi ${order.customerName}, your Label Indeza order has arrived. We hope you love it!</p>
      <p style="font-size:14px;color:#555;text-align:center;">
        Share your look on Instagram and tag <strong>@labelindeza</strong>!
      </p>
      <div style="text-align:center;margin-top:28px;">
        <a href="${SITE}/account/orders"
          style="background:#1A1A1A;color:white;padding:14px 28px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:500;">
          View All Orders →
        </a>
      </div>
    `),
  })
}

// ── Subscribe Welcome ─────────────────────────────────────────
export async function sendSubscribeWelcomeEmail(email: string) {
  await sendEmail({
    to:      email,
    subject: 'Welcome to Label Indeza — Here\'s your 20% off code!',
    html:    emailLayout(`
      <h2 style="font-size:24px;font-weight:600;margin:0 0 12px;">Welcome! 🎉</h2>
      <p style="color:#555;margin:0 0 28px;line-height:1.6;">Thank you for joining Label Indeza. Here's your exclusive code:</p>
      <div style="background:#F5F0EB;border-radius:12px;padding:28px;text-align:center;margin-bottom:28px;">
        <p style="font-size:12px;color:#888;margin:0 0 8px;text-transform:uppercase;letter-spacing:0.08em;">Your discount code</p>
        <h2 style="font-size:36px;font-weight:700;letter-spacing:6px;margin:0;color:#1A1A1A;">WELCOME20</h2>
        <p style="font-size:12px;color:#999;margin:10px 0 0;">20% off your first order · No minimum</p>
      </div>
      <div style="text-align:center;">
        <a href="${SITE}" style="background:#1A1A1A;color:white;padding:14px 32px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:500;">Shop Now →</a>
      </div>
    `),
  })
}

// ── Contact Auto-Reply ────────────────────────────────────────
export async function sendContactAutoReply(name: string, email: string) {
  await sendEmail({
    to:      email,
    subject: 'We received your message — Label Indeza',
    html:    emailLayout(`
      <h2 style="font-size:24px;font-weight:600;margin:0 0 12px;">We got your message!</h2>
      <p style="color:#555;line-height:1.6;">
        Hi ${name}, thank you for reaching out. Our team will get back to you within 24 hours.
      </p>
      <div style="text-align:center;margin-top:28px;">
        <a href="${SITE}" style="background:#1A1A1A;color:white;padding:14px 28px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:500;">Back to Store →</a>
      </div>
    `),
  })
}

// ── Bespoke Request Auto-Reply ────────────────────────────────
export async function sendBespokeAutoReply(name: string, email: string, requestId: string) {
  await sendEmail({
    to:      email,
    subject: 'Bespoke request received — Label Indeza',
    html:    emailLayout(`
      <h2 style="font-size:24px;font-weight:600;margin:0 0 12px;">Request received! ✨</h2>
      <p style="color:#555;line-height:1.6;">
        Hi ${name}, your bespoke request has been received. Our design team will review it and get back to you within 48 hours with a quote.
      </p>
      <div style="background:#F5F0EB;border-radius:10px;padding:14px 18px;margin:20px 0;">
        <p style="font-size:12px;color:#888;margin:0 0 4px;">Reference</p>
        <p style="font-weight:700;font-size:16px;margin:0;">#${requestId.slice(-8).toUpperCase()}</p>
      </div>
    `),
  })
}

// ── Admin Invite ──────────────────────────────────────────────
export async function sendAdminInviteEmail(name: string, email: string, token: string) {
  const link = `${SITE}/admin/set-password?token=${token}`
  await sendEmail({
    to:      email,
    subject: `You've been added as admin — Label Indeza`,
    html:    emailLayout(`
      <h2 style="font-size:24px;font-weight:600;margin:0 0 12px;color:#1A1A1A;">Hi ${name}, you're an admin!</h2>
      <p style="color:#555;line-height:1.6;margin-bottom:24px;">
        You've been added as an admin for Label Indeza. Click below to set your password.
      </p>
      <div style="text-align:center;">
        <a href="${link}" style="background:#1A1A1A;color:white;padding:14px 32px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:500;">Set My Password →</a>
      </div>
      <p style="font-size:12px;color:#999;text-align:center;margin-top:20px;">This link expires in 48 hours.</p>
    `),
  })
}

// ── Customer Login Welcome ────────────────────────────────────
export async function sendLoginWelcomeEmail(email: string, name: string) {
  await sendEmail({
    to:      email,
    subject: 'Welcome to Label Indeza — Your Style Space is Ready ✨',
    html:    emailLayout(`
      <div style="text-align:center;margin-bottom:28px;">
        <span style="font-size:40px;">✨</span>
        <h2 style="font-size:24px;font-weight:600;margin:16px 0 8px;color:#1A1A1A;font-family:'Cormorant Garamond',serif;">Hello, ${name}</h2>
        <p style="color:#666;margin:0;font-size:15px;font-style:italic;">Welcome to your Label Indeza account.</p>
      </div>

      <p style="color:#444;margin:0 0 20px;line-height:1.6;font-size:14px;text-align:center;">
        We're thrilled to have you here. We craft each garment with quiet comfort, intentional lines, and high-quality materials designed to last.
      </p>
      
      <div style="background:#F9F7F4;border-radius:12px;padding:24px;margin-bottom:28px;border:1px solid #EAEAEA;">
        <h3 style="font-size:15px;font-weight:600;margin:0 0 12px;color:#1A1A1A;text-transform:uppercase;letter-spacing:0.05em;font-size:12px;">What to explore first</h3>
        <div style="margin-bottom:12px;">
          <strong style="color:#1A1A1A;font-size:14px;">🌸 Pastel Dreams Collection</strong>
          <p style="margin:4px 0 0;font-size:13px;color:#666;line-height:1.4;">Soft blush, sage serenity, and lavender tones designed for quiet confidence.</p>
        </div>
        <div>
          <strong style="color:#1A1A1A;font-size:14px;">✂️ Bespoke Customization</strong>
          <p style="margin:4px 0 0;font-size:13px;color:#666;line-height:1.4;">Garments custom tailored to your exact measurements for an effortless fit.</p>
        </div>
      </div>

      <div style="text-align:center;margin-bottom:12px;">
        <a href="${SITE}" style="background:#1A1A1A;color:white;padding:14px 36px;border-radius:999px;text-decoration:none;font-size:14px;font-weight:500;display:inline-block;letter-spacing:0.5px;">
          Enter Store →
        </a>
      </div>
    `),
  })
}

