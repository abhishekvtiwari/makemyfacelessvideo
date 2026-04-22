"use client"
// src/components/sections/CtaBanner.tsx
import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export function CtaBanner() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const glowRef    = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const glow    = glowRef.current
    if (!section || !glow) return

    let targetX = 50
    let targetY = 50
    let currentX = 50
    let currentY = 50
    let frame: number

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t

    const tick = () => {
      currentX = lerp(currentX, targetX, 0.08)
      currentY = lerp(currentY, targetY, 0.08)
      glow.style.background = `radial-gradient(400px circle at ${currentX}% ${currentY}%, rgba(221,42,123,0.10) 0%, transparent 70%)`
      frame = requestAnimationFrame(tick)
    }
    frame = requestAnimationFrame(tick)

    const onMove = (e: MouseEvent) => {
      const rect = section.getBoundingClientRect()
      targetX = ((e.clientX - rect.left) / rect.width) * 100
      targetY = ((e.clientY - rect.top) / rect.height) * 100
    }
    section.addEventListener("mousemove", onMove)

    return () => {
      cancelAnimationFrame(frame)
      section.removeEventListener("mousemove", onMove)
    }
  }, [])

  return (
    <section
      className="section"
      style={{
        background: "radial-gradient(ellipse at center, rgba(221,42,123,0.06) 0%, transparent 60%), var(--bg-secondary)",
      }}
    >
      <div className="section-inner">
        <div
          ref={sectionRef}
          className="relative overflow-hidden rounded-[28px] text-center"
          style={{
            background: "var(--bg-card)",
            boxShadow: "0 0 0 1px rgba(221,42,123,0.2), var(--shadow-card)",
            border: "1px solid rgba(221,42,123,0.15)",
            padding: "80px 32px",
          }}
        >
          {/* Mouse glow */}
          <div
            ref={glowRef}
            className="absolute inset-0 pointer-events-none rounded-[28px]"
          />

          {/* Gradient border accent */}
          <div
            className="absolute inset-x-0 top-0 h-[2px] rounded-t-[28px]"
            style={{ background: "var(--ig-gradient)" }}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring" as const, stiffness: 80, damping: 20 }}
            className="relative z-10 max-w-[600px] mx-auto"
          >
            <h2 className="ig-text mb-4" style={{ fontSize: "clamp(40px, 5vw, 64px)" }}>
              Press start.
            </h2>
            <p className="text-base mb-8 max-w-[40ch] mx-auto" style={{ color: "var(--text-secondary)" }}>
              Your first faceless video is minutes away.
            </p>
            <Link
              href="/auth/signup"
              className="btn-primary gap-2 px-8 py-4 rounded-2xl text-base"
            >
              Start Creating Free →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
