// src/hooks/useCountUp.ts
import { useEffect, useRef } from 'react'

interface CountUpOptions {
  duration?: number
  suffix?: string
  decimals?: number
}

export function useCountUp(to: number, options: CountUpOptions = {}) {
  const ref = useRef<HTMLElement>(null)
  const { duration = 1800, suffix = '', decimals = 0 } = options

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        observer.disconnect()

        const start = performance.now()
        const tick = (now: number) => {
          const progress = Math.min((now - start) / duration, 1)
          const ease = 1 - Math.pow(1 - progress, 3)
          const value = to * ease
          el.textContent = value.toFixed(decimals) + suffix
          if (progress < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.5 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [to, duration, suffix, decimals])

  return ref
}
