// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type Plan = "free" | "starter" | "growth" | "influencer" | "ultra" | "character_pro";
type VideoStatus = "pending" | "processing" | "done" | "failed";

interface DashUser {
  name: string;
  email: string;
  image?: string | null;
  plan: Plan;
  creditsRemaining: number;
  creditsTotal: number;
  videosCreated: number;
}

interface Video {
  id: string;
  title: string;
  status: VideoStatus;
  createdAt: string;
}

// ─── Mock data (replace with real Supabase fetch) ─────────────────────────────

const MOCK_VIDEOS: Video[] = [
  { id: "v1", title: "10 Crazy Facts About Space You Never Knew", status: "done", createdAt: "2 days ago" },
  { id: "v2", title: "How to Make $1,000/Month with Faceless YouTube", status: "done", createdAt: "5 days ago" },
  { id: "v3", title: "The Dark Side of Social Media Addiction", status: "processing", createdAt: "1 week ago" },
];

// ─── Plan config ──────────────────────────────────────────────────────────────

const PLAN_CONFIG: Record<Plan, { label: string; color: string; bg: string; border: string }> = {
  free:          { label: "Free",          color: "#6b6b80", bg: "rgba(107,107,128,0.1)",  border: "rgba(107,107,128,0.3)"  },
  starter:       { label: "Starter",       color: "#30d158", bg: "rgba(48,209,88,0.1)",   border: "rgba(48,209,88,0.3)"    },
  growth:        { label: "Growth",        color: "#bf5af2", bg: "rgba(191,90,242,0.1)",  border: "rgba(191,90,242,0.3)"   },
  influencer:    { label: "Influencer",    color: "#ff6b35", bg: "rgba(255,107,53,0.1)",  border: "rgba(255,107,53,0.3)"   },
  ultra:         { label: "Ultra",         color: "#ff2d55", bg: "rgba(255,45,85,0.1)",   border: "rgba(255,45,85,0.3)"    },
  character_pro: { label: "Character Pro", color: "#ff9f0a", bg: "rgba(255,159,10,0.1)",  border: "rgba(255,159,10,0.3)"   },
};

// ─── Spinner ─────────────────────────────────────────────────────────────────

function Spinner({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={`animate-spin text-[#ff2d55] ${className}`} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function DashNav({ user }: { user: DashUser }) {
  const [open, setOpen] = useState(false);
  const planCfg = PLAN_CONFIG[user.plan];
  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <nav className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,15,0.92)] backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <Link href="/dashboard" className="font-display text-2xl tracking-wider">
          MMFV<span className="gradient-text">.</span>
        </Link>

        {/* Nav links */}
        <div className="hidden items-center gap-1 sm:flex">
          {[
            { href: "/dashboard", label: "Dashboard" },
            { href: "/create", label: "Create" },
            { href: "/history", label: "History" },
          ].map((l) => (
            <Link key={l.href} href={l.href}
              className="rounded-lg px-4 py-2 font-body text-sm text-[#6b6b80] transition-colors hover:bg-[#1a1a24] hover:text-[#e8e8f0]">
              {l.label}
            </Link>
          ))}
        </div>

        {/* Avatar */}
        <div className="relative">
          <button onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2.5 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1a1a24] px-3 py-2 transition-colors hover:border-[rgba(255,255,255,0.15)]">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[rgba(255,45,85,0.2)] font-mono text-xs font-bold text-[#ff2d55]">
              {initials}
            </div>
            <span className="hidden rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider sm:block"
              style={{ color: planCfg.color, borderColor: planCfg.border, backgroundColor: planCfg.bg }}>
              {planCfg.label}
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-[#6b6b80]">
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#1a1a24] py-1.5 shadow-2xl">
                <div className="border-b border-[rgba(255,255,255,0.06)] px-4 py-3">
                  <p className="truncate font-body text-sm font-medium text-[#e8e8f0]">{user.name}</p>
                  <p className="truncate font-body text-xs text-[#6b6b80]">{user.email}</p>
                </div>
                {[
                  { href: "/settings", label: "Settings" },
                  { href: "/billing", label: "Billing" },
                ].map((item) => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0]">
                    {item.label}
                  </Link>
                ))}
                <div className="my-1 border-t border-[rgba(255,255,255,0.06)]" />
                <button onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full px-4 py-2.5 text-left font-body text-sm text-[#ff453a] transition-colors hover:bg-[rgba(255,69,58,0.08)]">
                  Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

// ─── Credits widget ───────────────────────────────────────────────────────────

function CreditsWidget({ user }: { user: DashUser }) {
  const pct = Math.round(((user.creditsTotal - user.creditsRemaining) / user.creditsTotal) * 100);
  const isLow = user.creditsRemaining < 10;
  const barColor = isLow ? "#ff453a" : user.plan === "free" ? "#6b6b80" : "#ff2d55";

  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-5">
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest text-[#6b6b80]">Credits</p>
        {user.plan === "free" && (
          <Link href="/#pricing" className="font-body text-xs font-semibold text-[#ff2d55] hover:text-[#ff375f]">
            Upgrade →
          </Link>
        )}
      </div>
      <div className="mt-2 flex items-end gap-1">
        <span className="font-display text-5xl leading-none tracking-wide" style={{ color: isLow ? "#ff453a" : "#e8e8f0" }}>
          {user.creditsRemaining}
        </span>
        <span className="mb-1.5 font-body text-sm text-[#6b6b80]">
          / {user.creditsTotal} {user.plan === "free" ? "lifetime" : "this mo."}
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full rounded-full bg-[rgba(255,255,255,0.06)]">
        <div className="h-1.5 rounded-full transition-all duration-700"
          style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, href, accentColor }: {
  label: string; value: string | number; sub?: string; href?: string; accentColor: string;
}) {
  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-5">
      <p className="font-mono text-xs uppercase tracking-widest text-[#6b6b80]">{label}</p>
      <p className="mt-2 font-display text-4xl leading-none tracking-wide" style={{ color: accentColor }}>
        {value}
      </p>
      {sub && <p className="mt-1 font-body text-xs text-[#6b6b80]">{sub}</p>}
      {href && (
        <Link href={href} className="mt-3 inline-block font-body text-xs font-semibold transition-colors hover:opacity-80"
          style={{ color: accentColor }}>
          View →
        </Link>
      )}
    </div>
  );
}

// ─── Video row ────────────────────────────────────────────────────────────────

const STATUS_CFG: Record<VideoStatus, { label: string; color: string; bg: string }> = {
  pending:    { label: "Pending",    color: "#ff9f0a", bg: "rgba(255,159,10,0.12)"  },
  processing: { label: "Processing", color: "#bf5af2", bg: "rgba(191,90,242,0.12)" },
  done:       { label: "Done",       color: "#30d158", bg: "rgba(48,209,88,0.12)"   },
  failed:     { label: "Failed",     color: "#ff453a", bg: "rgba(255,69,58,0.12)"   },
};

function VideoRow({ video }: { video: Video }) {
  const s = STATUS_CFG[video.status];
  return (
    <div className="flex items-center gap-4 rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-4 transition-all hover:border-[rgba(255,255,255,0.15)] hover:bg-[#141420]">
      {/* Placeholder thumbnail */}
      <div className="flex h-12 w-20 shrink-0 items-center justify-center rounded-lg bg-[#1a1a24]">
        {video.status === "processing" ? (
          <Spinner className="h-5 w-5" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="16" height="16" rx="3" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
            <path d="M7 6l5 3-5 3V6Z" fill="rgba(255,255,255,0.2)" />
          </svg>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="truncate font-body text-sm font-medium text-[#e8e8f0]">{video.title}</p>
        <p className="mt-0.5 font-body text-xs text-[#6b6b80]">{video.createdAt}</p>
      </div>
      <span className="shrink-0 rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider"
        style={{ color: s.color, backgroundColor: s.bg }}>
        {s.label}
      </span>
    </div>
  );
}

// ─── Upgrade banner ───────────────────────────────────────────────────────────

function UpgradeBanner({ credits }: { credits: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[rgba(255,159,10,0.3)] bg-[rgba(255,159,10,0.06)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mt-0.5 shrink-0">
          <path d="M9 2L1 16h16L9 2Z" stroke="#ff9f0a" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M9 7v4M9 13h.01" stroke="#ff9f0a" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <div>
          <p className="font-body text-sm font-semibold text-[#ff9f0a]">Running low — {credits} credits left</p>
          <p className="mt-0.5 font-body text-xs text-[#6b6b80]">Upgrade to keep creating without interruption.</p>
        </div>
      </div>
      <Link href="/#pricing"
        className="shrink-0 rounded-lg border border-[rgba(255,159,10,0.4)] px-4 py-2 font-body text-sm font-semibold text-[#ff9f0a] transition-colors hover:bg-[rgba(255,159,10,0.1)]">
        View Plans →
      </Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [user, setUser] = useState<DashUser | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth");
      return;
    }
    if (status === "authenticated" && session?.user) {
      // TODO: fetch real plan + credits from Supabase
      // For now, build from NextAuth session + mock data
      setUser({
        name: session.user.name ?? session.user.email?.split("@")[0] ?? "Creator",
        email: session.user.email ?? "",
        image: session.user.image,
        plan: "free",
        creditsRemaining: 8,
        creditsTotal: 50,
        videosCreated: MOCK_VIDEOS.length,
      });
    }
  }, [status, session, router]);

  if (status === "loading" || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <Spinner />
      </div>
    );
  }

  const planCfg = PLAN_CONFIG[user.plan];
  const showUpgrade = user.plan === "free" && user.creditsRemaining < 10;

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <DashNav user={user} />

      <main className="mx-auto max-w-7xl px-5 py-10">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl tracking-wider">
              GOOD {new Date().getHours() < 12 ? "MORNING" : new Date().getHours() < 18 ? "AFTERNOON" : "EVENING"},{" "}
              <span className="gradient-text">{user.name.toUpperCase().split(" ")[0]}</span>
            </h1>
            <p className="mt-1 font-body text-sm text-[#6b6b80]">{user.email}</p>
          </div>
          <Link href="/create"
            className="btn-red-glow mt-4 flex w-fit items-center gap-2 rounded-xl px-6 py-3 font-body font-semibold sm:mt-0">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Create Video
          </Link>
        </div>

        {/* Upgrade banner */}
        {showUpgrade && (
          <div className="mb-6">
            <UpgradeBanner credits={user.creditsRemaining} />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* ── Main column ────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-6 lg:col-span-2">

            {/* Stats row */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="col-span-2 sm:col-span-1">
                <CreditsWidget user={user} />
              </div>
              <StatCard
                label="Videos Created"
                value={user.videosCreated}
                sub="All time"
                href="/history"
                accentColor="#bf5af2"
              />
              <StatCard
                label="Downloads"
                value={user.plan === "free" ? "—" : "0"}
                sub={user.plan === "free" ? "Paid plans only" : "Available"}
                href={user.plan === "free" ? "/#pricing" : "/history"}
                accentColor="#ff9f0a"
              />
            </div>

            {/* Recent videos */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-2xl tracking-wider">RECENT VIDEOS</h2>
                <Link href="/history" className="font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0]">
                  View all →
                </Link>
              </div>

              {MOCK_VIDEOS.length === 0 ? (
                <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] px-6 py-14 text-center">
                  <p className="font-body text-[#6b6b80]">No videos yet. Create your first one!</p>
                  <Link href="/create" className="mt-3 inline-block font-body text-sm font-semibold text-[#ff2d55]">
                    Create now →
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {MOCK_VIDEOS.map((v) => <VideoRow key={v.id} video={v} />)}
                </div>
              )}
            </div>
          </div>

          {/* ── Sidebar ────────────────────────────────────────────────────── */}
          <div className="flex flex-col gap-5">

            {/* Create CTA */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-6">
              <h3 className="font-display text-xl tracking-wider">QUICK CREATE</h3>
              <p className="mt-1.5 font-body text-sm text-[#6b6b80]">
                Turn any topic into a video in minutes.
              </p>
              <Link href="/create"
                className="btn-red-glow mt-5 flex items-center justify-center gap-2 rounded-xl py-4 font-body font-semibold text-sm">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                New Video
              </Link>
            </div>

            {/* Plan card */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-6">
              <h3 className="font-display text-xl tracking-wider">YOUR PLAN</h3>
              <div className="mt-3 flex items-center gap-3">
                <span className="font-display text-3xl tracking-wider" style={{ color: planCfg.color }}>
                  {planCfg.label.toUpperCase()}
                </span>
              </div>

              {user.plan === "free" ? (
                <>
                  <p className="mt-2 font-body text-xs text-[#6b6b80] leading-relaxed">
                    50 lifetime credits to explore the platform. Upgrade anytime to unlock more.
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    {["No watermark", "1,080p exports", "AI Agent", "Auto-post"].map((feat) => (
                      <div key={feat} className="flex items-center gap-2 font-body text-xs text-[#6b6b80]">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l2.5 2.5L10 3.5" stroke="#6b6b80" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.5 1" />
                        </svg>
                        {feat}
                      </div>
                    ))}
                  </div>
                  <Link href="/#pricing"
                    className="mt-5 flex items-center justify-center rounded-xl border border-[rgba(255,45,85,0.4)] py-3 font-body text-sm font-semibold text-[#ff2d55] transition-colors hover:bg-[rgba(255,45,85,0.08)]">
                    Upgrade Plan
                  </Link>
                </>
              ) : (
                <>
                  <p className="mt-2 font-body text-xs text-[#6b6b80]">
                    {user.creditsTotal.toLocaleString()} credits/month · Resets on billing date
                  </p>
                  <Link href="/billing"
                    className="mt-4 block text-center font-body text-xs font-semibold transition-colors hover:opacity-80"
                    style={{ color: planCfg.color }}>
                    Manage billing →
                  </Link>
                </>
              )}
            </div>

            {/* Help */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-5">
              <p className="font-body text-sm font-semibold text-[#e8e8f0]">Need help?</p>
              <p className="mt-1 font-body text-xs text-[#6b6b80]">Our team is here to help you create.</p>
              <Link href="/contact"
                className="mt-3 block font-body text-xs font-semibold text-[#bf5af2] transition-colors hover:text-[#c86ff5]">
                Contact support →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
