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
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-2 left-4 right-4 z-50 rounded-2xl px-5 py-3 flex items-center justify-between transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.92)" : "rgba(255,255,255,0.70)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: scrolled ? "0 4px 20px rgba(0,0,0,0.08)" : "none",
      }}
    >
      <Link href="/" className="flex items-center gap-2">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ background: "var(--ig-gradient)" }}
        >
          <span className="text-white text-xs font-bold">▶</span>
        </div>
        <span className="font-semibold text-sm tracking-tight" style={{ color: "var(--text-primary)" }}>
          MakeMyFacelessVideo
        </span>
      </Link>

      <div className="hidden md:flex items-center gap-6">
        {["Features", "Pricing", "How It Works"].map((item) => (
          <Link
            key={item}
            href={
              item === "Pricing"
                ? "/pricing"
                : `#${item.toLowerCase().replace(/ /g, "-")}`
            }
            className="text-sm transition-colors duration-200"
            style={{ color: "var(--text-secondary)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)" }}
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="text-sm px-3 py-1.5 transition-colors duration-200"
          style={{ color: "var(--text-secondary)" }}
          onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-primary)" }}
          onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)" }}
        >
          Sign In
        </Link>
        <Link
          href="/auth/signup"
          className="btn-primary text-sm px-4 py-1.5 rounded-xl"
        >
          Start Free
        </Link>
      </div>
    </motion.nav>
  )
}
