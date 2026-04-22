// src/app/dashboard/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type Plan = "free" | "starter" | "growth" | "influencer" | "ultra" | "character_pro";
type VideoStatus = "pending" | "processing" | "done" | "failed";

interface DashUser {
  id: string | null;
  name: string;
  email: string;
  avatar_url?: string | null;
  plan: Plan;
  credits_remaining: number;
  credits_total: number;
  credits_used: number;
  created_at: string;
}

interface Video {
  id: string;
  title: string;
  status: VideoStatus;
  platform: string;
  created_at: string;
  video_url?: string | null;
  thumbnail_url?: string | null;
}

interface ActivityItem {
  id: string;
  action: string;
  metadata: Record<string, unknown> | null;
  ip_address?: string;
  created_at: string;
}

interface DashData {
  user: DashUser;
  videos: Video[];
  activity: ActivityItem[];
}

// ─── Config maps ─────────────────────────────────────────────────────────────

const PLAN_CONFIG: Record<Plan, { label: string; color: string; bg: string; border: string; credits: string }> = {
  free:          { label: "Free",          color: "#6B7280", bg: "rgba(107,114,128,0.08)", border: "rgba(107,114,128,0.25)", credits: "50 lifetime"    },
  starter:       { label: "Starter",       color: "#059669", bg: "rgba(5,150,105,0.08)",  border: "rgba(5,150,105,0.25)",    credits: "500/mo"         },
  growth:        { label: "Growth",        color: "#4633E0", bg: "rgba(70,51,224,0.08)",  border: "rgba(70,51,224,0.25)",    credits: "1,000/mo"       },
  influencer:    { label: "Influencer",    color: "#D97706", bg: "rgba(217,119,6,0.08)",  border: "rgba(217,119,6,0.25)",    credits: "2,000/mo"       },
  ultra:         { label: "Ultra",         color: "#DC2626", bg: "rgba(220,38,38,0.08)",  border: "rgba(220,38,38,0.25)",    credits: "5,000/mo"       },
  character_pro: { label: "Character Pro", color: "#7C3AED", bg: "rgba(124,58,237,0.08)", border: "rgba(124,58,237,0.25)",   credits: "10,000/mo"      },
};

const STATUS_CFG: Record<VideoStatus, { label: string; color: string; bg: string }> = {
  pending:    { label: "Pending",    color: "#D97706", bg: "rgba(217,119,6,0.10)"   },
  processing: { label: "Processing", color: "#4633E0", bg: "rgba(70,51,224,0.10)"   },
  done:       { label: "Done",       color: "#059669", bg: "rgba(5,150,105,0.10)"   },
  failed:     { label: "Failed",     color: "#DC2626", bg: "rgba(220,38,38,0.10)"   },
};

// ─── Activity labels ──────────────────────────────────────────────────────────

function activityMeta(action: string): { label: string; color: string; icon: React.ReactNode } {
  const icons: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    "login":            { label: "Signed in",        color: "#059669", icon: <LoginIcon /> },
    "signup":           { label: "Account created",  color: "#059669", icon: <LoginIcon /> },
    "video.created":    { label: "Video created",    color: "#4633E0", icon: <VideoIcon /> },
    "video.generating": { label: "Video generating", color: "#4633E0", icon: <VideoIcon /> },
    "video.done":       { label: "Video ready",      color: "#059669", icon: <VideoIcon /> },
    "video.failed":     { label: "Video failed",     color: "#DC2626", icon: <VideoIcon /> },
    "credits.used":     { label: "Credits used",     color: "#D97706", icon: <CreditIcon /> },
    "credits.added":    { label: "Credits added",    color: "#059669", icon: <CreditIcon /> },
    "plan.upgraded":    { label: "Plan upgraded",    color: "#4633E0", icon: <StarIcon />   },
    "plan.downgraded":  { label: "Plan downgraded",  color: "#6B7280", icon: <StarIcon />   },
    "otp.sent":         { label: "OTP code sent",    color: "#6B7280", icon: <MailIcon />   },
    "otp.verified":     { label: "OTP verified",     color: "#059669", icon: <MailIcon />   },
    "password.reset":   { label: "Password reset",   color: "#D97706", icon: <LockIcon />   },
  };
  return icons[action] ?? { label: action.replace(/[._]/g, " "), color: "#6B7280", icon: <DotIcon /> };
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

// ─── Icons ────────────────────────────────────────────────────────────────────

const LoginIcon = () => <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.3" /><path d="M2 12c0-2.2 2.2-4 5-4s5 1.8 5 4" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
const VideoIcon = () => <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="1" y="2.5" width="9" height="9" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M10 5.5l3-2v7l-3-2V5.5Z" stroke="currentColor" strokeWidth="1.3" strokeLinejoin="round" /></svg>
const CreditIcon = () => <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M1 6h12" stroke="currentColor" strokeWidth="1.3" /></svg>
const StarIcon = () => <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><path d="M7 1l1.5 4h4l-3.3 2.4 1.3 4L7 9l-3.5 2.4 1.3-4L1.5 5h4L7 1Z" stroke="currentColor" strokeWidth="1.2" strokeLinejoin="round" /></svg>
const MailIcon = () => <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="1" y="3" width="12" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M1 4l6 4 6-4" stroke="currentColor" strokeWidth="1.3" /></svg>
const LockIcon = () => <svg width="12" height="12" viewBox="0 0 14 14" fill="none"><rect x="2.5" y="6" width="9" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.3" /><path d="M4.5 6V4.5a2.5 2.5 0 0 1 5 0V6" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" /></svg>
const DotIcon = () => <svg width="8" height="8" viewBox="0 0 8 8" fill="none"><circle cx="4" cy="4" r="3" stroke="currentColor" strokeWidth="1.3" /></svg>

function Spinner({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={`animate-spin ${className}`} viewBox="0 0 24 24" fill="none" style={{ color: '#4633E0' }}>
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function DashNav({ user }: { user: DashUser }) {
  const [open, setOpen] = useState(false);
  const planCfg = PLAN_CONFIG[user.plan];
  const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <nav className="sticky top-0 z-50 backdrop-blur-xl"
      style={{ borderBottom: '1px solid rgba(0,0,0,0.07)', background: 'rgba(245,242,238,0.92)' }}>
      <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
        <Link href="/dashboard" className="font-display text-2xl tracking-wider" style={{ color: '#0A0A0A', textDecoration: 'none' }}>
          MMFV<span className="gradient-text">.</span>
        </Link>

        <div className="hidden items-center gap-1 sm:flex">
          {[{ href: "/dashboard", label: "Dashboard" }, { href: "/create", label: "Create" }, { href: "/history", label: "History" }].map(l => (
            <Link key={l.href} href={l.href}
              className="rounded-lg px-4 py-2 text-sm transition-colors"
              style={{ color: '#6B7280', textDecoration: 'none', fontFamily: 'var(--font-geist)' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#EEEBE6'; (e.currentTarget as HTMLElement).style.color = '#0A0A0A'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = ''; (e.currentTarget as HTMLElement).style.color = '#6B7280'; }}
            >{l.label}</Link>
          ))}
        </div>

        <div className="relative">
          <button onClick={() => setOpen(o => !o)}
            className="flex items-center gap-2.5 rounded-xl px-3 py-2 transition-colors"
            style={{ border: '1px solid rgba(0,0,0,0.10)', background: '#FFFFFF' }}>
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="" className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <div className="flex h-7 w-7 items-center justify-center rounded-full font-mono text-xs font-bold"
                style={{ background: 'rgba(70,51,224,0.12)', color: '#4633E0' }}>
                {initials}
              </div>
            )}
            <span className="hidden rounded-full border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider sm:block"
              style={{ color: planCfg.color, borderColor: planCfg.border, backgroundColor: planCfg.bg }}>
              {planCfg.label}
            </span>
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ color: '#6B7280' }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {open && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
              <div className="absolute right-0 top-full z-20 mt-2 w-52 rounded-xl py-1.5 shadow-lg"
                style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#FFFFFF' }}>
                <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                  <p className="truncate text-sm font-medium" style={{ color: '#0A0A0A', fontFamily: 'var(--font-geist)' }}>{user.name}</p>
                  <p className="truncate text-xs" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>{user.email}</p>
                </div>
                {[{ href: "/settings", label: "Settings" }, { href: "/billing", label: "Billing" }].map(item => (
                  <Link key={item.href} href={item.href} onClick={() => setOpen(false)}
                    className="block px-4 py-2.5 text-sm transition-colors"
                    style={{ color: '#6B7280', textDecoration: 'none', fontFamily: 'var(--font-geist)' }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#0A0A0A'; (e.currentTarget as HTMLElement).style.background = '#F5F2EE'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#6B7280'; (e.currentTarget as HTMLElement).style.background = ''; }}
                  >{item.label}</Link>
                ))}
                <div className="my-1" style={{ borderTop: '1px solid rgba(0,0,0,0.06)' }} />
                <button onClick={() => signOut({ callbackUrl: "/" })}
                  className="w-full px-4 py-2.5 text-left text-sm transition-colors"
                  style={{ color: '#DC2626', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-geist)' }}
                  onMouseEnter={e => (e.currentTarget.style.background = 'rgba(220,38,38,0.05)')}
                  onMouseLeave={e => (e.currentTarget.style.background = '')}
                >Sign out</button>
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
  const used = user.credits_total - user.credits_remaining;
  const pct = user.credits_total > 0 ? Math.min(100, Math.round((used / user.credits_total) * 100)) : 0;
  const isLow = user.credits_remaining <= 10;
  const barColor = isLow ? "#DC2626" : user.plan === "free" ? "#6B7280" : "#4633E0";

  return (
    <div className="rounded-xl p-5" style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <div className="flex items-center justify-between">
        <p className="font-mono text-xs uppercase tracking-widest" style={{ color: '#6B7280' }}>Credits</p>
        {user.plan === "free" && (
          <Link href="/pricing" className="text-xs font-semibold transition-colors"
            style={{ color: '#4633E0', textDecoration: 'none', fontFamily: 'var(--font-geist)' }}>
            Upgrade →
          </Link>
        )}
      </div>
      <div className="mt-2 flex items-end gap-1">
        <span className="font-display text-5xl leading-none tracking-wide" style={{ color: isLow ? '#DC2626' : '#0A0A0A' }}>
          {user.credits_remaining}
        </span>
        <span className="mb-1.5 text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>
          / {user.credits_total.toLocaleString()} {user.plan === "free" ? "lifetime" : "this mo."}
        </span>
      </div>
      <div className="mt-3 h-1.5 w-full rounded-full" style={{ background: 'rgba(0,0,0,0.06)' }}>
        <div className="h-1.5 rounded-full transition-all duration-700" style={{ width: `${pct}%`, backgroundColor: barColor }} />
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, href, accentColor }: {
  label: string; value: string | number; sub?: string; href?: string; accentColor: string;
}) {
  return (
    <div className="rounded-xl p-5" style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
      <p className="font-mono text-xs uppercase tracking-widest" style={{ color: '#6B7280' }}>{label}</p>
      <p className="mt-2 font-display text-4xl leading-none tracking-wide" style={{ color: accentColor }}>{value}</p>
      {sub && <p className="mt-1 text-xs" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>{sub}</p>}
      {href && (
        <Link href={href} className="mt-3 inline-block text-xs font-semibold transition-opacity hover:opacity-70"
          style={{ color: accentColor, textDecoration: 'none', fontFamily: 'var(--font-geist)' }}>
          View →
        </Link>
      )}
    </div>
  );
}

// ─── Video row ────────────────────────────────────────────────────────────────

function VideoRow({ video }: { video: Video }) {
  const s = STATUS_CFG[video.status] ?? STATUS_CFG.pending;
  const platformLabel = video.platform ? video.platform.charAt(0).toUpperCase() + video.platform.slice(1) : null;

  return (
    <div className="flex items-center gap-4 rounded-xl p-4 transition-all"
      style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#FFFFFF', cursor: 'default' }}
      onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.15)')}
      onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(0,0,0,0.08)')}
    >
      <div className="relative flex h-12 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg"
        style={{ background: '#F5F2EE' }}>
        {video.thumbnail_url ? (
          <img src={video.thumbnail_url} alt="" className="h-full w-full object-cover" />
        ) : video.status === "processing" ? (
          <Spinner className="h-5 w-5" />
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="16" height="16" rx="3" stroke="rgba(0,0,0,0.15)" strokeWidth="1.2" />
            <path d="M7 6l5 3-5 3V6Z" fill="rgba(0,0,0,0.20)" />
          </svg>
        )}
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium" style={{ color: '#0A0A0A', fontFamily: 'var(--font-geist)' }}>{video.title || "Untitled video"}</p>
        <div className="mt-0.5 flex items-center gap-2">
          <p className="text-xs" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>{timeAgo(video.created_at)}</p>
          {platformLabel && (
            <span className="rounded px-1.5 py-0.5 font-mono text-[9px] uppercase"
              style={{ background: 'rgba(0,0,0,0.05)', color: '#6B7280' }}>
              {platformLabel}
            </span>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {video.video_url && video.status === "done" && (
          <a href={video.video_url} target="_blank" rel="noreferrer"
            className="rounded-lg px-3 py-1.5 text-xs transition-colors"
            style={{ border: '1px solid rgba(0,0,0,0.10)', color: '#6B7280', textDecoration: 'none', fontFamily: 'var(--font-geist)' }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.20)'; (e.currentTarget as HTMLElement).style.color = '#0A0A0A'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,0,0,0.10)'; (e.currentTarget as HTMLElement).style.color = '#6B7280'; }}
          >Download</a>
        )}
        <span className="rounded-full px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider"
          style={{ color: s.color, backgroundColor: s.bg }}>
          {s.label}
        </span>
      </div>
    </div>
  );
}

// ─── Activity log ─────────────────────────────────────────────────────────────

function ActivityLog({ items }: { items: ActivityItem[] }) {
  if (items.length === 0) {
    return (
      <div className="rounded-xl px-6 py-10 text-center"
        style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#FFFFFF' }}>
        <p className="text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>No activity yet.</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl" style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#FFFFFF' }}>
      {items.map((item) => {
        const meta = activityMeta(item.action);
        const detail = item.metadata?.title ? String(item.metadata.title)
          : item.metadata?.plan ? `→ ${String(item.metadata.plan)}`
          : item.metadata?.credits ? `${String(item.metadata.credits)} credits`
          : null;
        return (
          <div key={item.id} className="flex items-start gap-3 px-4 py-3"
            style={{ borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
            <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
              style={{ color: meta.color, backgroundColor: `${meta.color}18`, border: '1px solid rgba(0,0,0,0.06)' }}>
              {meta.icon}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm" style={{ color: '#0A0A0A', fontFamily: 'var(--font-geist)' }}>{meta.label}</p>
              {detail && <p className="mt-0.5 truncate text-xs" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>{detail}</p>}
            </div>
            <span className="shrink-0 font-mono text-xs" style={{ color: '#9CA3AF' }}>{timeAgo(item.created_at)}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Upgrade banner ───────────────────────────────────────────────────────────

function UpgradeBanner({ credits }: { credits: number }) {
  return (
    <div className="flex flex-col gap-3 rounded-xl px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
      style={{ border: '1px solid rgba(217,119,6,0.25)', background: 'rgba(217,119,6,0.05)' }}>
      <div className="flex items-start gap-3">
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="mt-0.5 shrink-0">
          <path d="M9 2L1 16h16L9 2Z" stroke="#D97706" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M9 7v4M9 13h.01" stroke="#D97706" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <div>
          <p className="text-sm font-semibold" style={{ color: '#D97706', fontFamily: 'var(--font-geist)' }}>Running low — {credits} credits left</p>
          <p className="mt-0.5 text-xs" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>Upgrade to keep creating without interruption.</p>
        </div>
      </div>
      <Link href="/pricing"
        className="shrink-0 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
        style={{ border: '1px solid rgba(217,119,6,0.35)', color: '#D97706', textDecoration: 'none', fontFamily: 'var(--font-geist)' }}
        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(217,119,6,0.08)')}
        onMouseLeave={e => (e.currentTarget.style.background = '')}
      >View Plans →</Link>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<DashData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchDashboard = useCallback(async () => {
    try {
      const res = await fetch("/api/dashboard");
      if (res.status === 401) { router.push("/auth"); return; }
      if (!res.ok) throw new Error("Failed to load dashboard");
      const json = await res.json();
      setData(json);
    } catch {
      setError("Could not load dashboard data. Please refresh.");
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/auth"); return; }
    if (status === "authenticated") fetchDashboard();
  }, [status, fetchDashboard, router]);

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center" style={{ background: '#F5F2EE' }}>
        <Spinner />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4" style={{ background: '#F5F2EE' }}>
        <p className="text-sm" style={{ color: '#DC2626', fontFamily: 'var(--font-geist)' }}>{error || "Something went wrong."}</p>
        <button onClick={fetchDashboard} className="btn-violet rounded-xl px-6 py-2.5 text-sm font-semibold">
          Retry
        </button>
      </div>
    );
  }

  const { user, videos, activity } = data;
  const planCfg = PLAN_CONFIG[user.plan] ?? PLAN_CONFIG.free;
  const showUpgrade = user.plan === "free" && user.credits_remaining <= 10;
  const hours = new Date().getHours();
  const greeting = hours < 12 ? "MORNING" : hours < 18 ? "AFTERNOON" : "EVENING";
  const firstName = user.name.split(" ")[0].toUpperCase();

  return (
    <div className="min-h-screen" style={{ background: '#F5F2EE', color: '#0A0A0A' }}>
      <DashNav user={user} />

      <main className="mx-auto max-w-7xl px-5 py-10">

        {/* Header */}
        <div className="mb-8 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h1 className="font-display text-4xl tracking-wider" style={{ color: '#0A0A0A' }}>
              GOOD {greeting},{" "}
              <span className="gradient-text">{firstName}</span>
            </h1>
            <p className="mt-1 text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>{user.email}</p>
          </div>
          <Link href="/create"
            className="btn-violet mt-4 flex w-fit items-center gap-2 rounded-xl px-6 py-3 font-semibold sm:mt-0"
            style={{ textDecoration: 'none' }}>
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Create Video
          </Link>
        </div>

        {showUpgrade && (
          <div className="mb-6">
            <UpgradeBanner credits={user.credits_remaining} />
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-3">

          <div className="flex flex-col gap-6 lg:col-span-2">

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
              <div className="col-span-2 sm:col-span-1">
                <CreditsWidget user={user} />
              </div>
              <StatCard label="Videos Created" value={videos.length} sub="Recent jobs" href="/history" accentColor="#4633E0" />
              <StatCard label="Credits Used"   value={user.credits_used} sub={user.plan === "free" ? "Lifetime" : "This month"} accentColor="#D97706" />
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-2xl tracking-wider" style={{ color: '#0A0A0A' }}>RECENT VIDEOS</h2>
                <Link href="/history" className="text-sm transition-colors"
                  style={{ color: '#6B7280', textDecoration: 'none', fontFamily: 'var(--font-geist)' }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#0A0A0A')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
                >View all →</Link>
              </div>

              {videos.length === 0 ? (
                <div className="rounded-xl px-6 py-14 text-center"
                  style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#FFFFFF' }}>
                  <p style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>No videos yet — create your first one!</p>
                  <Link href="/create" className="mt-3 inline-block text-sm font-semibold"
                    style={{ color: '#4633E0', textDecoration: 'none', fontFamily: 'var(--font-geist)' }}>
                    Create now →
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {videos.map(v => <VideoRow key={v.id} video={v} />)}
                </div>
              )}
            </div>

            <div>
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-display text-2xl tracking-wider" style={{ color: '#0A0A0A' }}>ACTIVITY LOG</h2>
                <span className="text-xs" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>{activity.length} recent events</span>
              </div>
              <ActivityLog items={activity} />
            </div>
          </div>

          <div className="flex flex-col gap-5">

            <div className="rounded-xl p-6" style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 className="font-display text-xl tracking-wider" style={{ color: '#0A0A0A' }}>QUICK CREATE</h3>
              <p className="mt-1.5 text-sm" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>
                Turn any topic into a video in minutes.
              </p>
              <Link href="/create"
                className="btn-violet mt-5 flex items-center justify-center gap-2 rounded-xl py-4 text-sm font-semibold"
                style={{ textDecoration: 'none' }}>
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                New Video
              </Link>
            </div>

            <div className="rounded-xl p-6" style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 className="font-display text-xl tracking-wider" style={{ color: '#0A0A0A' }}>YOUR PLAN</h3>
              <div className="mt-3">
                <span className="font-display text-3xl tracking-wider" style={{ color: planCfg.color }}>
                  {planCfg.label.toUpperCase()}
                </span>
              </div>
              <p className="mt-1 text-xs" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>{planCfg.credits}</p>

              {user.plan === "free" ? (
                <>
                  <div className="mt-3 flex flex-col gap-2">
                    {["No watermark", "1,080p exports", "AI Agent", "Auto-post"].map(feat => (
                      <div key={feat} className="flex items-center gap-2 text-xs" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                          <path d="M2 6l2.5 2.5L10 3.5" stroke="#9CA3AF" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="1.5 1" />
                        </svg>
                        {feat}
                      </div>
                    ))}
                  </div>
                  <Link href="/pricing"
                    className="mt-5 flex items-center justify-center rounded-xl py-3 text-sm font-semibold transition-colors"
                    style={{ border: '1px solid rgba(70,51,224,0.30)', color: '#4633E0', textDecoration: 'none', fontFamily: 'var(--font-geist)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'rgba(70,51,224,0.06)')}
                    onMouseLeave={e => (e.currentTarget.style.background = '')}
                  >Upgrade Plan</Link>
                </>
              ) : (
                <Link href="/billing"
                  className="mt-4 block text-center text-xs font-semibold transition-opacity hover:opacity-70"
                  style={{ color: planCfg.color, textDecoration: 'none', fontFamily: 'var(--font-geist)' }}>
                  Manage billing →
                </Link>
              )}
            </div>

            <div className="rounded-xl px-5 py-4" style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#FFFFFF' }}>
              <p className="font-mono text-xs uppercase tracking-widest" style={{ color: '#6B7280' }}>Member since</p>
              <p className="mt-1 text-sm" style={{ color: '#0A0A0A', fontFamily: 'var(--font-geist)' }}>
                {new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>

            <div className="rounded-xl p-5" style={{ border: '1px solid rgba(0,0,0,0.08)', background: '#FFFFFF' }}>
              <p className="text-sm font-semibold" style={{ color: '#0A0A0A', fontFamily: 'var(--font-geist)' }}>Need help?</p>
              <p className="mt-1 text-xs" style={{ color: '#6B7280', fontFamily: 'var(--font-geist)' }}>Our team is here to help you create.</p>
              <Link href="/contact"
                className="mt-3 block text-xs font-semibold transition-colors"
                style={{ color: '#0A7A70', textDecoration: 'none', fontFamily: 'var(--font-geist)' }}
                onMouseEnter={e => (e.currentTarget.style.opacity = '0.7')}
                onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              >Contact support →</Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
