"use client"
// src/components/sections/Features.tsx
import { useEffect, useRef } from "react"
import { AnimatedSection, AnimatedItem } from "@/components/ui/AnimatedSection"
import { EyebrowBadge } from "@/components/ui/EyebrowBadge"
import {
  PencilSimple,
  Waveform,
  FilmSlate,
  Play,
} from "@phosphor-icons/react"

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

    const onMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect()
      const x = (e.clientX - rect.left) / rect.width - 0.5
      const y = (e.clientY - rect.top) / rect.height - 0.5
      const rotX = -y * 8
      const rotY = x * 8
      card.style.transition = "transform 0.1s ease"
      card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateZ(4px)`
      // Gloss highlight follows mouse
      const gx = (e.clientX - rect.left) / rect.width * 100
      const gy = (e.clientY - rect.top) / rect.height * 100
      gloss.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.18) 0%, transparent 60%)`
      gloss.style.opacity = "1"
    }
    const onLeave = () => {
      card.style.transition = "transform 0.5s cubic-bezier(0.34,1.56,0.64,1)"
      card.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) translateZ(0)"
      gloss.style.opacity = "0"
    }

    card.addEventListener("mousemove", onMove)
    card.addEventListener("mouseleave", onLeave)
    return () => {
      card.removeEventListener("mousemove", onMove)
      card.removeEventListener("mouseleave", onLeave)
    }
  }, [])

  return (
    <AnimatedItem>
      <div
        ref={cardRef}
        className="card-surface p-7 relative overflow-hidden"
        style={{ willChange: "transform" }}
      >
        {/* Gloss highlight */}
        <div
          ref={glossRef}
          className="absolute inset-0 rounded-[20px] pointer-events-none"
          style={{ opacity: 0, transition: "opacity 0.2s ease" }}
        />

        {/* Module number */}
        <div className="flex items-start justify-between mb-5">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #eef2ff, #f5f3ff)" }}
          >
            <feature.Icon size={20} weight="duotone" className="text-indigo-500" />
          </div>
          <span className="text-[10px] font-mono text-indigo-400 tracking-widest">
            MODULE {feature.num}
          </span>
        </div>

        <h3 className="text-lg font-semibold text-zinc-900 mb-2">{feature.title}</h3>
        <p className="text-sm text-zinc-500 leading-relaxed">{feature.desc}</p>
      </div>
    </AnimatedItem>
  )
}

export function Features() {
  return (
    <section id="features" className="px-6 md:px-8 py-24" style={{ background: "var(--background)" }}>
      <div className="mx-auto max-w-[1400px]">
        <AnimatedSection>
          <AnimatedItem>
            <EyebrowBadge>/ 02 · HOW IT WORKS</EyebrowBadge>
          </AnimatedItem>
          <AnimatedItem>
            <h2 className="mt-5 text-4xl md:text-5xl font-semibold tracking-tighter text-zinc-950 leading-[1.05]">
              <span className="block">Four steps.</span>
              <span className="block">One prompt.</span>
            </h2>
          </AnimatedItem>
          <AnimatedItem>
            <p className="mt-4 text-base text-zinc-500 leading-relaxed max-w-[48ch]">
              Every faceless video needs a hook, a voice, a visual loop, and a pace. We handle all four simultaneously.
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
