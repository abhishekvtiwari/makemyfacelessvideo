// src/components/sections/Footer.tsx
import Link from "next/link"

export function Footer() {
  return (
    <footer
      className="px-6 md:px-8 py-14"
      style={{
        borderTop: "1px solid rgba(0,0,0,0.06)",
        background: "var(--background)",
      }}
    >
      <div className="mx-auto max-w-[1400px]">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">

          {/* Logo + tagline */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center flex-shrink-0">
                <span className="text-white text-xs font-bold">▶</span>
              </div>
              <span className="font-semibold text-sm text-zinc-900 tracking-tight">
                MakeMyFacelessVideo
              </span>
            </div>
            <p className="text-sm text-zinc-500 leading-relaxed max-w-[22ch]">
              AI-powered faceless video creation for modern creators.
            </p>
          </div>

          {/* Product */}
          <div>
            <p className="text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-4">
              PRODUCT
            </p>
            {[
              ["Features", "#features"],
              ["Pricing", "/pricing"],
              ["How It Works", "#how-it-works"],
              ["Dashboard", "/dashboard"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-2.5"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Legal */}
          <div>
            <p className="text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-4">
              LEGAL
            </p>
            {[
              ["Privacy Policy", "/privacy"],
              ["Terms & Conditions", "/terms"],
              ["Refund Policy", "/refund"],
            ].map(([label, href]) => (
              <Link
                key={label}
                href={href}
                className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-2.5"
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <p className="text-[10px] font-mono font-medium tracking-widest text-zinc-400 uppercase mb-4">
              CONTACT
            </p>
            <a
              href="mailto:hello@makemyfacelessvideo.com"
              className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-2.5"
            >
              hello@makemyfacelessvideo.com
            </a>
            {["Instagram", "YouTube"].map((l) => (
              <a
                key={l}
                href="#"
                className="block text-sm text-zinc-500 hover:text-zinc-900 transition-colors mb-2.5"
              >
                {l}
              </a>
            ))}
          </div>
        </div>

        <div
          className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderTop: "1px solid rgba(0,0,0,0.06)" }}
        >
          <p className="text-xs text-zinc-400">
            © 2026 MakeMyFacelessVideo.com · All rights reserved.
          </p>
          <p className="text-xs text-zinc-400">
            Built with AI. Shipped fast.
          </p>
        </div>
      </div>
    </footer>
  )
}
