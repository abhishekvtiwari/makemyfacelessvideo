"use client"
// src/components/sections/Features.tsx
import { useEffect, useRef } from "react"
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection"
import { EyebrowBadge } from "@/components/ui/EyebrowBadge"
import { PencilSimple, Waveform, FilmSlate, Play } from "@phosphor-icons/react"

const FEATURES = [
  {
    num: "01",
    title: "Script Engine",
    Icon: PencilSimple,
    desc: "Writes hook-led scripts tuned to your niche, tone, and duration. Paced for 30–600 seconds.",
  },
  {
    num: "02",
    title: "Voice Cast",
    Icon: Waveform,
    desc: "Studio-grade AI voices. Hindi + English. Choose tone, speed, and emotion. Zero recording needed.",
  },
  {
    num: "03",
    title: "Visual Engine",
    Icon: FilmSlate,
    desc: "Cinematic stock footage sourced scene-by-scene from your script keywords. Auto-matched to pacing.",
  },
  {
    num: "04",
    title: "Auto Render",
    Icon: Play,
    desc: "Assembled into a finished MP4 with captions. Download or publish in the same session.",
  },
]

function TiltCard({ feature }: { feature: (typeof FEATURES)[number] }) {
  const cardRef = useRef<HTMLDivElement>(null)
  const glossRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const card = cardRef.current
    const gloss = glossRef.current
    if (!card || !gloss) return
    if (!window.matchMedia("(pointer: fine)").matches) return

    const onEnter = () => {
      card.style.transition = "transform 0.25s ease, box-shadow 0.25s ease"
      card.style.boxShadow =
        "0 20px 60px rgba(0,0,0,0.12), 0 8px 24px rgba(221,42,123,0.12)"
    }
    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      card.style.transition = "box-shadow 0.25s ease"
      card.style.transform = `perspective(600px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) translateZ(4px) translateY(-6px)`
      const gx = ((e.clientX - rect.left) / rect.width) * 100
      const gy = ((e.clientY - rect.top) / rect.height) * 100
      gloss.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.6) 0%, transparent 60%)`
      gloss.style.opacity = "1"
    }
    const onLeave = () => {
      card.style.transition =
        "transform 0.5s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.4s ease"
      card.style.transform =
        "perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0) translateY(0)"
      card.style.boxShadow = ""
      gloss.style.opacity = "0"
    }

    card.addEventListener("mouseenter", onEnter)
    card.addEventListener("mousemove", onMove)
    card.addEventListener("mouseleave", onLeave)
    return () => {
      card.removeEventListener("mouseenter", onEnter)
      card.removeEventListener("mousemove", onMove)
      card.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <AnimatedItem>
      <div
        ref={cardRef}
        className="card-surface p-7 h-full"
        style={{ willChange: "transform" }}
      >
        <div
          ref={glossRef}
          className="absolute inset-0 pointer-events-none z-[3]"
          style={{ opacity: 0, transition: "opacity 0.2s ease", borderRadius: 20 }}
        />

        <div className="flex items-start justify-between mb-5 relative z-[2]">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "var(--ig-gradient)" }}
          >
            <feature.Icon size={20} weight="duotone" style={{ color: "white" }} />
          </div>
          <span className="eyebrow">MODULE {feature.num}</span>
        </div>

        <div className="relative z-[2]">
          <h3 className="text-lg mb-2" style={{ color: "var(--text-primary)" }}>
            {feature.title}
          </h3>
          <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            {feature.desc}
          </p>
        </div>
      </div>
    </AnimatedItem>
  )
}

export function Features() {
  return (
    <section id="features" className="section" style={{ background: "var(--bg-primary)" }}>
      <div className="section-inner">
        <AnimatedSection>
          <AnimatedItem>
            <EyebrowBadge>/ 02 · HOW IT WORKS</EyebrowBadge>
          </AnimatedItem>
          <AnimatedItem>
            <h2 className="mt-5 max-w-[20ch]">
              <span className="block">Four steps.</span>
              <span className="block">One prompt.</span>
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <p className="mt-4 leading-relaxed max-w-[48ch]">
              Every faceless video needs a hook, a voice, a visual loop, and a
              pace. We handle all four simultaneously.
            </p>
          </AnimatedItem>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {FEATURES.map((f) => (
              <TiltCard key={f.num} feature={f} />
            ))}
          </div>
        </AnimatedSection>
      </div>
    </section>
  )
}
