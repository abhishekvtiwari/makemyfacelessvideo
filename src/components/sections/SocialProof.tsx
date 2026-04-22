"use client"
// src/components/sections/SocialProof.tsx
import { useEffect, useRef, useState } from "react"
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection"
import { EyebrowBadge } from "@/components/ui/EyebrowBadge"

const TESTIMONIALS = [
  {
    q: "I went from 0 to 30 videos published in my first month. The script quality is insane.",
    handle: "@financewithravi",
    subs: "48K subscribers",
  },
  {
    q: "Finally a tool that understands faceless YouTube. The niche templates save hours.",
    handle: "@techexplained_",
    subs: "91K subscribers",
    featured: true,
  },
  {
    q: "Hindi voice quality is better than anything I've tried. My retention went up 40%.",
    handle: "@gyaanwala",
    subs: "22K subscribers",
  },
]

function useCountUp(target: number, duration: number, trigger: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!trigger) return
    const start = performance.now()
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setCount(parseFloat((target * eased).toFixed(1)))
      if (p < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [trigger, target, duration])
  return count
}

function CounterRow() {
  const [triggered, setTriggered] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTriggered(true)
          observer.disconnect()
        }
      },
      { threshold: 0.5 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const creators = useCountUp(12400, 1800, triggered)
  const videos = useCountUp(340000, 1800, triggered)
  const rating = useCountUp(4.8, 1400, triggered)

  const stats = [
    { value: Math.floor(creators).toLocaleString() + "+", label: "creators" },
    { value: Math.floor(videos).toLocaleString() + "+", label: "videos generated" },
    { value: rating.toFixed(1) + " ★", label: "average rating" },
  ]

  return (
    <div
      ref={ref}
      className="flex items-center justify-center gap-16 mt-12 pt-8 flex-wrap"
      style={{ borderTop: "1px solid var(--border)" }}
    >
      {stats.map((s) => (
        <div key={s.label} className="text-center">
          <p className="ig-text text-4xl font-semibold tracking-tighter">{s.value}</p>
          <p className="mt-1 text-sm" style={{ color: "var(--text-muted)" }}>
            {s.label}
          </p>
        </div>
      ))}
    </div>
  )
}

export function SocialProof() {
  return (
    <section className="section" style={{ background: "var(--bg-secondary)" }}>
      <div className="section-inner">
        <AnimatedSection>
          <AnimatedItem>
            <EyebrowBadge>/ 05 · CREATORS</EyebrowBadge>
          </AnimatedItem>
          <AnimatedItem>
            <h2 className="mt-5 max-w-[20ch]">
              <span className="block">Built for creators</span>
              <span className="block">who ship daily.</span>
            </h2>
          </AnimatedItem>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-5">
            {TESTIMONIALS.map((t, i) => (
              <AnimatedItem key={i}>
                <div
                  className={`card-surface p-7 h-full flex flex-col ${t.featured ? "ig-border" : ""}`}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-6px)"
                    e.currentTarget.style.transition =
                      "transform 0.25s ease, box-shadow 0.25s ease"
                    e.currentTarget.style.boxShadow =
                      "0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(221,42,123,0.10)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = ""
                    e.currentTarget.style.boxShadow = ""
                  }}
                >
                  <span className="ig-text text-5xl leading-none mb-4 font-serif">
                    "
                  </span>
                  <p
                    className="text-sm leading-relaxed flex-1"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {t.q}
                  </p>
                  <div
                    className="mt-5 pt-4"
                    style={{ borderTop: "1px solid var(--border)" }}
                  >
                    <p className="text-sm font-semibold ig-text">{t.handle}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {t.subs}
                    </p>
                  </div>
                </div>
              </AnimatedItem>
            ))}
          </div>
        </AnimatedSection>

        <CounterRow />
      </div>
    </section>
  )
}
