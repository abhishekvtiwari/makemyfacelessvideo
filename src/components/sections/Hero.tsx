"use client"
// src/components/sections/Hero.tsx
import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const VIDEO_CARDS = [
  { label: "Finance", color: "#1a1a2e", accent: "#f58529" },
  { label: "True Crime", color: "#0d1117", accent: "#dd2a7b" },
  { label: "Motivation", color: "#0f0a1e", accent: "#8134af" },
  { label: "Tech", color: "#0a0a1a", accent: "#515bd4" },
]

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
        minHeight: "100vh",
        background: "var(--bg)",
        display: "flex",
        alignItems: "center",
        position: "relative",
        overflow: "hidden",
        paddingTop: 56,
      }}
    >
      {/* Subtle gradient glow */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "20%",
          width: 600,
          height: 600,
          background: "radial-gradient(circle, rgba(129,52,175,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          width: "100%",
          padding: "0 24px",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
        className="grid-cols-1 lg:grid-cols-[1fr_1fr]"
      >
        {/* LEFT — text */}
        <div style={{ maxWidth: 520 }}>
          <p className="label" style={{ marginBottom: 20 }}>
            AI Video Platform
          </p>

          <h1
            style={{
              fontSize: "clamp(52px, 7vw, 88px)",
              lineHeight: 0.95,
              letterSpacing: -4,
              fontWeight: 800,
              color: "var(--text)",
              marginBottom: 8,
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

          <p
            style={{
              fontSize: 18,
              color: "var(--text-secondary)",
              lineHeight: 1.55,
              maxWidth: "34ch",
              marginBottom: 40,
            }}
          >
            Drop a topic. Get a finished video. No camera, no editor.
          </p>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              alignItems: "center",
              background: "var(--bg-card)",
              border: "1px solid var(--border)",
              borderRadius: 12,
              padding: "6px 6px 6px 16px",
              maxWidth: 400,
              gap: 8,
              transition: "border-color 0.2s",
            }}
            onFocus={() => {}}
          >
            <span style={{ fontSize: 18, flexShrink: 0 }}>🎬</span>
            <input
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Enter your video topic…"
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                background: "transparent",
                fontSize: 14,
                color: "var(--text)",
                minWidth: 0,
              }}
            />
            <button
              type="submit"
              className="btn-primary"
              style={{
                width: 40,
                height: 40,
                padding: 0,
                borderRadius: 8,
                fontSize: 16,
                flexShrink: 0,
              }}
            >
              →
            </button>
          </form>

          <p style={{ marginTop: 14, fontSize: 12, color: "var(--text-muted)" }}>
            Free to start · No credit card required
          </p>
        </div>

        {/* RIGHT — stacked video cards */}
        <div
          className="hidden lg:flex"
          style={{
            justifyContent: "center",
            alignItems: "center",
            position: "relative",
            height: 400,
          }}
        >
          {VIDEO_CARDS.map((card, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 140,
                height: 240,
                background: card.color,
                borderRadius: 16,
                border: `1px solid rgba(255,255,255,0.08)`,
                overflow: "hidden",
                left: `${i * 48 - 80}px`,
                top: `${Math.abs(i - 1.5) * 12 - 10}px`,
                transform: `rotate(${(i - 1.5) * 3}deg)`,
                zIndex: i,
                boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
              }}
            >
              {/* gradient overlay */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  background: `linear-gradient(160deg, ${card.accent}33 0%, transparent 60%)`,
                }}
              />
              {/* play button */}
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 32,
                  height: 32,
                  background: "rgba(255,255,255,0.15)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(4px)",
                }}
              >
                <div
                  style={{
                    width: 0,
                    height: 0,
                    borderLeft: "10px solid white",
                    borderTop: "6px solid transparent",
                    borderBottom: "6px solid transparent",
                    marginLeft: 2,
                  }}
                />
              </div>
              {/* label */}
              <div
                style={{
                  position: "absolute",
                  bottom: 12,
                  left: 10,
                  right: 10,
                  fontSize: 10,
                  fontWeight: 600,
                  color: "rgba(255,255,255,0.7)",
                  letterSpacing: 1,
                  textTransform: "uppercase",
                  fontFamily: "monospace",
                }}
              >
                {card.label}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll hint */}
      <div
        style={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 10,
          color: "var(--text-muted)",
          fontFamily: "monospace",
          letterSpacing: 2,
        }}
      >
        SCROLL TO EXPLORE ↓
      </div>
    </section>
  )
}
