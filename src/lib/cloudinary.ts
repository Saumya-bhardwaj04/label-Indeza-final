import { v2 as cloudinary } from 'cloudinary'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function uploadToCloudinary(
  buffer: Buffer,
  filename: string,
  folder: string = 'label-indeza'
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        public_id: `${Date.now()}-${filename.replace(/\.[^.]+$/, '').replace(/\s+/g, '-')}`,
        resource_type: 'auto',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }  // auto-optimize
        ],
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result!.secure_url)
      }
    )
    stream.end(buffer)
  })
}

export async function uploadVideoToCloudinary(
  buffer: Buffer,
  filename: string
): Promise<string> {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder:        'label-indeza/videos',
        public_id:     `hero-${Date.now()}`,
        resource_type: 'video',
      },
      (error, result) => {
        if (error) reject(error)
        else resolve(result!.secure_url)
      }
    )
    stream.end(buffer)
  })
}

export default cloudinary
