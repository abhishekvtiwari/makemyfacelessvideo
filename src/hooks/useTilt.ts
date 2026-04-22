// src/hooks/useTilt.ts
import { useEffect, useRef } from 'react'

export function useTilt(maxTilt = 8) {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!window.matchMedia('(pointer: fine)').matches) return

    el.style.willChange = 'transform'

    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top)  / rect.height - 0.5
      el.style.transition = 'transform 0.1s ease'
      el.style.transform  = `perspective(800px) rotateX(${-y * maxTilt}deg) rotateY(${x * maxTilt}deg) translateZ(4px)`
    }
    const onLeave = () => {
      el.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)'
      el.style.transform  = 'perspective(800px) rotateX(0deg) rotateY(0deg) translateZ(0)'
      setTimeout(() => { el.style.transition = 'transform 0.1s ease' }, 500)
    }

    el.addEventListener('mousemove',  onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove',  onMove)
      el.removeEventListener('mouseleave', onLeave)
    }
  }, [maxTilt])

  return ref
}
