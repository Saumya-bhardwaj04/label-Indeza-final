'use client'

export default function Loader({ message = 'Loading...' }: { message?: string }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '200px',
      width: '100%',
      gap: '16px',
      padding: '40px'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        borderRadius: '50%',
        border: '2px solid #EAEAEA',
        borderTopColor: '#1A1A1A',
        animation: 'spin 0.8s linear infinite'
      }} />
      {message && (
        <p style={{
          fontSize: '13px',
          color: '#888',
          letterSpacing: '0.05em',
          fontFamily: 'inherit'
        }}>
          {message}
        </p>
      )}
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
