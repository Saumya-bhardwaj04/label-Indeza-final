import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

/**
 * Verifies the current request is from an authenticated admin.
 * Returns null if authorized, or a NextResponse 401/403 if not.
 * Usage:
 *   const denied = await requireAdmin()
 *   if (denied) return denied
 */
export async function requireAdmin(): Promise<NextResponse | null> {
  const session = await getServerSession(authOptions)
  
  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  if ((session.user as any)?.role !== 'admin') {
    return NextResponse.json({ error: 'Forbidden: admin access required' }, { status: 403 })
  }
  
  return null // Authorized
}
