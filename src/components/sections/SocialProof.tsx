"use client"
// src/components/sections/SocialProof.tsx
import { useEffect, useRef, useState } from "react"

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
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 64,
        marginTop: 48,
        paddingTop: 32,
        borderTop: "1px solid var(--border)",
        flexWrap: "wrap",
      }}
    >
      {stats.map((s) => (
        <div key={s.label} style={{ textAlign: "center" }}>
          <p className="ig-text" style={{ fontSize: 36, fontWeight: 700, letterSpacing: -1 }}>
            {s.value}
          </p>
          <p style={{ marginTop: 4, fontSize: 13, color: "var(--text-muted)" }}>{s.label}</p>
        </div>
      ))}
    </div>
  )
}

export function SocialProof() {
  return (
    <section className="section" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <p className="label" style={{ marginBottom: 20 }}>/ 05 · CREATORS</p>
        <h2 style={{ marginBottom: 48, maxWidth: "22ch" }}>
          <span style={{ display: "block" }}>Built for creators</span>
          <span style={{ display: "block" }}>who ship daily.</span>
        </h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 16,
          }}
        >
          {TESTIMONIALS.map((t, i) => (
            <div
              key={i}
              className="card"
              style={{
                padding: 28,
                display: "flex",
                flexDirection: "column",
                ...(t.featured
                  ? { border: "1px solid rgba(221,42,123,0.3)" }
                  : {}),
              }}
            >
              <span
                className="ig-text"
                style={{ fontSize: 48, lineHeight: 1, marginBottom: 16, fontFamily: "serif" }}
              >
                &ldquo;
              </span>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--text-secondary)", flex: 1 }}>
                {t.q}
              </p>
              <div
                style={{
                  marginTop: 20,
                  paddingTop: 16,
                  borderTop: "1px solid var(--border)",
                }}
              >
                <p className="ig-text" style={{ fontSize: 13, fontWeight: 600 }}>{t.handle}</p>
                <p style={{ fontSize: 12, marginTop: 2, color: "var(--text-muted)" }}>{t.subs}</p>
              </div>
            </div>
          ))}
        </div>

        <CounterRow />
      </div>
    </section>
  )
}
