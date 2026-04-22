"use client"
// src/components/sections/Workflow.tsx
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection"
import { EyebrowBadge } from "@/components/ui/EyebrowBadge"

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

function WorkflowStep({
  step,
  index,
}: {
  step: (typeof STEPS)[number]
  index: number
}) {
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
    <motion.div
      ref={stepRef}
      initial={{ opacity: 0, x: 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        delay: index * 0.15,
        duration: 0.6,
        type: "spring" as const,
        stiffness: 80,
        damping: 20,
      }}
      className="flex gap-6 py-6"
      style={{
        paddingLeft: 24,
        transition: "all 0.3s ease",
        borderRadius: active ? 12 : 0,
        background: active ? "rgba(255,255,255,0.5)" : "transparent",
      }}
    >
      <div className="flex-shrink-0 pt-0.5">
        <span
          className={`font-mono text-sm font-semibold transition-all duration-300 inline-block ${active ? "ig-text" : ""}`}
          style={{
            color: active ? undefined : "var(--text-muted)",
            transform: active ? "scale(1.1)" : "scale(1)",
          }}
        >
          {step.n}
        </span>
      </div>
      <div>
        <h3
          className="text-base font-semibold mb-1.5 transition-colors duration-300"
          style={{
            color: active ? "var(--text-primary)" : "var(--text-secondary)",
            fontSize: 16,
          }}
        >
          {step.title}
        </h3>
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {step.desc}
        </p>
      </div>
    </motion.div>
  )
}

export function Workflow() {
  return (
    <section
      id="how-it-works"
      className="section"
      style={{ background: "var(--bg-secondary)" }}
    >
      <div className="section-inner">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* LEFT */}
          <AnimatedSection>
            <AnimatedItem>
              <EyebrowBadge>/ 04 · WORKFLOW</EyebrowBadge>
            </AnimatedItem>
            <AnimatedItem>
              <h2 className="mt-5 max-w-[20ch]">
                <span className="block">From blank field</span>
                <span className="block">to finished video.</span>
              </h2>
            </AnimatedItem>
            <AnimatedItem>
              <p className="mt-4 leading-relaxed max-w-[40ch]">
                A four-step pipeline. Fully automated. Zero guesswork.
              </p>
            </AnimatedItem>
          </AnimatedSection>

          {/* RIGHT — steps */}
          <div className="relative flex flex-col" style={{ paddingLeft: 2 }}>
            {/* Gradient connecting line */}
            <div
              className="absolute top-0 bottom-0 pointer-events-none"
              style={{
                left: 0,
                width: 2,
                background: "var(--ig-gradient)",
                opacity: 0.4,
                borderRadius: 2,
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
