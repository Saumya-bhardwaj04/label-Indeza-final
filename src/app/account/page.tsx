'use client'
import { useState, useEffect, Suspense } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Mail, ArrowRight, LogOut } from 'lucide-react'

function AccountContent() {
  const { data: session, status } = useSession()
  const router  = useRouter()
  const params  = useSearchParams()
  const redirect = params.get('redirect') || '/account/profile'

  // Map error codes → human messages
  const AUTH_ERRORS: Record<string, string> = {
    use_email:  'This account was created with email sign-in. Please use your email and the one-time code instead.',
    use_google: 'This account was created with Google. Please use the "Continue with Google" button instead.',
  }

  const authErrorMessage = params.get('error') ? (AUTH_ERRORS[params.get('error')!] ?? 'Authentication failed. Please try again.') : null

  const [step,          setStep]          = useState<'signin' | 'otp'>('signin')
  const [email,         setEmail]         = useState('')
  const [otp,           setOtp]           = useState(['', '', '', '', '', ''])
  const [loading,       setLoading]       = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error,         setError]         = useState('')
  const [devCode,       setDevCode]       = useState('')

  // If already logged in → redirect
  useEffect(() => {
    if (status === 'authenticated') {
      router.push(redirect)
    }
  }, [status, router, redirect])

  // Send OTP
  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setDevCode('')
    try {
      const res  = await fetch('/api/customer/send-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error)
      if (data.dev && data.code) {
        setDevCode(data.code)
      }
      setStep('otp')
    } catch (err: any) {
      setError(err.message || 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  // Handle OTP input — auto-advance boxes
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return
    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus()
    }
    // Auto-submit when all 6 filled
    if (newOtp.every(d => d !== '') && newOtp.join('').length === 6) {
      handleVerifyOTP(newOtp.join(''))
    }
  }

  // Verify OTP
  const handleVerifyOTP = async (code: string) => {
    setLoading(true)
    setError('')
    try {
      const res  = await fetch('/api/customer/verify-otp', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ email, code }),
      })
      const data = await res.json()

      if (!res.ok) {
        // Provider mismatch — go back to sign-in step with inline error
        if (data.error === 'use_google') {
          setStep('signin')
          setOtp(['', '', '', '', '', ''])
          setError(AUTH_ERRORS.use_google)
          return
        }
        throw new Error(data.message || data.error || 'Invalid code')
      }

      // Sign in via NextAuth credentials (session carrier)
      const result = await signIn('email-otp', {
        email,
        customerId: data.customer.id,
        redirect:   false,
      })
      if (result?.ok) router.push(redirect)
      else throw new Error('Sign in failed')
    } catch (err: any) {
      setError(err.message || 'Invalid code')
      setOtp(['', '', '', '', '', ''])
      document.getElementById('otp-0')?.focus()
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (status === 'loading') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ width: 32, height: 32, border: '2px solid #1A1A1A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    )
  }

  // Already logged in (brief flash before redirect)
  if (status === 'authenticated') return null

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingTop: 48 }}>
      <h1 style={{ fontSize: 22, fontWeight: 600, marginBottom: 48, letterSpacing: '-0.02em' }}>Label Indeza</h1>

      {/* Card */}
      <div style={{ background: 'white', borderRadius: 20, padding: '40px 36px', width: '100%', maxWidth: 420, boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>

        {step === 'signin' ? (
          <>
            <h2 style={{ fontSize: 26, fontWeight: 600, marginBottom: 6 }}>Sign in</h2>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 28 }}>Sign in or create an account</p>

            {/* Auth provider error banner */}
            {(authErrorMessage || error) && (
              <div style={{
                background:   '#FEF3C7',
                border:       '1px solid #F59E0B',
                borderRadius: '12px',
                padding:      '14px 18px',
                marginBottom: '20px',
                display:      'flex',
                alignItems:   'flex-start',
                gap:          '10px',
              }}>
                <span style={{ fontSize: '18px', flexShrink: 0 }}>⚠️</span>
                <p style={{ fontSize: '14px', color: '#92400E', margin: 0, lineHeight: 1.5 }}>
                  {authErrorMessage || error}
                </p>
              </div>
            )}

            {/* Google */}
            <button
              onClick={async () => {
                setGoogleLoading(true)
                try {
                  await signIn('google', { callbackUrl: redirect })
                } catch (err) {
                  setGoogleLoading(false)
                }
              }}
              disabled={googleLoading || loading}
              style={{
                width: '100%', padding: 14, borderRadius: 12,
                background: '#4285F4', color: 'white', border: 'none',
                fontSize: 15, fontWeight: 500,
                cursor: (googleLoading || loading) ? 'not-allowed' : 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                marginBottom: 20, transition: 'background 0.2s',
                opacity: (googleLoading || loading) ? 0.7 : 1,
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#fff"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z" fill="#fff"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff"/>
              </svg>
              {googleLoading ? 'Connecting with Google...' : 'Continue with Google'}
            </button>

            {/* Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <div style={{ flex: 1, height: 1, background: '#E8E8E8' }} />
              <span style={{ color: '#999', fontSize: 13 }}>or</span>
              <div style={{ flex: 1, height: 1, background: '#E8E8E8' }} />
            </div>

            {/* Email OTP */}
            <form onSubmit={handleSendOTP}>
              <div style={{ border: '1px solid #E0E0E0', borderRadius: 12, padding: '12px 16px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
                <Mail size={16} color="#999" />
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: 11, color: '#999', display: 'block', marginBottom: 2 }}>Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="you@email.com"
                    required
                    style={{ width: '100%', border: 'none', outline: 'none', fontSize: 15, fontFamily: 'inherit', background: 'transparent' }}
                  />
                </div>
              </div>




              <button
                type="submit"
                disabled={loading}
                style={{
                  width: '100%', padding: 14, borderRadius: 12,
                  background: '#1A1A1A', color: 'white', border: 'none',
                  fontSize: 15, fontWeight: 500, cursor: loading ? 'not-allowed' : 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                  opacity: loading ? 0.7 : 1,
                }}
              >
                {loading ? 'Sending...' : <> Continue <ArrowRight size={16} /> </>}
              </button>
            </form>
          </>
        ) : (
          <>
            {/* OTP Step */}
            <h2 style={{ fontSize: 26, fontWeight: 600, marginBottom: 6 }}>Enter code</h2>
            <p style={{ color: '#888', fontSize: 14, marginBottom: 4 }}>
              Sent to {email}
            </p>
            <button
              onClick={() => { setStep('signin'); setOtp(['','','','','','']); setError('') }}
              style={{ color: '#4285F4', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', padding: 0, marginBottom: 32 }}
            >
              Change
            </button>

            {devCode && (
              <div style={{ background: '#FFFBEB', border: '1px solid #F59E0B', borderRadius: 8, padding: 12, marginBottom: 20, textAlign: 'center' }}>
                <p style={{ fontSize: 13, color: '#B45309', fontWeight: 600, margin: 0 }}>
                  [DEV MODE] Sign-in code: {devCode}
                </p>
              </div>
            )}

            {/* 6 OTP boxes */}
            <div style={{ display: 'flex', gap: 10, marginBottom: 24, justifyContent: 'center' }}>
              {otp.map((digit, i) => (
                <input
                  key={i}
                  id={`otp-${i}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleOtpChange(i, e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Backspace' && !digit && i > 0) {
                      document.getElementById(`otp-${i - 1}`)?.focus()
                    }
                  }}
                  style={{
                    width: 48, height: 56,
                    border: digit ? '2px solid #1A1A1A' : '1.5px solid #E0E0E0',
                    borderRadius: 12, textAlign: 'center',
                    fontSize: 22, fontWeight: 600,
                    outline: 'none', fontFamily: 'inherit',
                    transition: 'border-color 0.15s',
                  }}
                />
              ))}
            </div>

            {error && <p style={{ color: '#E53E3E', fontSize: 13, marginBottom: 12, textAlign: 'center' }}>{error}</p>}

            {loading && (
              <p style={{ textAlign: 'center', color: '#888', fontSize: 14 }}>Verifying...</p>
            )}

            <button
              onClick={() => handleSendOTP({ preventDefault: () => {} } as any)}
              style={{ width: '100%', textAlign: 'center', color: '#888', fontSize: 13, background: 'none', border: 'none', cursor: 'pointer', marginTop: 8 }}
            >
              Didn&apos;t receive it? Resend code
            </button>
          </>
        )}
      </div>

      <p style={{ color: '#999', fontSize: 12, marginTop: 24, textAlign: 'center' }}>
        By continuing, you agree to our{' '}
        <a href="/legal/terms" style={{ color: '#1A1A1A', textDecoration: 'underline' }}>Terms of service</a>
      </p>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ width: 32, height: 32, border: '2px solid #1A1A1A', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
      </div>
    }>
      <AccountContent />
    </Suspense>
  )
}
