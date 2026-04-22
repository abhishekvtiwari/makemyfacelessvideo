// src/hooks/useTextScramble.ts
import { useRef, useCallback } from 'react'

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&'

export function useTextScramble() {
  const frameRef = useRef<number | null>(null)

  const scramble = useCallback((el: HTMLElement, finalText: string, duration = 600) => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current)

    const start = performance.now()
    const chars = finalText.split('')

    const tick = (now: number) => {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)

      el.textContent = chars.map((char, i) => {
        if (char === ' ') return ' '
        if (i / chars.length < progress) return char
        return CHARS[Math.floor(Math.random() * CHARS.length)]
      }).join('')

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      } else {
        el.textContent = finalText
      }
    }

    frameRef.current = requestAnimationFrame(tick)

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current)
    }
  }, [])

  return scramble
}
