import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Fix for NextAuth v4 forcing /api/auth on Vercel deployments
  async rewrites() {
    return [
      {
        source: '/api/auth/callback/google',
        destination: '/api/customer/auth/callback/google',
      }
    ]
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'images.pexels.com' },
      { protocol: 'https', hostname: 'videos.pexels.com' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: 'res.cloudinary.com' },
    ],
  },

  experimental: {
    staleTimes: {
      dynamic: 0,   // Never cache dynamic pages — always re-fetch on back-navigation
      static:  180, // Cache fully-static pages for 3 minutes (fine)
    },
  },
}

export default nextConfig
