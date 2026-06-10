'use client'

import { useMemo } from 'react'
import ScrollReveal from '@/components/ScrollReveal'

type InstagramReelItem = {
  permalink: string
  coverUrl: string
  fallbackCoverUrl: string
}

// Real reel shortcodes from @label_indeza profile.
// Add/remove shortcodes here to control which reels appear.
const reelShortcodes = [
  'DXWsbIhze0n',
  'DXRb7o9TqXr',
  'DXOkkBgtPSs',
  'DXL75O0zdL6',
  'DXJ4uMwzY-s',
  'DXEILt7zal-',
  'DXCFW1SCQDm',
  'DXBqeZ7k6Kg',
]

const toReelPermalink = (shortcode: string) => `https://www.instagram.com/reel/${shortcode}/`
const toReelCover = (shortcode: string) => `https://www.instagram.com/p/${shortcode}/media/?size=l`
const toReelCoverFallback = (shortcode: string) =>
  `https://images.weserv.nl/?url=www.instagram.com/p/${shortcode}/media/?size=l`

const InstagramIcon = () => (
  <svg
    viewBox="0 0 24 24"
    aria-hidden="true"
    className="insta-icon"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4.2" />
    <circle cx="17.2" cy="6.8" r="1.1" fill="currentColor" stroke="none" />
  </svg>
)

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="insta-media-icon">
    <path d="M8 5v14l11-7z" fill="currentColor" />
  </svg>
)

export default function UGCStrip({ shortcodes }: { shortcodes?: string }) {
  const feedItems = useMemo<InstagramReelItem[]>(() => {
    const list = shortcodes?.trim()
      ? shortcodes.split(',').map(s => s.trim()).filter(Boolean)
      : reelShortcodes

    const extractShortcode = (input: string) => {
      const match = input.match(/(?:p|reel|tv)\/([a-zA-Z0-9_-]+)/)
      if (match) return match[1]
      return input.split('?')[0].replace(/\//g, '').trim()
    }

    return list.map((rawInput) => {
      const shortcode = extractShortcode(rawInput)
      return {
        permalink: toReelPermalink(shortcode),
        coverUrl: toReelCover(shortcode),
        fallbackCoverUrl: toReelCoverFallback(shortcode),
      }
    })
  }, [shortcodes])

  const marqueeItems = useMemo(() => [...feedItems, ...feedItems], [feedItems])

  return (
    <section className="section-pad">
      <div className="container">
        <ScrollReveal className="section-header">
          <span className="section-eyebrow">
            <span className="section-eyebrow-inline">
              <InstagramIcon />
              @LabelIndeza
            </span>
          </span>
          <h2 className="section-title instafeed-title">INSTAFEED</h2>
        </ScrollReveal>

        <ScrollReveal delay={0.08}>
          <div className="insta-marquee" aria-label="Instagram feed marquee">
            <div className="insta-marquee-track">
              {marqueeItems.map((item, i) => (
                <a
                  key={`${item.permalink}-${i}`}
                  href={item.permalink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="insta-media-card"
                  aria-label={`Open Instagram reel ${i + 1}`}
                >
                  <img
                    src={item.coverUrl}
                    alt={`Instagram reel ${i + 1}`}
                    loading="lazy"
                    referrerPolicy="no-referrer"
                    className="insta-media"
                    onError={(e) => {
                      const img = e.currentTarget
                      if (img.dataset.fallbackLoaded === 'true') return
                      img.dataset.fallbackLoaded = 'true'
                      img.src = item.fallbackCoverUrl
                    }}
                  />

                  <span className="insta-media-overlay">
                    <PlayIcon />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  )
}
