'use client'
// src/components/home/PageIntro.tsx
// Film projector page-load sequence: black → violet line → slash → dissolve
import { useEffect, useRef } from 'react'
import gsap from 'gsap'

interface Props { onComplete: () => void }

export default function PageIntro({ onComplete }: Props) {
  const overlayRef = useRef<HTMLDivElement>(null)
  const slashRef   = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const overlay = overlayRef.current
    const slash   = slashRef.current
    if (!overlay || !slash) return

    // Instant skip for reduced motion
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      gsap.set(overlay, { display: 'none' })
      onComplete()
      return
    }

    // Start: slash is invisible (scaleX = 0)
    gsap.set(slash, { scaleX: 0, scaleY: 1, transformOrigin: 'left center' })

    const scaleYTarget = Math.ceil(window.innerHeight / 2) + 20

    const tl = gsap.timeline({
      onComplete: () => {
        gsap.set(overlay, { display: 'none' })
        onComplete()
      },
    })

    tl
      // 1. Line draws left → right across the center
      .to(slash, {
        scaleX: 1,
        duration: 0.55,
        ease: 'power3.inOut',
      })
      // 2. Slash expands vertically from center, fills viewport
      .to(slash, {
        scaleY: scaleYTarget,
        duration: 0.38,
        ease: 'power3.in',
        transformOrigin: 'center center',
      })
      // 3. Whole overlay dissolves
      .to(overlay, {
        opacity: 0,
        duration: 0.42,
        ease: 'power1.out',
      })

    return () => { tl.kill() }
  }, [onComplete])

  return (
    <div
      ref={overlayRef}
      style={{
        position:       'fixed',
        inset:          0,
        zIndex:         9999,
        background:     '#060C1C',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        pointerEvents:  'none',
      }}
    >
      {/* The violet slash — starts as a 2px line, expands to fill screen */}
      <div
        ref={slashRef}
        style={{
          position:   'absolute',
          top:        '50%',
          left:       0,
          width:      '100%',
          height:     2,
          background: '#5B47F5',
          transform:  'translateY(-1px)',
        }}
      />
    </div>
  )
}
