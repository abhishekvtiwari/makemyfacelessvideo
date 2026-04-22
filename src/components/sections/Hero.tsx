"use client"
// src/components/sections/Hero.tsx
import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import Link from "next/link"
import { BrowserScene } from "./BrowserScene"

export function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  })

  const smooth = useSpring(scrollYProgress, { stiffness: 60, damping: 20 })

  // Left text fades out as browser takes focus
  const textOpacity = useTransform(smooth, [0, 0.12, 0.25], [1, 1, 0])
  const textY = useTransform(smooth, [0.12, 0.28], [0, -50])

  // CTA fades in at end
  const ctaOpacity = useTransform(smooth, [0.85, 0.97], [0, 1])
  const ctaY = useTransform(smooth, [0.85, 0.97], [30, 0])

  return (
    <div ref={sectionRef} style={{ height: "500vh" }}>
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          background:
            "linear-gradient(135deg, #F5F3F0 0%, #EDE8E3 50%, #F0EEF5 100%)",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
        }}
      >
        {/* SUBTLE GRID FLOOR */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(rgba(0,0,0,0.04) 1px, transparent 1px),
              linear-gradient(90deg, rgba(0,0,0,0.04) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px",
            transform:
              "perspective(600px) rotateX(60deg) translateY(40%) scale(2.5)",
            transformOrigin: "bottom center",
            opacity: 0.5,
            pointerEvents: "none",
          }}
        />

        {/* AMBIENT GLOW */}
        <div
          style={{
            position: "absolute",
            right: "20%",
            top: "30%",
            width: 500,
            height: 500,
            background:
              "radial-gradient(circle, rgba(221,42,123,0.08) 0%, rgba(129,52,175,0.05) 40%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        {/* LEFT TEXT — static wrapper for positioning, motion.div for animation */}
        <div
          style={{
            position: "absolute",
            left: "clamp(32px, 7vw, 100px)",
            top: "50%",
            transform: "translateY(-50%)",
            zIndex: 10,
            maxWidth: 480,
          }}
        >
          <motion.div style={{ opacity: textOpacity, y: textY }}>
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
                marginBottom: 20,
              }}
            >
              AI Video Platform
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.1,
                duration: 0.8,
                type: "spring" as const,
                stiffness: 70,
              }}
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

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.7 }}
              style={{
                fontSize: 20,
                color: "var(--text-secondary)",
                lineHeight: 1.55,
                maxWidth: "38ch",
                marginBottom: 36,
                fontWeight: 400,
              }}
            >
              Drop a topic. Watch it become a finished video. No camera. No
              editor.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              style={{
                fontSize: 12,
                color: "var(--text-muted)",
                fontFamily: "monospace",
                letterSpacing: 1,
              }}
            >
              ↓ scroll to watch it happen
            </motion.p>
          </motion.div>
        </div>

        {/* 3D BROWSER SCENE — desktop only */}
        <div className="hidden lg:block">
          <BrowserScene progress={smooth} />
        </div>

        {/* MOBILE STATIC VIDEO CARD */}
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
              width: 100,
              height: 177,
              background:
                "linear-gradient(160deg, #1a0a2e 0%, #2d1060 40%, #1a0530 100%)",
              borderRadius: 16,
              overflow: "hidden",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: "0 20px 60px rgba(221,42,123,0.3)",
              position: "relative",
            }}
          >
            <div
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(160deg, rgba(245,133,41,0.4), rgba(221,42,123,0.3), rgba(81,91,212,0.4))",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: 32,
                height: 32,
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
                  borderLeft: "12px solid white",
                  borderTop: "8px solid transparent",
                  borderBottom: "8px solid transparent",
                  marginLeft: 2,
                }}
              />
            </div>
          </div>
        </div>

        {/* FINAL CTA — appears at end of scroll sequence */}
        <div
          style={{
            position: "absolute",
            bottom: 64,
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 30,
          }}
        >
          <motion.div
            style={{
              opacity: ctaOpacity,
              y: ctaY,
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Link
              href="/auth/signup"
              style={{
                padding: "16px 40px",
                borderRadius: 50,
                fontSize: 15,
                fontWeight: 700,
                color: "white",
                background:
                  "linear-gradient(135deg, #f58529, #dd2a7b, #8134af)",
                textDecoration: "none",
                boxShadow:
                  "0 8px 32px rgba(221,42,123,0.35), 0 2px 8px rgba(0,0,0,0.1)",
              }}
            >
              Start Creating Free →
            </Link>
            <Link
              href="#features"
              style={{
                padding: "16px 32px",
                borderRadius: 50,
                fontSize: 15,
                fontWeight: 600,
                color: "var(--text-secondary)",
                background: "rgba(255,255,255,0.8)",
                border: "1px solid rgba(0,0,0,0.08)",
                textDecoration: "none",
                backdropFilter: "blur(8px)",
              }}
            >
              See Features
            </Link>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
