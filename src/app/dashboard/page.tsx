// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import StatsCard from "@/components/dashboard/StatsCard";
import VideoCard from "@/components/dashboard/VideoCard";
import { getSession, type User } from "@/lib/auth";

// ─── Mock data ────────────────────────────────────────────────────────────────

const MOCK_USER: User = {
  id: "usr_demo",
  email: "alex@example.com",
  name: "Alex",
  plan: "free",
  creditsRemaining: 8,
  creditsTotal: 50,
};

const MOCK_VIDEOS = [
  {
    id: "vid_1",
    title: "10 Crazy Facts About Space You Didn't Know",
    thumbnailUrl: null,
    status: "done" as const,
    createdAt: "2 days ago",
  },
  {
    id: "vid_2",
    title: "How to Make Money Online in 2026",
    thumbnailUrl: null,
    status: "done" as const,
    createdAt: "5 days ago",
  },
  {
    id: "vid_3",
    title: "The Dark Side of Social Media",
    thumbnailUrl: null,
    status: "processing" as const,
    createdAt: "1 week ago",
  },
];

// ─── Upgrade prompt ───────────────────────────────────────────────────────────

function UpgradePrompt({ creditsRemaining }: { creditsRemaining: number }) {
  return (
    <div className="rounded-xl border border-[rgba(255,159,10,0.3)] bg-[rgba(255,159,10,0.06)] px-5 py-4">
      <div className="flex items-start gap-3">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="mt-0.5 shrink-0">
          <path d="M10 2L2 17h16L10 2Z" stroke="#ff9f0a" strokeWidth="1.5" strokeLinejoin="round" fill="none" />
          <path d="M10 8v4M10 14h.01" stroke="#ff9f0a" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <div className="flex-1">
          <p className="font-body text-sm font-semibold text-[#ff9f0a]">Running Low on Credits</p>
          <p className="mt-0.5 font-body text-sm text-[#6b6b80]">
            You have <span className="font-semibold text-[#e8e8f0]">{creditsRemaining} credits</span> left.
            Upgrade to keep creating!
          </p>
        </div>
        <Link
          href="/#pricing"
          className="shrink-0 rounded-lg border border-[rgba(255,159,10,0.4)] px-3 py-1.5 font-body text-sm font-semibold text-[#ff9f0a] transition-colors hover:bg-[rgba(255,159,10,0.1)]"
        >
          View Plans →
        </Link>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const session = await getSession();
      if (!session) {
        // Fall back to mock data in development
        if (process.env.NEXT_PUBLIC_APP_ENV === "development") {
          setUser(MOCK_USER);
        } else {
          router.push("/auth");
          return;
        }
      } else {
        setUser(session);
      }
      setLoading(false);
    }
    load();
  }, [router]);

  // Always use mock user for now (stub)
  const displayUser = user ?? MOCK_USER;
  const showUpgradePrompt =
    displayUser.plan === "free" && displayUser.creditsRemaining < 10;

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <svg className="h-8 w-8 animate-spin text-[#ff2d55]" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">
      <Navbar user={{ name: displayUser.name, email: displayUser.email, plan: displayUser.plan }} />

      <main className="mx-auto max-w-7xl px-5 py-10">

        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-4xl tracking-wider text-[#e8e8f0]">
            DASHBOARD
          </h1>
          <p className="mt-1 font-body text-sm text-[#6b6b80]">
            Welcome back, {displayUser.name}
          </p>
        </div>

        {/* Upgrade prompt */}
        {showUpgradePrompt && (
          <div className="mb-6">
            <UpgradePrompt creditsRemaining={displayUser.creditsRemaining} />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">

          {/* Left column — stats + recent videos */}
          <div className="flex flex-col gap-6 lg:col-span-2">

            {/* Stats grid */}
            <div className="grid gap-4 sm:grid-cols-2">
              <StatsCard
                label="Credits Remaining"
                value={displayUser.creditsRemaining}
                sub={`of ${displayUser.creditsTotal} ${displayUser.plan === "free" ? "lifetime" : "this month"}`}
                progress={{
                  current: displayUser.creditsTotal - displayUser.creditsRemaining,
                  total: displayUser.creditsTotal,
                  danger: displayUser.creditsRemaining < 10,
                }}
                action={
                  displayUser.plan === "free"
                    ? { label: "Upgrade plan", href: "/#pricing" }
                    : undefined
                }
                accent="red"
              />

              <StatsCard
                label="Current Plan"
                value={displayUser.plan.replace("_", " ").toUpperCase()}
                sub={displayUser.plan === "free" ? "50 lifetime credits" : "Resets monthly"}
                action={{ label: "Manage billing", href: "/billing" }}
                accent={
                  displayUser.plan === "free"
                    ? "red"
                    : displayUser.plan === "starter"
                    ? "green"
                    : displayUser.plan === "growth"
                    ? "purple"
                    : "gold"
                }
              />

              <StatsCard
                label="Videos Created"
                value={MOCK_VIDEOS.length}
                sub="Total all time"
                action={{ label: "View all", href: "/history" }}
                accent="purple"
              />

              <StatsCard
                label="Total Downloads"
                value={displayUser.plan === "free" ? "—" : "0"}
                sub={
                  displayUser.plan === "free"
                    ? "Upgrade to download"
                    : "Downloads available"
                }
                action={
                  displayUser.plan === "free"
                    ? { label: "Upgrade to download", href: "/#pricing" }
                    : undefined
                }
                accent="gold"
              />
            </div>

            {/* Recent videos */}
            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-2xl tracking-wider text-[#e8e8f0]">
                  RECENT VIDEOS
                </h2>
                <Link href="/history" className="font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0]">
                  View all →
                </Link>
              </div>

              {MOCK_VIDEOS.length === 0 ? (
                <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] px-6 py-12 text-center">
                  <p className="font-body text-[#6b6b80]">No videos yet.</p>
                  <Link href="/create" className="mt-3 inline-block font-body text-sm font-semibold text-[#ff2d55] hover:text-[#ff375f]">
                    Create your first video →
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {MOCK_VIDEOS.map((video) => (
                    <VideoCard
                      key={video.id}
                      {...video}
                      onClick={() => router.push(`/history/${video.id}`)}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Right column — quick action */}
          <div className="flex flex-col gap-5">
            <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-6">
              <h3 className="font-display text-2xl tracking-wider text-[#e8e8f0]">QUICK ACTION</h3>
              <p className="mt-1 font-body text-sm text-[#6b6b80]">
                Turn any topic into a video in minutes.
              </p>
              <Link
                href="/create"
                className="btn-red-glow mt-5 flex items-center justify-center gap-2 rounded-xl py-4 font-body font-semibold"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                Create Video
              </Link>
            </div>

            {/* Plan details */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-6">
              <h3 className="font-display text-xl tracking-wider text-[#e8e8f0]">YOUR PLAN</h3>
              <div className="mt-3 flex items-center gap-2">
                <span className="font-display text-3xl tracking-wide text-[#6b6b80]">
                  {displayUser.plan === "free" ? "FREE" : displayUser.plan.replace("_", " ").toUpperCase()}
                </span>
              </div>
              {displayUser.plan === "free" && (
                <>
                  <p className="mt-2 font-body text-xs text-[#6b6b80]">
                    50 lifetime credits to try the product. Upgrade anytime.
                  </p>
                  <Link
                    href="/#pricing"
                    className="mt-4 flex items-center justify-center rounded-xl border border-[rgba(255,45,85,0.4)] py-3 font-body text-sm font-semibold text-[#ff2d55] transition-colors hover:bg-[rgba(255,45,85,0.08)]"
                  >
                    View Plans
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
