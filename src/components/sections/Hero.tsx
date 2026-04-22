"use client"
// src/components/sections/Hero.tsx
import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"

const NICHES = ["Finance", "Motivation", "True Crime", "History", "Tech"]

const CARD_POSITIONS = [
  { x: -140, y: -80,  z: -60,  rotateY: 15,  rotateX: -5, delay: 0   },
  { x: 100,  y: -120, z: -20,  rotateY: -10, rotateX: 8,  delay: 0.1 },
  { x: -160, y: 80,   z: -40,  rotateY: 20,  rotateX: 3,  delay: 0.2 },
  { x: 120,  y: 60,   z: -80,  rotateY: -18, rotateX: -6, delay: 0.3 },
  { x: -20,  y: 140,  z: -100, rotateY: 5,   rotateX: 10, delay: 0.4 },
]

function NicheCard({
  niche,
  index,
  mouseX,
  mouseY,
}: {
  niche: string
  index: number
  mouseX: number
  mouseY: number
}) {
  const pos = CARD_POSITIONS[index]
  const parallaxX = mouseX * 0.03 * (index % 2 === 0 ? 1 : -1)
  const parallaxY = mouseY * 0.02 * (index % 2 === 0 ? -1 : 1)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.8 + pos.delay, duration: 0.6, type: "spring" as const, stiffness: 80 }}
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        transform: `translate(calc(-50% + ${pos.x + parallaxX}px), calc(-50% + ${pos.y + parallaxY}px)) translateZ(${pos.z}px) rotateY(${pos.rotateY}deg) rotateX(${pos.rotateX}deg)`,
        transition: "transform 0.1s ease-out",
        width: 180,
        zIndex: 10 - index,
      }}
    >
      <div className="card-surface p-4 select-none" style={{ width: 180 }}>
        <div
          className="absolute left-0 top-4 w-1 h-10 rounded-r-full"
          style={{ background: "var(--ig-gradient)" }}
        />
        <p className="eyebrow mb-1 pl-3">NICHE 0{index + 1}</p>
        <p className="font-semibold text-base pl-3" style={{ color: "var(--text-primary)" }}>{niche}</p>
        <div className="mt-3 flex items-center gap-1 pl-3">
          <div className="h-1 flex-1 rounded-full opacity-30" style={{ background: "var(--ig-gradient)" }} />
          <span className="text-[8px] font-mono" style={{ color: "var(--text-muted)" }}>VIDEO</span>
        </div>
      </div>
    </motion.div>
  )
}

export function Hero() {
  const [mouseX, setMouseX] = useState(0)
  const [mouseY, setMouseY] = useState(0)
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!heroRef.current) return
      const rect = heroRef.current.getBoundingClientRect()
      setMouseX(e.clientX - rect.left - rect.width / 2)
      setMouseY(e.clientY - rect.top - rect.height / 2)
    }
    window.addEventListener("mousemove", onMove)
    return () => window.removeEventListener("mousemove", onMove)
  }, [])

  const headline = ["Create a", "faceless video", "in minutes."]

  return (
    <section
      ref={heroRef}
      className="min-h-screen flex items-center px-6 md:px-8 pt-24 pb-16"
      style={{ background: "var(--bg-primary)" }}
    >
      <div className="mx-auto max-w-[1400px] w-full grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

        {/* LEFT */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="eyebrow">/ 01 · AI VIDEO PLATFORM</span>
          </motion.div>

          <h1 className="mt-6">
            {headline.map((line, i) => (
              <motion.span
                key={i}
                className="block"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.2 + i * 0.12,
                  duration: 0.7,
                  type: "spring" as const,
                  stiffness: 80,
                  damping: 20,
                }}
              >
                {i === 2 ? (
                  <>in <span className="ig-text">minutes.</span></>
                ) : (
                  line
                )}
              </motion.span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-6 text-lg leading-relaxed max-w-[48ch]"
            style={{ color: "var(--text-secondary)" }}
          >
            Drop a topic. We write the script, cast the voice, source the
            visuals, and hand you a finished video. No camera. No editor.
            No excuses.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.75, duration: 0.6 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              href="/auth/signup"
              className="btn-primary gap-2 px-6 py-3 rounded-2xl text-sm"
            >
              Start Creating →
            </Link>
            <Link
              href="#how-it-works"
              className="btn-ghost gap-2 px-6 py-3 rounded-2xl text-sm"
            >
              See How It Works
            </Link>
          </motion.div>
        </div>

        {/* RIGHT — 3D CARD CLUSTER */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="relative hidden lg:block"
          style={{ height: 500, perspective: 800, perspectiveOrigin: "center center" }}
        >
          <div style={{ position: "relative", width: "100%", height: "100%", transformStyle: "preserve-3d" }}>
            {NICHES.map((niche, i) => (
              <NicheCard key={niche} niche={niche} index={i} mouseX={mouseX} mouseY={mouseY} />
            ))}
            <div
              style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                width: 300,
                height: 300,
                background: "radial-gradient(circle, rgba(221,42,123,0.12) 0%, transparent 70%)",
                pointerEvents: "none",
              }}
            />
          </div>
        </motion.div>

      </div>
    </section>
  )
}
