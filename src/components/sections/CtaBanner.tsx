"use client"
// src/components/sections/CtaBanner.tsx
import { useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

export function CtaBanner() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const section = sectionRef.current
    const glow = glowRef.current
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
      glow.style.background = `radial-gradient(500px circle at ${currentX}% ${currentY}%, rgba(221,42,123,0.12) 0%, transparent 70%)`
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
      ref={sectionRef}
      className="section relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #1a0a2e 0%, #2d1060 100%)",
      }}
    >
      {/* Ambient ig-gradient glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse at center, rgba(221,42,123,0.15) 0%, rgba(129,52,175,0.10) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Mouse glow */}
      <div
        ref={glowRef}
        className="absolute inset-0 pointer-events-none"
      />

      {/* Top gradient accent line */}
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{ background: "var(--ig-gradient)", opacity: 0.6 }}
      />

      <div className="section-inner relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{
            duration: 0.7,
            type: "spring" as const,
            stiffness: 80,
            damping: 20,
          }}
          className="max-w-[600px] mx-auto"
        >
          <h2
            className="mb-4"
            style={{
              color: "white",
              fontSize: "clamp(40px, 5vw, 64px)",
            }}
          >
            Press start.
          </h2>
          <p
            className="text-base mb-8 max-w-[40ch] mx-auto"
            style={{ color: "rgba(255,255,255,0.55)" }}
          >
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
    </section>
  )
}
