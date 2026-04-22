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
      className={`fixed top-2 left-4 right-4 z-50 rounded-2xl px-5 py-3 flex items-center justify-between transition-all duration-300 ${
        scrolled
          ? "bg-white/70 backdrop-blur-2xl backdrop-saturate-150 border border-white/60 shadow-sm"
          : "bg-white/30 backdrop-blur-md border border-white/20"
      }`}
    >
      <Link href="/" className="flex items-center gap-2">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 flex items-center justify-center">
          <span className="text-white text-xs font-bold">▶</span>
        </div>
        <span className="font-semibold text-sm text-zinc-900 tracking-tight">
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
            className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors"
          >
            {item}
          </Link>
        ))}
      </div>

      <div className="flex items-center gap-2">
        <Link
          href="/auth/login"
          className="text-sm text-zinc-500 hover:text-zinc-900 transition-colors px-3 py-1.5"
        >
          Sign In
        </Link>
        <Link
          href="/auth/signup"
          className="text-sm font-medium text-white px-4 py-1.5 rounded-xl bg-gradient-to-r from-indigo-500 to-violet-500 hover:opacity-90 transition-opacity"
        >
          Start Free
        </Link>
      </div>
    </motion.nav>
  )
}
