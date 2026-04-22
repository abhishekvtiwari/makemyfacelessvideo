"use client"
// src/components/sections/Hero.tsx
import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { HeroScene } from "./HeroScene"

export function Hero() {
  const [topic, setTopic] = useState("")
  const router = useRouter()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (topic.trim()) {
      router.push(`/auth/signup?topic=${encodeURIComponent(topic.trim())}`)
    }
  }

  return (
    <section
      style={{
        height: "100vh",
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(160deg, #F0EEF0 0%, #E8E6EC 40%, #EDE8E6 100%)",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* LEFT TEXT STACK */}
      <div
        style={{
          position: "absolute",
          left: "clamp(32px, 6vw, 80px)",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          maxWidth: 460,
        }}
      >
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            fontSize: 10,
            fontFamily: "monospace",
            letterSpacing: 3,
            textTransform: "uppercase",
            background: "var(--ig-gradient)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: 20,
          }}
        >
          AI Video Platform
        </motion.p>

        {/* Big heading */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.8, type: "spring" as const, stiffness: 70 }}
        >
          <h1
            style={{
              fontSize: "clamp(72px, 9vw, 130px)",
              lineHeight: 0.92,
              letterSpacing: -5,
              fontWeight: 800,
              color: "var(--text-primary)",
              marginBottom: 6,
            }}
          >
            MMFV
          </h1>
          <p
            style={{
              fontSize: 11,
              color: "var(--text-muted)",
              letterSpacing: 4,
              textTransform: "uppercase",
              fontFamily: "monospace",
              marginBottom: 24,
            }}
          >
            MakeMyFacelessVideo
          </p>
        </motion.div>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.7 }}
          style={{
            fontSize: 18,
            color: "var(--text-secondary)",
            lineHeight: 1.55,
            maxWidth: "34ch",
            marginBottom: 36,
            fontStyle: "italic",
          }}
        >
          Drop a topic. Get a finished video. No camera, no editor.
        </motion.p>

        {/* Input bar pill */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.6 }}
          onSubmit={handleSubmit}
          style={{
            display: "flex",
            alignItems: "center",
            background: "white",
            borderRadius: 50,
            padding: "6px 6px 6px 20px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
            border: "1px solid rgba(0,0,0,0.07)",
            maxWidth: 380,
            gap: 8,
          }}
        >
          <span style={{ fontSize: 18, flexShrink: 0 }}>🎬</span>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="Enter your video topic..."
            style={{
              flex: 1,
              border: "none",
              outline: "none",
              background: "transparent",
              fontSize: 14,
              color: "var(--text-primary)",
              minWidth: 0,
            }}
          />
          <button
            type="submit"
            style={{
              background: "var(--ig-gradient)",
              width: 42,
              height: 42,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              color: "white",
              fontSize: 16,
              boxShadow: "0 4px 16px rgba(221,42,123,0.3)",
            }}
          >
            →
          </button>
        </motion.form>

        {/* Subtext */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          style={{
            marginTop: 16,
            fontSize: 12,
            color: "var(--text-muted)",
          }}
        >
          Free to start · No credit card required
        </motion.p>
      </div>

      {/* RIGHT — HeroScene (hidden on small screens) */}
      <div className="hidden lg:block" style={{ position: "absolute", inset: 0 }}>
        <HeroScene />
      </div>

      {/* MOBILE fallback — static video pill */}
      <div
        className="lg:hidden"
        style={{
          position: "absolute",
          right: 24,
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 5,
        }}
      >
        <div
          style={{
            width: 90,
            height: 160,
            background: "linear-gradient(160deg, #1a0a2e 0%, #2d1060 40%, #1a0530 100%)",
            borderRadius: 16,
            overflow: "hidden",
            border: "1px solid rgba(255,255,255,0.15)",
            boxShadow: "0 20px 60px rgba(221,42,123,0.25)",
            position: "relative",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(160deg, rgba(245,133,41,0.35), rgba(221,42,123,0.25), rgba(81,91,212,0.35))",
            }}
          />
          <div
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 28,
              height: 28,
              background: "rgba(255,255,255,0.2)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 0,
                height: 0,
                borderLeft: "10px solid white",
                borderTop: "7px solid transparent",
                borderBottom: "7px solid transparent",
                marginLeft: 2,
              }}
            />
          </div>
        </div>
      </div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
        style={{
          position: "absolute",
          bottom: 32,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 11,
          color: "var(--text-muted)",
          fontFamily: "monospace",
          letterSpacing: 2,
          zIndex: 10,
        }}
      >
        SCROLL TO EXPLORE ↓
      </motion.div>
    </section>
  )
}
