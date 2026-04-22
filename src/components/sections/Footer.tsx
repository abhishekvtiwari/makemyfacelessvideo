"use client"
// src/components/sections/Footer.tsx
import Link from "next/link"

export function Footer() {
  return (
    <footer
      style={{
        background: "#050505",
        padding: "64px 24px 32px",
        borderTop: "1px solid var(--border)",
      }}
    >
      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
          gap: 32,
          marginBottom: 48,
        }}
      >
        {/* Logo + tagline */}
        <div style={{ gridColumn: "span 2" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
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
            <span style={{ fontWeight: 600, fontSize: 14, color: "rgba(255,255,255,0.8)" }}>
              MakeMyFacelessVideo
            </span>
          </div>
          <p style={{ fontSize: 13, color: "rgba(255,255,255,0.35)", lineHeight: 1.6, maxWidth: "22ch" }}>
            AI-powered faceless video creation for modern creators.
          </p>
        </div>

        {/* Product */}
        <div>
          <p className="label" style={{ marginBottom: 16 }}>PRODUCT</p>
          {[
            ["Features", "#features"],
            ["Pricing", "/pricing"],
            ["How It Works", "#how-it-works"],
            ["Dashboard", "/dashboard"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              style={{ display: "block", fontSize: 13, marginBottom: 10, color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.4)" }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Legal */}
        <div>
          <p className="label" style={{ marginBottom: 16 }}>LEGAL</p>
          {[
            ["Privacy Policy", "/privacy"],
            ["Terms & Conditions", "/terms"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              style={{ display: "block", fontSize: 13, marginBottom: 10, color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.4)" }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <p className="label" style={{ marginBottom: 16 }}>CONTACT</p>
          <a
            href="mailto:hello@makemyfacelessvideo.com"
            style={{ display: "block", fontSize: 13, marginBottom: 10, color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.4)" }}
          >
            hello@makemyfacelessvideo.com
          </a>
          {["Instagram", "YouTube"].map((l) => (
            <a
              key={l}
              href="#"
              style={{ display: "block", fontSize: 13, marginBottom: 10, color: "rgba(255,255,255,0.4)", textDecoration: "none", transition: "color 0.2s" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.85)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(255,255,255,0.4)" }}
            >
              {l}
            </a>
          ))}
        </div>
      </div>

      <div
        style={{
          maxWidth: 1200,
          margin: "0 auto",
          paddingTop: 24,
          borderTop: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 8,
        }}
      >
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
          © 2026 MakeMyFacelessVideo.com · All rights reserved.
        </p>
        <p style={{ fontSize: 12, color: "rgba(255,255,255,0.25)" }}>
          Built with AI. Shipped fast.
        </p>
      </div>
    </footer>
  )
}
