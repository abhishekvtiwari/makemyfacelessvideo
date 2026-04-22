"use client"
// src/components/sections/Workflow.tsx
import { useEffect, useRef, useState } from "react"

const STEPS = [
  {
    n: "01",
    title: "Drop a Topic",
    desc: "Pick your niche, set a duration, write one sentence. That's your whole brief.",
  },
  {
    n: "02",
    title: "Script Generated",
    desc: "We write a hook, body, and CTA. Paced to your exact duration. Editable before render.",
  },
  {
    n: "03",
    title: "Voice + Visuals Cast",
    desc: "Pick a voice. Visuals are sourced scene-by-scene in parallel. Renders in under 30 seconds.",
  },
  {
    n: "04",
    title: "Download & Publish",
    desc: "Your finished MP4 with captions is ready. Export at 1080p. Publish same session.",
  },
]

function WorkflowStep({ step, index }: { step: (typeof STEPS)[number]; index: number }) {
  const [active, setActive] = useState(false)
  const stepRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = stepRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.6 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={stepRef}
      style={{
        display: "flex",
        gap: 24,
        padding: "24px",
        paddingLeft: 28,
        borderRadius: 12,
        background: active ? "rgba(255,255,255,0.03)" : "transparent",
        transition: "background 0.3s ease",
      }}
    >
      <div style={{ flexShrink: 0, paddingTop: 2 }}>
        <span
          className={active ? "ig-text" : ""}
          style={{
            fontFamily: "monospace",
            fontSize: 13,
            fontWeight: 600,
            color: active ? undefined : "var(--text-muted)",
            display: "inline-block",
            transition: "all 0.3s ease",
            transform: active ? "scale(1.1)" : "scale(1)",
          }}
        >
          {step.n}
        </span>
      </div>
      <div>
        <h3
          style={{
            fontSize: 16,
            fontWeight: 600,
            marginBottom: 6,
            color: active ? "var(--text)" : "var(--text-secondary)",
            transition: "color 0.3s ease",
          }}
        >
          {step.title}
        </h3>
        <p style={{ fontSize: 14, lineHeight: 1.65, color: "var(--text-muted)" }}>
          {step.desc}
        </p>
      </div>
    </div>
  )
}

export function Workflow() {
  return (
    <section id="how-it-works" className="section" style={{ background: "var(--bg)" }}>
      <div className="section-inner">
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "start",
          }}
          className="grid-cols-1 lg:grid-cols-2"
        >
          {/* LEFT */}
          <div>
            <p className="label" style={{ marginBottom: 20 }}>/ 04 · WORKFLOW</p>
            <h2 style={{ marginBottom: 16, maxWidth: "20ch" }}>
              <span style={{ display: "block" }}>From blank field</span>
              <span style={{ display: "block" }}>to finished video.</span>
            </h2>
            <p style={{ color: "var(--text-secondary)", maxWidth: "40ch" }}>
              A four-step pipeline. Fully automated. Zero guesswork.
            </p>
          </div>

          {/* RIGHT — steps with ig-gradient left border */}
          <div
            style={{
              position: "relative",
              paddingLeft: 2,
            }}
          >
            {/* gradient left line */}
            <div
              style={{
                position: "absolute",
                top: 0,
                bottom: 0,
                left: 0,
                width: 2,
                background: "var(--ig)",
                opacity: 0.35,
                borderRadius: 2,
                pointerEvents: "none",
              }}
            />
            {STEPS.map((step, i) => (
              <WorkflowStep key={step.n} step={step} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
