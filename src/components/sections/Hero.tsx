"use client"
// src/components/sections/Hero.tsx
import { motion } from "framer-motion"
import { HeroLaptop } from "./HeroLaptop"
import Link from "next/link"

export function Hero() {
  return (
    <section
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        display: "flex",
        alignItems: "center",
        padding: "120px clamp(24px, 6vw, 80px) 60px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BG GLOW */}
      <div
        style={{
          position: "absolute",
          right: "30%",
          top: "50%",
          transform: "translateY(-50%)",
          width: 600,
          height: 600,
          background:
            "radial-gradient(circle, rgba(129,52,175,0.12) 0%, rgba(221,42,123,0.06) 40%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 1400,
          width: "100%",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 60,
          alignItems: "center",
        }}
      >
        {/* LEFT — TEXT */}
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              fontSize: 10,
              fontFamily: "monospace",
              letterSpacing: 3,
              textTransform: "uppercase",
              background:
                "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              marginBottom: 24,
            }}
          >
            / 01 · AI Video Platform
          </motion.p>

          <div style={{ overflow: "hidden" }}>
            {(
              [
                "MMFV",
                "MakeMyFacelessVideo",
                "Drop a topic. Watch it become a video.",
              ] as const
            ).map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                  delay: 0.1 + i * 0.15,
                  duration: 0.7,
                  type: "spring" as const,
                  stiffness: 80,
                  damping: 18,
                }}
              >
                {i === 0 && (
                  <h1
                    style={{
                      fontSize: "clamp(72px, 10vw, 140px)",
                      lineHeight: 1,
                      letterSpacing: -4,
                      fontWeight: 700,
                      background:
                        "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                      marginBottom: 4,
                    }}
                  >
                    {text}
                  </h1>
                )}
                {i === 1 && (
                  <p
                    style={{
                      fontSize: 13,
                      color: "#555",
                      letterSpacing: 2,
                      textTransform: "uppercase",
                      fontFamily: "monospace",
                      marginBottom: 24,
                    }}
                  >
                    {text}
                  </p>
                )}
                {i === 2 && (
                  <p
                    style={{
                      fontSize: "clamp(18px, 2vw, 24px)",
                      color: "rgba(255,255,255,0.5)",
                      fontStyle: "italic",
                      lineHeight: 1.5,
                      maxWidth: "44ch",
                      marginBottom: 36,
                    }}
                  >
                    {text}
                  </p>
                )}
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            style={{ display: "flex", gap: 12, flexWrap: "wrap" }}
          >
            <Link
              href="/auth/signup"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 600,
                color: "white",
                background:
                  "linear-gradient(135deg, #f58529, #dd2a7b, #8134af, #515bd4)",
                textDecoration: "none",
                boxShadow: "0 0 30px rgba(221,42,123,0.3)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              Start Creating →
            </Link>
            <Link
              href="#how-it-works"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "14px 28px",
                borderRadius: 14,
                fontSize: 14,
                fontWeight: 600,
                color: "rgba(255,255,255,0.6)",
                background: "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.1)",
                textDecoration: "none",
              }}
            >
              See How It Works
            </Link>
          </motion.div>
        </div>

        {/* RIGHT — LAPTOP */}
        <div style={{ height: 500, position: "relative" }}>
          <HeroLaptop />
        </div>
      </div>

      {/* BOTTOM FADE */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: 100,
          background: "linear-gradient(to bottom, transparent, #0a0a0a)",
          pointerEvents: "none",
        }}
      />
    </section>
  )
}
