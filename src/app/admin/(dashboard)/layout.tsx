import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import AdminNav from '@/components/admin/AdminNav'

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/admin/login')

  return (
    <>
      <AdminNav adminName={session.user?.name || ''} />
      <main className="admin-main-container" style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>{children}</main>
    </>
  )
}
