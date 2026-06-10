'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useCart } from '@/context/CartContext'

declare global {
  interface Window {
    __openRazorpay?: (params: {
      orderId:        string
      amount:         number
      pendingOrderId: string
    }) => void
  }
}

interface Props {
  customerName:  string
  customerEmail: string
  onPaymentError?: (msg: string) => void
}

export default function RazorpayCheckout({ customerName, customerEmail, onPaymentError }: Props) {
  const router     = useRouter()
  const { clearCart } = useCart()

  useEffect(() => {
    // Load Razorpay script
    if (!document.getElementById('razorpay-script')) {
      const script    = document.createElement('script')
      script.id       = 'razorpay-script'
      script.src      = 'https://checkout.razorpay.com/v1/checkout.js'
      script.async    = true
      document.body.appendChild(script)
    }

    // Expose global function for checkout page to call
    window.__openRazorpay = ({ orderId, amount, pendingOrderId }) => {
      const options = {
        key:         process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
        amount,
        currency:    'INR',
        name:        'Label Indeza',
        description: 'Fashion essentials',
        order_id:    orderId,

        prefill: {
          name:  customerName,
          email: customerEmail,
        },

        theme: { color: '#1A1A1A' },

        // SUCCESS HANDLER
        handler: async (response: any) => {
          try {
            const res = await fetch('/api/orders/verify-payment', {
              method:  'POST',
              headers: { 'Content-Type': 'application/json' },
              body:    JSON.stringify({
                orderId:           pendingOrderId,
                razorpayOrderId:   response.razorpay_order_id,
                razorpayPaymentId: response.razorpay_payment_id,
                razorpaySignature: response.razorpay_signature,
              }),
            })
            const data = await res.json()

            if (data.success) {
              // Navigate FIRST, then clear cart after a tick so checkout's
              // empty-cart redirect doesn't race against this navigation
              router.push(`/account/orders?success=true&orderId=${data.orderId}`)
              setTimeout(() => {
                clearCart()
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('pendingOrderId')
                  sessionStorage.removeItem('razorpayOrderId')
                }
              }, 500)
            } else {
              if (onPaymentError) {
                onPaymentError('Payment verification failed. Please contact support.')
              } else {
                alert('Payment verification failed. Please contact support.')
              }
              router.push('/account/orders')
              setTimeout(() => {
                if (typeof window !== 'undefined') {
                  sessionStorage.removeItem('pendingOrderId')
                  sessionStorage.removeItem('razorpayOrderId')
                }
              }, 500)
            }
          } catch (err) {
            console.error('Payment handler error:', err)
            if (onPaymentError) {
              onPaymentError('Something went wrong. Please check your orders.')
            } else {
              alert('Something went wrong. Please check your orders.')
            }
            router.push('/account/orders')
            setTimeout(() => {
              if (typeof window !== 'undefined') {
                sessionStorage.removeItem('pendingOrderId')
                sessionStorage.removeItem('razorpayOrderId')
              }
            }, 500)
          }
        },

        // MODAL CLOSED WITHOUT PAYMENT
        modal: {
          ondismiss: () => {
            console.log('Razorpay modal closed by user')
            if (onPaymentError) {
              onPaymentError('Payment cancelled by user.')
            }
          },
        },
      }

      const rzp = new (window as any).Razorpay(options)
      rzp.on('payment.failed', (response: any) => {
        console.error('Payment failed:', response.error)
        const errMsg = response.error?.description || 'Payment failed. Please try again.'
        try {
          rzp.close()
        } catch (e) {
          console.error('Failed to close Razorpay modal programmatically:', e)
        }
        if (onPaymentError) {
          onPaymentError(errMsg)
        } else {
          alert(errMsg)
        }
      })
      rzp.open()
    }

    return () => {
      delete window.__openRazorpay
    }
  }, [customerName, customerEmail, clearCart, router, onPaymentError])

  return null
}
