"use client"
// src/components/sections/Navbar.tsx
import { useEffect, useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        left: "50%",
        transform: "translateX(-50%)",
        width: "min(90%, 900px)",
        zIndex: 100,
      }}
    >
      <motion.nav
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        style={{
          width: "100%",
          background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.75)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderRadius: 50,
          padding: "10px 16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          boxShadow: scrolled
            ? "0 4px 24px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,1)"
            : "0 2px 12px rgba(0,0,0,0.05), inset 0 1px 0 rgba(255,255,255,0.9)",
          border: "1px solid rgba(255,255,255,0.8)",
          transition: "background 0.3s, box-shadow 0.3s",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "var(--ig-gradient)",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>▶</span>
          </div>
          <span style={{ fontWeight: 600, fontSize: 14, letterSpacing: "-0.3px", color: "var(--text-primary)" }}>
            MakeMyFacelessVideo
          </span>
        </Link>

        <div
          style={{ display: "flex", alignItems: "center", gap: 24 }}
          className="hidden md:flex"
        >
          {["Features", "Pricing", "How It Works"].map((item) => (
            <Link
              key={item}
              href={item === "Pricing" ? "/pricing" : `#${item.toLowerCase().replace(/ /g, "-")}`}
              style={{ fontSize: 14, color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)" }}
            >
              {item}
            </Link>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link
            href="/auth/login"
            style={{
              fontSize: 14,
              color: "var(--text-secondary)",
              textDecoration: "none",
              padding: "6px 12px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)" }}
          >
            Sign In
          </Link>
          <Link href="/auth/signup" className="btn-primary text-sm px-4 py-1.5 rounded-xl">
            Start Free
          </Link>
        </div>
      </motion.nav>
    </div>
  )
}
