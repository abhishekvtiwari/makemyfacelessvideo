"use client"
// src/components/sections/Footer.tsx
import Link from "next/link"

export function Footer() {
  return (
    <footer
      className="px-6 md:px-8 py-16"
      style={{
        background: "#080808",
        borderTop: "1px solid var(--border-subtle)",
      }}
    >
      <div className="mx-auto max-w-[1400px] grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">

        {/* Logo + tagline */}
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-3">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{ background: "var(--ig-gradient)" }}
            >
              <span className="text-white text-xs font-bold">▶</span>
            </div>
            <span className="ig-text font-semibold text-sm tracking-tight">
              MakeMyFacelessVideo
            </span>
          </div>
          <p className="text-sm leading-relaxed max-w-[22ch]" style={{ color: "var(--text-muted)" }}>
            AI-powered faceless video creation for modern creators.
          </p>
        </div>

        {/* Product */}
        <div>
          <p className="eyebrow mb-4">PRODUCT</p>
          {[
            ["Features", "#features"],
            ["Pricing", "/pricing"],
            ["How It Works", "#how-it-works"],
            ["Dashboard", "/dashboard"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="block text-sm mb-2.5 transition-colors duration-200"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-secondary)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)" }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Legal */}
        <div>
          <p className="eyebrow mb-4">LEGAL</p>
          {[
            ["Privacy Policy", "/privacy"],
            ["Terms & Conditions", "/terms"],
            ["Refund Policy", "/refund"],
          ].map(([label, href]) => (
            <Link
              key={label}
              href={href}
              className="block text-sm mb-2.5 transition-colors duration-200"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-secondary)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)" }}
            >
              {label}
            </Link>
          ))}
        </div>

        {/* Contact */}
        <div>
          <p className="eyebrow mb-4">CONTACT</p>
          <a
            href="mailto:hello@makemyfacelessvideo.com"
            className="block text-sm mb-2.5 transition-colors duration-200"
            style={{ color: "var(--text-muted)" }}
            onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-secondary)" }}
            onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)" }}
          >
            hello@makemyfacelessvideo.com
          </a>
          {["Instagram", "YouTube"].map((l) => (
            <a
              key={l}
              href="#"
              className="block text-sm mb-2.5 transition-colors duration-200"
              style={{ color: "var(--text-muted)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "var(--text-secondary)" }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "var(--text-muted)" }}
            >
              {l}
            </a>
          ))}
        </div>
      </div>

      <div
        className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
        style={{ borderTop: "1px solid var(--border-subtle)" }}
      >
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          © 2026 MakeMyFacelessVideo.com · All rights reserved.
        </p>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Built with AI. Shipped fast.
        </p>
      </div>
    </footer>
  )
}
