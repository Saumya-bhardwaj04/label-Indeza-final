'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { fadeUp } from '@/lib/motion'

export default function HeroContent({
  heroTitle,
  heroSubtitle,
}: {
  heroTitle: string
  heroSubtitle: string
}) {
  return (
    <div className="hero-content container">
      <motion.div
        className="hero-text"
        initial="hidden"
        animate="visible"
        variants={{ visible: { transition: { staggerChildren: 0.12 } } }}
      >
        <motion.h1 className="hero-title" style={{ color: '#DECBA7' }} variants={fadeUp}>
          {heroTitle.split('\n').map((line: string, i: number) => (
            <span key={i}>
              {line}
              <br />
            </span>
          ))}
        </motion.h1>
        <motion.p className="hero-subtitle" style={{ color: '#FAF6F0' }} variants={fadeUp}>
          {heroSubtitle}
        </motion.p>
        <motion.div className="hero-btns" variants={fadeUp}>
          <Link href="/shop/women" className="btn-primary">
            Shop Women →
          </Link>
          <Link href="/customize" className="btn-secondary" style={{ color: '#DECBA7', borderColor: '#DECBA7' }}>
            Customize →
          </Link>
        </motion.div>
      </motion.div>
    </div>
  )
}

