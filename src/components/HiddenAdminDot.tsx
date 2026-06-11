'use client'

export default function HiddenAdminDot() {
  return (
    <a
      href="/admin/login"
      style={{
        width: '8px', height: '8px', borderRadius: '50%',
        background: 'rgba(0,0,0,0.08)', display: 'inline-block',
        cursor: 'default', marginRight: '8px', flexShrink: 0,
        transition: 'background 0.2s',
      }}
      onMouseEnter={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.25)')}
      onMouseLeave={e => (e.currentTarget.style.background = 'rgba(0,0,0,0.08)')}
      title=""
      aria-hidden="true"
    />
  )
}
