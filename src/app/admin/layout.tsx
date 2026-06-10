export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: '#EFE9DF', fontFamily: 'system-ui' }}>
      {children}
    </div>
  )
}
