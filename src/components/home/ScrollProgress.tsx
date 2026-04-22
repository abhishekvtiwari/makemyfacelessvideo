'use client'
// src/components/home/ScrollProgress.tsx
import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const bar = barRef.current
    if (!bar) return

    const onScroll = () => {
      const scrollTop = window.scrollY
      const docHeight = document.documentElement.scrollHeight - window.innerHeight
      const pct = docHeight > 0 ? scrollTop / docHeight : 0
      bar.style.transform = `scaleX(${pct})`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      style={{
        position:      'fixed',
        top:           0,
        left:          0,
        right:         0,
        height:        2,
        zIndex:        200,
        pointerEvents: 'none',
        background:    'rgba(0, 0, 0, 0.06)',
      }}
    >
      <div
        ref={barRef}
        style={{
          height:          '100%',
          width:           '100%',
          background:      '#4633E0',
          transformOrigin: 'left center',
          transform:       'scaleX(0)',
          transition:      'transform 0.05s linear',
        }}
      />
    </div>
  )
}
