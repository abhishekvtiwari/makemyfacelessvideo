'use client'
// src/components/home/Cursor.tsx
import { useEffect, useRef } from 'react'

export default function Cursor() {
  const dotRef  = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dot  = dotRef.current
    const ring = ringRef.current
    if (!dot || !ring) return

    if (!window.matchMedia('(pointer: fine)').matches) return
    dot.style.display  = 'block'
    ring.style.display = 'block'

    let mx = window.innerWidth / 2
    let my = window.innerHeight / 2
    let rx = mx
    let ry = my

    const onMove = (e: PointerEvent) => { mx = e.clientX; my = e.clientY }
    window.addEventListener('pointermove', onMove)

    let frame: number
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      frame = requestAnimationFrame(tick)
      rx = lerp(rx, mx, 0.12)
      ry = lerp(ry, my, 0.12)
      dot.style.transform  = `translate(${mx - 4}px, ${my - 4}px)`
      ring.style.transform = `translate(${rx - 16}px, ${ry - 16}px)`
    }
    frame = requestAnimationFrame(tick)

    const onEnterBtn = () => {
      ring.style.width       = '48px'
      ring.style.height      = '48px'
      ring.style.marginLeft  = '-8px'
      ring.style.marginTop   = '-8px'
      ring.style.background  = 'rgba(70,51,224,0.10)'
      ring.style.borderColor = '#4633E0'
    }
    const onLeaveBtn = () => {
      ring.style.width       = '32px'
      ring.style.height      = '32px'
      ring.style.marginLeft  = '0'
      ring.style.marginTop   = '0'
      ring.style.background  = 'transparent'
      ring.style.borderColor = '#4633E0'
    }
    const onEnterCanvas = () => {
      ring.style.width       = '64px'
      ring.style.height      = '64px'
      ring.style.marginLeft  = '-16px'
      ring.style.marginTop   = '-16px'
      ring.style.borderColor = '#0A7A70'
    }
    const onLeaveCanvas = () => {
      ring.style.width       = '32px'
      ring.style.height      = '32px'
      ring.style.marginLeft  = '0'
      ring.style.marginTop   = '0'
      ring.style.borderColor = '#4633E0'
    }
    const onClick = () => {
      dot.style.transform = `translate(${mx - 10}px, ${my - 10}px) scale(2.5)`
      dot.style.opacity   = '0.4'
      setTimeout(() => {
        dot.style.transform = `translate(${mx - 4}px, ${my - 4}px) scale(1)`
        dot.style.opacity   = '1'
      }, 120)
    }

    document.querySelectorAll('a, button').forEach(el => {
      el.addEventListener('mouseenter', onEnterBtn)
      el.addEventListener('mouseleave', onLeaveBtn)
    })
    document.querySelector('[data-cursor="canvas"]')?.addEventListener('mouseenter', onEnterCanvas)
    document.querySelector('[data-cursor="canvas"]')?.addEventListener('mouseleave', onLeaveCanvas)
    window.addEventListener('click', onClick)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('click', onClick)
    }
  }, [])

  const base: React.CSSProperties = {
    position:      'fixed',
    top:           0,
    left:          0,
    pointerEvents: 'none',
    zIndex:        99999,
    display:       'none',
    transition:    'width 0.2s ease, height 0.2s ease, background 0.2s ease, border-color 0.2s ease',
  }

  return (
    <>
      <div ref={dotRef} style={{ ...base, width: 8, height: 8, borderRadius: '50%', background: '#0A0A0A' }} />
      <div ref={ringRef} style={{ ...base, width: 32, height: 32, borderRadius: '50%', border: '1.5px solid #4633E0', background: 'transparent' }} />
    </>
  )
}
