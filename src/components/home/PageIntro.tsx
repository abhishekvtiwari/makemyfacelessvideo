'use client'
// src/components/home/PageIntro.tsx
import { useEffect, useRef } from 'react'

interface Props { onComplete: () => void }

export default function PageIntro({ onComplete }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const slashRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    const slash   = slashRef.current
    if (!overlay || !slash) return

    const gsap = (window as any).gsap
    if (!gsap) { overlay.style.display = 'none'; onComplete(); return }

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(overlay, { display: 'none' })
      onComplete()
      return
    }

    gsap.set(slash, { scaleX: 0, scaleY: 1, transformOrigin: 'left center' })

    const scaleYTarget = Math.ceil(window.innerHeight / 2) + 20

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { display: 'none' })
        onComplete()
      },
    })

    tl
      .to(slash, { scaleX: 1, duration: 0.55, ease: 'power3.inOut' })
      .to(slash, { scaleY: scaleYTarget, duration: 0.38, ease: 'power3.in', transformOrigin: 'center center' })
      .to(overlay, { opacity: 0, duration: 0.42, ease: 'power1.out' })

    return () => { tl.kill() }
  }, [onComplete])

  return (
    <div
      ref={overlayRef}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: '#F5F2EE',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        pointerEvents: 'none',
      }}
    >
      <div
        ref={slashRef}
        style={{
          position: 'absolute', top: '50%', left: 0,
          width: '100%', height: 2,
          background: '#4633E0',
          transform: 'translateY(-1px)',
        }}
      />
    </div>
  )
}
