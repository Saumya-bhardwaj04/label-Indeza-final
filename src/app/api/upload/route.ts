import { NextResponse } from 'next/server'
import { uploadToCloudinary, uploadVideoToCloudinary } from '@/lib/cloudinary'

export async function POST(req: Request) {
  // Only admins can upload files
  const { requireAdmin } = await import('@/lib/adminGuard')
  const denied = await requireAdmin()
  if (denied) return denied

  try {
    const formData = await req.formData()
    const file     = formData.get('file') as File
    const type     = formData.get('type') as string  // 'image' | 'video'

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    const bytes    = await file.arrayBuffer()
    const buffer   = Buffer.from(bytes)
    const filename = file.name

    let url: string

    if (type === 'video') {
      url = await uploadVideoToCloudinary(buffer, filename)
    } else {
      const folder = 'label-indeza/images'
      url = await uploadToCloudinary(buffer, filename, folder)
    }

    return NextResponse.json({ url, filename })
  } catch (error: any) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Upload failed: ' + (error.message || 'Unknown error') },
      { status: 500 }
    )
  }
}
