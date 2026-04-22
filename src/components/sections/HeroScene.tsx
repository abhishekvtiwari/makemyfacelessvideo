"use client"
// src/components/sections/HeroScene.tsx
import { useEffect, useState } from "react"
import { motion } from "framer-motion"

function ClayBox({ delay = 0, scale = 1 }: { delay?: number; scale?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateY: -20 }}
      animate={{ opacity: 1, y: 0, rotateY: 0 }}
      transition={{ delay, duration: 0.9, type: "spring" as const, stiffness: 60, damping: 18 }}
      style={{ transformStyle: "preserve-3d", width: 80 * scale, height: 80 * scale }}
    >
      {/* Top face */}
      <div
        style={{
          width: "100%",
          height: "50%",
          background: "linear-gradient(135deg, #f0ece4, #e8e2d8)",
          borderRadius: "10px 10px 0 0",
          transformOrigin: "bottom center",
          transform: "rotateX(45deg)",
          boxShadow: "0 -4px 12px rgba(0,0,0,0.08)",
          border: "1px solid rgba(255,255,255,0.9)",
          borderBottom: "none",
        }}
      />
      {/* Front face */}
      <div
        style={{
          width: "100%",
          height: "60%",
          background: "linear-gradient(180deg, #ffffff 0%, #f5f2ee 100%)",
          borderRadius: "0 0 12px 12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
          border: "1px solid rgba(0,0,0,0.06)",
          borderTop: "none",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            width: "50%",
            height: 3,
            background: "var(--ig-gradient)",
            borderRadius: 4,
            opacity: 0.6,
          }}
        />
      </div>
    </motion.div>
  )
}

function ClayPhone({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 60, scale: 0.85 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 1.0, type: "spring" as const, stiffness: 55, damping: 16 }}
      style={{
        width: 72,
        height: 128,
        background: "linear-gradient(160deg, #ffffff 0%, #f5f2ee 100%)",
        borderRadius: 20,
        boxShadow: "0 12px 40px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,1)",
        border: "1px solid rgba(0,0,0,0.07)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {/* Screen */}
      <div
        style={{
          position: "absolute",
          inset: 6,
          borderRadius: 14,
          background: "linear-gradient(160deg, #1a0a2e 0%, #2d1060 50%, #1a0530 100%)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(160deg, rgba(245,133,41,0.35), rgba(221,42,123,0.25), rgba(81,91,212,0.35))",
          }}
        />
        {/* Play button */}
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 22,
            height: 22,
            background: "rgba(255,255,255,0.25)",
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
              borderLeft: "8px solid white",
              borderTop: "5px solid transparent",
              borderBottom: "5px solid transparent",
              marginLeft: 2,
            }}
          />
        </div>
      </div>
      {/* Notch */}
      <div
        style={{
          position: "absolute",
          top: 8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 20,
          height: 4,
          background: "rgba(0,0,0,0.12)",
          borderRadius: 4,
          zIndex: 10,
        }}
      />
    </motion.div>
  )
}

function ClayCoin({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ delay, duration: 0.8, type: "spring" as const, stiffness: 80, damping: 14 }}
    >
      <motion.div
        animate={{ y: [0, -10, 0], rotate: [0, 8, 0] }}
        transition={{ duration: 3.5, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #f0e8d0 0%, #e8d89a 50%, #f0e060 100%)",
          boxShadow: "0 8px 24px rgba(200,160,40,0.25), 0 2px 8px rgba(0,0,0,0.10), inset 0 1px 0 rgba(255,255,255,0.9)",
          border: "1px solid rgba(200,160,40,0.3)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 22,
        }}
      >
        ▶
      </motion.div>
    </motion.div>
  )
}

function ClayShelf({ delay = 0 }: { delay?: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay, duration: 0.7, type: "spring" as const, stiffness: 70, damping: 20 }}
      style={{
        position: "absolute",
        bottom: "55%",
        left: "5%",
        right: "5%",
        height: 10,
        background: "linear-gradient(180deg, #f0ece4 0%, #e0dbd0 100%)",
        borderRadius: 8,
        boxShadow: "0 4px 16px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)",
        border: "1px solid rgba(0,0,0,0.05)",
      }}
    />
  )
}

function WithFloat({
  children,
  floatDelay = 0,
  floatDuration = 4,
}: {
  children: React.ReactNode
  floatDelay?: number
  floatDuration?: number
}) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setReady(true), floatDelay * 1000 + 1000)
    return () => clearTimeout(t)
  }, [floatDelay])

  if (!ready) return <>{children}</>

  return (
    <motion.div
      animate={{ y: [0, -9, 0] }}
      transition={{ duration: floatDuration, ease: "easeInOut", repeat: Infinity, repeatType: "loop" }}
    >
      {children}
    </motion.div>
  )
}

export function HeroScene() {
  return (
    <div
      style={{
        position: "absolute",
        right: 0,
        top: 0,
        bottom: 0,
        width: "58%",
        overflow: "hidden",
      }}
    >
      {/* Floor grid */}
      <div className="hero-floor" />

      {/* ClayShelf */}
      <ClayShelf delay={0.4} />

      {/* Box — back left */}
      <div style={{ position: "absolute", bottom: "32%", left: "8%", zIndex: 4 }}>
        <WithFloat floatDelay={2} floatDuration={4.7}>
          <ClayBox delay={0.8} scale={0.75} />
        </WithFloat>
      </div>

      {/* Phone — center */}
      <div style={{ position: "absolute", bottom: "22%", left: "42%", zIndex: 5 }}>
        <WithFloat floatDelay={1.8} floatDuration={5}>
          <ClayPhone delay={0.2} />
        </WithFloat>
      </div>

      {/* Box — right, larger */}
      <div style={{ position: "absolute", bottom: "28%", right: "14%", zIndex: 4 }}>
        <WithFloat floatDelay={2.5} floatDuration={4.2}>
          <ClayBox delay={0.6} scale={1.1} />
        </WithFloat>
      </div>

      {/* Coin */}
      <div style={{ position: "absolute", bottom: "18%", right: "8%", zIndex: 6 }}>
        <ClayCoin delay={1.0} />
      </div>

      {/* Ambient light glow */}
      <div
        style={{
          position: "absolute",
          top: "-10%",
          right: "10%",
          width: 400,
          height: 400,
          background: "radial-gradient(circle, rgba(255,255,255,0.65) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />

      {/* Subtle ig glow */}
      <div
        style={{
          position: "absolute",
          bottom: "30%",
          left: "30%",
          width: 300,
          height: 300,
          background: "radial-gradient(circle, rgba(221,42,123,0.06) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 1,
        }}
      />
    </div>
  )
}
