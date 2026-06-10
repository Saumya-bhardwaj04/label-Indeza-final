import type { CartItem } from '@/context/CartContext'

function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window !== 'undefined' && window.Razorpay) {
      resolve(true)
      return
    }
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export async function startRazorpayCheckout(
  items: CartItem[],
  total: number,
  onSuccess: () => void,
  onError: (message: string) => void
) {
  const loaded = await loadRazorpayScript()
  if (!loaded) {
    onError('Could not load Razorpay. Check your connection.')
    return
  }

  const orderRes = await fetch('/api/razorpay/order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      amount: total,
      items: items.map((i) => ({ id: i.id, name: i.name, qty: i.quantity, price: i.price })),
    }),
  })

  const orderData = await orderRes.json()
  if (!orderRes.ok) {
    onError(orderData.error || 'Failed to create order')
    return
  }

  const options: RazorpayOptions = {
    key: orderData.keyId,
    amount: orderData.amount,
    currency: orderData.currency,
    name: 'Label Indeza',
    description: `Order (${items.length} item${items.length > 1 ? 's' : ''})`,
    order_id: orderData.orderId,
    theme: { color: '#1A1A1A' },
    handler: async (response) => {
      const verifyRes = await fetch('/api/razorpay/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(response),
      })
      const verifyData = await verifyRes.json()
      if (verifyRes.ok && verifyData.success) {
        onSuccess()
      } else {
        onError(verifyData.error || 'Payment verification failed')
      }
    },
    modal: {
      ondismiss: () => {
        onError('Payment cancelled')
      },
    },
  }

  const rzp = new window.Razorpay(options)
  rzp.on('payment.failed', (response) => {
    onError(response.error?.description || 'Payment failed')
  })
  rzp.open()
  // Modal is open — caller keeps loading state until handler / ondismiss
}
