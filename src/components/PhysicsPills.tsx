'use client'

import { useEffect, useRef, useState } from 'react'

const DEFAULT_PILLS = [
  { text: '24 years in service', bg: '#F5C5D5' },
  { text: '5+ Countries', bg: '#D4C5E8' },
  { text: '10M+ Happy Customers', bg: '#A8C4A2' },
  { text: '3 Sub brands', bg: '#FFF3B0' },
  { text: 'Free Shipping', bg: '#F5C5D5' },
]

export default function PhysicsPills({ customPills }: { customPills?: { text: string; bg: string }[] }) {
  const activePills = customPills && customPills.length > 0 ? customPills : DEFAULT_PILLS
  const containerRef = useRef<HTMLDivElement>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const updateDimensions = () => {
      setDimensions({
        width: container.offsetWidth,
        height: container.offsetHeight,
      })
    }

    updateDimensions()

    const observer = new ResizeObserver(() => {
      updateDimensions()
    })
    observer.observe(container)

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    if (dimensions.width === 0 || dimensions.height === 0) return

    let active = true
    let cleanupFn: (() => void) | undefined

    import('matter-js').then((Matter) => {
      if (!active) return

      const { Engine, Bodies, World, Runner, Mouse, MouseConstraint, Composite } = Matter
      const container = containerRef.current
      if (!container) return

      const engine = Engine.create()
      const runner = Runner.create()
      const W = dimensions.width
      const H = dimensions.height
      const pillEls = Array.from(container.querySelectorAll<HTMLElement>('.physics-pill'))

      // Enable touch-action: none on the pills so dragging works on mobile
      pillEls.forEach((el) => {
        el.style.touchAction = 'none'
      })

      const bodies = pillEls.map((el) => {
        const pw = el.offsetWidth + 8
        const ph = el.offsetHeight + 8
        const body = Bodies.rectangle(
          Math.random() * (W - pw) + pw / 2,
          Math.random() * (H - ph) + ph / 2,
          pw,
          ph,
          { restitution: 0.4, friction: 0.1, frictionAir: 0.02 }
        )
        World.add(engine.world, body)
        return body
      })

      World.add(engine.world, [
        Bodies.rectangle(W / 2, H + 10, W, 20, { isStatic: true }),
        Bodies.rectangle(-10, H / 2, 20, H, { isStatic: true }),
        Bodies.rectangle(W + 10, H / 2, 20, H, { isStatic: true }),
      ])

      const mouse = Mouse.create(container)

      const mc = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      })
      Composite.add(engine.world, mc)

      Runner.run(runner, engine)
      let frame: number
      const animate = () => {
        if (!active) return
        frame = requestAnimationFrame(animate)
        Engine.update(engine)
        bodies.forEach((body, i) => {
          const el = pillEls[i]
          if (!el) return
          const { x, y } = body.position
          el.style.visibility = 'visible'
          el.style.transform = `translate(${x - el.offsetWidth / 2}px, ${y - el.offsetHeight / 2}px) rotate(${body.angle}rad)`
        })
      }
      animate()

      cleanupFn = () => {
        cancelAnimationFrame(frame)
        Runner.stop(runner)
        World.clear(engine.world, false)
        Engine.clear(engine)

        // Reset touchAction
        pillEls.forEach((el) => {
          el.style.touchAction = ''
        })
      }
    })

    return () => {
      active = false
      cleanupFn?.()
    }
  }, [activePills, dimensions])

  return (
    <div ref={containerRef} className="brand-pills-area pills-container" id="pills-container">
      {activePills.map((p, i) => (
        <span
          key={i}
          className="physics-pill stat-pill"
          style={{ background: p.bg }}
        >
          {p.text}
        </span>
      ))}
    </div>
  )
}
