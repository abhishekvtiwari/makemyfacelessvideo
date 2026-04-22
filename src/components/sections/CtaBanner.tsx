"use client"
// src/components/sections/CtaBanner.tsx
import Link from "next/link"

export function CtaBanner() {
  return (
    <section
      className="section"
      style={{
        background: "var(--bg-card)",
        borderTop: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        textAlign: "center",
      }}
    >
      <div className="section-inner">
        <h2
          className="ig-text"
          style={{
            fontSize: "clamp(40px, 5vw, 72px)",
            marginBottom: 16,
            letterSpacing: -2,
          }}
        >
          Press start.
        </h2>
        <p
          style={{
            fontSize: 16,
            color: "var(--text-secondary)",
            marginBottom: 36,
            maxWidth: "40ch",
            margin: "0 auto 36px",
          }}
        >
          Your first faceless video is minutes away.
        </p>
        <Link href="/auth/signup" className="btn-primary" style={{ fontSize: 15, padding: "14px 32px", borderRadius: 12 }}>
          Start Creating Free →
        </Link>
      </div>
    </section>
  )
}
