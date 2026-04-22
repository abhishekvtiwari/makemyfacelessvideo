"use client"
// src/components/ui/ScrollProgress.tsx
import { useEffect, useRef } from "react"

export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ticking = false
    const update = () => {
      const scrolled = window.scrollY
      const total = document.documentElement.scrollHeight - window.innerHeight
      const progress = total > 0 ? scrolled / total : 0
      if (barRef.current) {
        barRef.current.style.transform = `scaleX(${progress})`
      }
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(update)
        ticking = true
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div className="fixed top-0 left-0 right-0 h-[2px] z-[9999] bg-zinc-200">
      <div
        ref={barRef}
        className="scroll-bar-fill h-full w-full origin-left"
        style={{ transform: "scaleX(0)", transition: "none" }}
      />
    </div>
  )
}
