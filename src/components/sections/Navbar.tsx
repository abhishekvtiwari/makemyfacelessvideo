"use client"
// src/components/sections/Navbar.tsx
import { useEffect, useState } from "react"
import Link from "next/link"

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: 56,
        zIndex: 100,
        display: "flex",
        alignItems: "center",
        padding: "0 24px",
        background: scrolled ? "rgba(10,10,10,0.92)" : "rgba(10,10,10,0.85)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        transition: "border-color 0.3s ease, background 0.3s ease",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "var(--ig)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            <span style={{ color: "white", fontSize: 12, fontWeight: 700 }}>▶</span>
          </div>
          <span
            style={{
              fontWeight: 600,
              fontSize: 14,
              letterSpacing: "-0.3px",
              color: "var(--text)",
            }}
          >
            MakeMyFacelessVideo
          </span>
        </Link>

        {/* Nav links */}
        <div
          style={{ display: "flex", alignItems: "center", gap: 28 }}
          className="hidden md:flex"
        >
          {[
            ["Features", "#features"],
            ["Pricing", "/pricing"],
            ["How It Works", "#how-it-works"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              style={{
                fontSize: 13,
                color: "var(--text-secondary)",
                textDecoration: "none",
                transition: "color 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)" }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Auth buttons */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <Link
            href="/auth/login"
            style={{
              fontSize: 13,
              color: "var(--text-secondary)",
              textDecoration: "none",
              padding: "6px 12px",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text)" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-secondary)" }}
          >
            Sign In
          </Link>
          <Link
            href="/auth/signup"
            className="btn-primary"
            style={{ fontSize: 13, padding: "7px 16px", borderRadius: 8 }}
          >
            Start Free
          </Link>
        </div>
      </div>
    </nav>
  )
}
