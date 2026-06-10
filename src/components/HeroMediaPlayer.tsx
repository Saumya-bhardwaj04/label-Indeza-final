'use client'

import { useState } from 'react'
import HeroContent from '@/components/HeroContent'

type Props = {
  videoUrl: string | null
  posterUrl: string
  imageUrl: string
  heroTitle: string
  heroSubtitle: string
}

export default function HeroMediaPlayer({
  videoUrl,
  posterUrl,
  imageUrl,
  heroTitle,
  heroSubtitle,
}: Props) {
  const [videoFailed, setVideoFailed] = useState(false)
  const showVideo = !!videoUrl && !videoFailed

  return (
    <section className="hero">
      {showVideo ? (
        <video
          className="hero-video"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster={posterUrl}
          onError={() => setVideoFailed(true)}
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      ) : (
        <img src={imageUrl} className="hero-image" alt="Label Indeza hero" />
      )}
      <div className="hero-overlay" />
      <HeroContent heroTitle={heroTitle} heroSubtitle={heroSubtitle} />
      <div className="scroll-indicator">
        <span className="scroll-arrow">↓</span>
      </div>
    </section>
  )
}
