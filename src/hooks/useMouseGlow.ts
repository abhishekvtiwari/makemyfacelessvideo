// src/hooks/useMouseGlow.ts
import { useEffect, useRef } from 'react'

export function useMouseGlow(
  color = 'rgba(70,51,224,0.12)',
  size = 300
) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      el.style.background = `radial-gradient(${size}px circle at ${x}px ${y}px, ${color}, transparent 70%)`
    }
    const onLeave = () => { el.style.background = '' }

    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [color, size])

  return ref
}
