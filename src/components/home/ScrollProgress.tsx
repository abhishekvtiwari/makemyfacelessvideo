'use client'
// src/components/home/ScrollProgress.tsx
import { useEffect, useRef } from 'react'

export default function ScrollProgress() {
  const fillRef = useRef<HTMLDivElement>(null)
  const dotRef  = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fill = fillRef.current
    const dot  = dotRef.current
    if (!fill || !dot) return

    const onScroll = () => {
      const scrollTop  = window.scrollY
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight
      const pct        = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0
      fill.style.height   = `${pct}%`
      dot.style.top       = `${pct}%`
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div
      style={{
        position:   'fixed',
        right:      0,
        top:        0,
        width:      2,
        height:     '100vh',
        background: 'rgba(255,255,255,0.06)',
        zIndex:     100,
        pointerEvents: 'none',
      }}
    >
      {/* Violet fill */}
      <div
        ref={fillRef}
        style={{
          width:      '100%',
          height:     0,
          background: '#5B47F5',
          transition: 'height 0.05s linear',
        }}
      />
      {/* Glowing dot at fill endpoint */}
      <div
        ref={dotRef}
        style={{
          position:   'absolute',
          right:      -3,
          top:        0,
          width:      8,
          height:     8,
          borderRadius: '50%',
          background: '#5B47F5',
          boxShadow:  '0 0 8px #5B47F5, 0 0 16px rgba(91,71,245,0.5)',
          transform:  'translateX(50%)',
          transition: 'top 0.05s linear',
        }}
      />
    </div>
  )
}
