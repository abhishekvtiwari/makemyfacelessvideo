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
      glow.style.background = `radial-gradient(400px circle at ${currentX}% ${currentY}%, rgba(99,102,241,0.12) 0%, transparent 70%)`
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
    <section className="px-6 md:px-8 pb-24" style={{ background: "var(--background)" }}>
      <div className="mx-auto max-w-[1400px]">
        <div
          ref={sectionRef}
          className="relative overflow-hidden rounded-[28px] px-8 py-20 text-center"
          style={{
            background: "var(--card-bg)",
            boxShadow: "var(--card-shadow)",
            border: "1px solid rgba(99,102,241,0.20)",
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
            style={{ background: "linear-gradient(to right, #6366f1, #8b5cf6)" }}
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, type: "spring", stiffness: 80, damping: 20 }}
            className="relative z-10"
          >
            <h2
              className="font-semibold tracking-tighter text-zinc-950 leading-[0.95] mb-4"
              style={{ fontSize: "clamp(48px, 7vw, 80px)" }}
            >
              Press start.
            </h2>
            <p className="text-base text-zinc-500 mb-8 max-w-[40ch] mx-auto">
              Your first faceless video is minutes away.
            </p>
            <Link
              href="/auth/signup"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-medium text-white bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 transition-opacity"
              style={{ boxShadow: "0 8px 32px rgba(99,102,241,0.35)" }}
            >
              Start Creating Free →
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
