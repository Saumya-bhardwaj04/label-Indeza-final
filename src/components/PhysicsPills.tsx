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

    let cleanup: (() => void) | undefined

    import('matter-js').then((Matter) => {
      const { Engine, Bodies, World, Runner, Mouse, MouseConstraint, Composite } = Matter
      const container = containerRef.current
      if (!container) return

      const engine = Engine.create()
      const runner = Runner.create()
      const W = dimensions.width
      const H = dimensions.height
      const pillEls = Array.from(container.querySelectorAll<HTMLElement>('.physics-pill'))

      const bodies = pillEls.map((el) => {
        const pw = el.offsetWidth + 8
        const ph = el.offsetHeight + 8
        const body = Bodies.rectangle(
          Math.random() * W * 0.7 + 40,
          Math.random() * H * 0.4 + 20,
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
      
      // Let the browser handle vertical page scrolling by default
      mouse.element.style.touchAction = 'pan-y'

      // Disable scrolling ONLY when touching/dragging a pill
      const touchStartHandlers = new Map<HTMLElement, () => void>()
      const touchEndHandlers = new Map<HTMLElement, () => void>()

      pillEls.forEach((el) => {
        const start = () => {
          container.style.touchAction = 'none'
        }
        const end = () => {
          container.style.touchAction = 'pan-y'
        }

        el.addEventListener('touchstart', start, { passive: true })
        el.addEventListener('touchend', end, { passive: true })
        el.addEventListener('touchcancel', end, { passive: true })

        touchStartHandlers.set(el, start)
        touchEndHandlers.set(el, end)
      })

      const mc = MouseConstraint.create(engine, {
        mouse,
        constraint: { stiffness: 0.2, render: { visible: false } },
      })
      Composite.add(engine.world, mc)

      Runner.run(runner, engine)
      let frame: number
      const animate = () => {
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

      cleanup = () => {
        cancelAnimationFrame(frame)
        Runner.stop(runner)
        World.clear(engine.world, false)
        Engine.clear(engine)

        // Remove custom touch listeners
        pillEls.forEach((el) => {
          const start = touchStartHandlers.get(el)
          const end = touchEndHandlers.get(el)
          if (start) el.removeEventListener('touchstart', start)
          if (end) {
            el.removeEventListener('touchend', end)
            el.removeEventListener('touchcancel', end)
          }
        })
      }
    })

    return () => cleanup?.()
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
