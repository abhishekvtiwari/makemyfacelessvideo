// src/hooks/useMagneticButton.ts
import { useEffect, useRef } from 'react'

export function useMagneticButton(strength = 0.3) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    const onEnter = () => {
      el.style.transition = 'transform 0.1s linear'
    }
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const cx = rect.left + rect.width / 2
      const cy = rect.top + rect.height / 2
      const dx = (e.clientX - cx) * strength
      const dy = (e.clientY - cy) * strength
      el.style.transform = `translate(${dx}px, ${dy}px)`
    }
    const onLeave = () => {
      el.style.transition = 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)'
      el.style.transform  = ''
      setTimeout(() => { el.style.transition = '' }, 400)
    }

    el.addEventListener('mouseenter', onEnter)
    el.addEventListener('mousemove',  onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mouseenter', onEnter)
      el.removeEventListener('mousemove',  onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [strength])

  return ref
}
