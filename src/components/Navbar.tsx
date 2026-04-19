// src/components/Navbar.tsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { logout } from "@/lib/auth";

interface NavbarProps {
  user?: { name: string; email: string; plan: string } | null;
}

const PLAN_COLORS: Record<string, string> = {
  free: "text-[#6b6b80] border-[rgba(255,255,255,0.15)]",
  starter: "text-[#30d158] border-[rgba(48,209,88,0.3)]",
  growth: "text-[#bf5af2] border-[rgba(191,90,242,0.3)]",
  influencer: "text-[#ff6b35] border-[rgba(255,107,53,0.3)]",
  ultra: "text-[#ff2d55] border-[rgba(255,45,85,0.3)]",
  character_pro: "text-[#ff9f0a] border-[rgba(255,159,10,0.3)]",
};

const NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/create", label: "Create" },
  { href: "/history", label: "History" },
];

export default function Navbar({ user }: NavbarProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function handleLogout() {
    await logout();
    router.push("/");
  }

  const initials = user?.name
    ? user.name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  const planKey = user?.plan ?? "free";
  const planColor = PLAN_COLORS[planKey] ?? PLAN_COLORS.free;

  return (
    <nav className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,15,0.9)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">

        {/* Logo */}
        <Link href="/dashboard" className="font-display text-2xl tracking-wider text-[#e8e8f0]">
          MMFV<span className="gradient-text">.</span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-1 sm:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded-lg px-4 py-2 font-body text-sm transition-colors duration-200 ${
                pathname === link.href
                  ? "bg-[#1a1a24] text-[#e8e8f0]"
                  : "text-[#6b6b80] hover:text-[#e8e8f0]"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Avatar + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1a1a24] px-3 py-2 transition-colors hover:border-[rgba(255,255,255,0.15)]"
          >
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,45,85,0.2)] font-mono text-xs font-bold text-[#ff2d55]">
              {initials}
            </div>
            {user && (
              <span className={`hidden rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider sm:block ${planColor}`}>
                {planKey.replace("_", " ")}
              </span>
            )}
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#6b6b80]">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1a1a24] py-1.5 shadow-xl">
              {user && (
                <div className="border-b border-[rgba(255,255,255,0.06)] px-4 py-3">
                  <p className="font-body text-sm font-medium text-[#e8e8f0] truncate">{user.name}</p>
                  <p className="font-body text-xs text-[#6b6b80] truncate">{user.email}</p>
                </div>
              )}
              <Link
                href="/settings"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0]"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="7" r="2" stroke="currentColor" strokeWidth="1.2" /><path d="M7 1v1M7 12v1M1 7h1M12 7h1M2.64 2.64l.71.71M10.65 10.65l.71.71M2.64 11.36l.71-.71M10.65 3.35l.71-.71" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                Settings
              </Link>
              <Link
                href="/billing"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2.5 px-4 py-2.5 font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0]"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="8" rx="2" stroke="currentColor" strokeWidth="1.2" /><path d="M1 6h12" stroke="currentColor" strokeWidth="1.2" /></svg>
                Billing
              </Link>
              <div className="my-1 border-t border-[rgba(255,255,255,0.06)]" />
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 font-body text-sm text-[#ff453a] transition-colors hover:bg-[rgba(255,69,58,0.08)]"
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 7h7M9 5l2 2-2 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" /><path d="M5 3H3a1 1 0 0 0-1 1v6a1 1 0 0 0 1 1h2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" /></svg>
                Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
