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
  free:          { label: "Free",          color: "#888888", bg: "rgba(136,136,136,0.08)", border: "rgba(136,136,136,0.2)", credits: "50 lifetime"    },
  starter:       { label: "Starter",       color: "#22c55e", bg: "rgba(34,197,94,0.08)",  border: "rgba(34,197,94,0.2)",   credits: "500/mo"         },
  growth:        { label: "Growth",        color: "#8134af", bg: "rgba(129,52,175,0.08)", border: "rgba(129,52,175,0.2)",  credits: "1,000/mo"       },
  influencer:    { label: "Influencer",    color: "#f58529", bg: "rgba(245,133,41,0.08)", border: "rgba(245,133,41,0.2)",  credits: "2,000/mo"       },
  ultra:         { label: "Ultra",         color: "#dd2a7b", bg: "rgba(221,42,123,0.08)", border: "rgba(221,42,123,0.2)",  credits: "5,000/mo"       },
  character_pro: { label: "Character Pro", color: "#515bd4", bg: "rgba(81,91,212,0.08)",  border: "rgba(81,91,212,0.2)",   credits: "10,000/mo"      },
};

const STATUS_CFG: Record<VideoStatus, { label: string; color: string; bg: string }> = {
  pending:    { label: "Pending",    color: "#f58529", bg: "rgba(245,133,41,0.10)"   },
  processing: { label: "Processing", color: "#515bd4", bg: "rgba(81,91,212,0.10)"    },
  done:       { label: "Done",       color: "#22c55e", bg: "rgba(34,197,94,0.10)"    },
  failed:     { label: "Failed",     color: "#ef4444", bg: "rgba(239,68,68,0.10)"    },
};

// ─── Activity labels ──────────────────────────────────────────────────────────

function activityMeta(action: string): { label: string; color: string; icon: React.ReactNode } {
  const icons: Record<string, { label: string; color: string; icon: React.ReactNode }> = {
    "login":            { label: "Signed in",        color: "#22c55e", icon: <LoginIcon /> },
    "signup":           { label: "Account created",  color: "#22c55e", icon: <LoginIcon /> },
    "video.created":    { label: "Video created",    color: "#8134af", icon: <VideoIcon /> },
    "video.generating": { label: "Video generating", color: "#8134af", icon: <VideoIcon /> },
    "video.done":       { label: "Video ready",      color: "#22c55e", icon: <VideoIcon /> },
    "video.failed":     { label: "Video failed",     color: "#ef4444", icon: <VideoIcon /> },
    "credits.used":     { label: "Credits used",     color: "#f58529", icon: <CreditIcon /> },
    "credits.added":    { label: "Credits added",    color: "#22c55e", icon: <CreditIcon /> },
    "plan.upgraded":    { label: "Plan upgraded",    color: "#8134af", icon: <StarIcon />   },
    "plan.downgraded":  { label: "Plan downgraded",  color: "#888888", icon: <StarIcon />   },
    "otp.sent":         { label: "OTP code sent",    color: "#888888", icon: <MailIcon />   },
    "otp.verified":     { label: "OTP verified",     color: "#22c55e", icon: <MailIcon />   },
    "password.reset":   { label: "Password reset",   color: "#f58529", icon: <LockIcon />   },
  };
  return icons[action] ?? { label: action.replace(/[._]/g, " "), color: "#888888", icon: <DotIcon /> };
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

function Spinner({ size = 32 }: { size?: number }) {
  return (
    <svg style={{ width: size, height: size, animation: "spin 0.8s linear infinite" }} viewBox="0 0 24 24" fill="none">
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="var(--accent-purple)" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── Navbar ───────────────────────────────────────────────────────────────────

function DashNav({ user }: { user: DashUser }) {
  const [open, setOpen] = useState(false);
  const planCfg = PLAN_CONFIG[user.plan];
  const initials = user.name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 50,
        background: "rgba(10,10,10,0.92)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 56 }}>
        <Link href="/dashboard" style={{ fontSize: 18, fontWeight: 800, color: "var(--text)", textDecoration: "none", letterSpacing: -0.5 }}>
          MMFV<span className="ig-text">.</span>
        </Link>

        <div className="hidden sm:flex" style={{ alignItems: "center", gap: 4 }}>
          {[{ href: "/dashboard", label: "Dashboard" }, { href: "/create", label: "Create" }, { href: "/history", label: "History" }].map(l => (
            <Link
              key={l.href}
              href={l.href}
              style={{ padding: "6px 14px", fontSize: 13, color: "var(--text-secondary)", textDecoration: "none", borderRadius: 8, transition: "color 0.2s, background 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "var(--text)"; }}
              onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--text-secondary)"; }}
            >{l.label}</Link>
          ))}
        </div>

        <div style={{ position: "relative" }}>
          <button
            onClick={() => setOpen(o => !o)}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "6px 12px",
              border: "1px solid var(--border)",
              borderRadius: 10,
              background: "var(--bg-card)",
              cursor: "pointer",
            }}
          >
            {user.avatar_url ? (
              <img src={user.avatar_url} alt="" style={{ width: 24, height: 24, borderRadius: "50%", objectFit: "cover" }} />
            ) : (
              <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(129,52,175,0.2)", color: "var(--accent-purple)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, fontFamily: "monospace" }}>
                {initials}
              </div>
            )}
            <span className="hidden sm:block" style={{ fontSize: 10, fontFamily: "monospace", letterSpacing: 1, color: planCfg.color, background: planCfg.bg, border: `1px solid ${planCfg.border}`, padding: "2px 8px", borderRadius: 100 }}>
              {planCfg.label.toUpperCase()}
            </span>
            <svg width="10" height="10" viewBox="0 0 12 12" fill="none" style={{ color: "var(--text-muted)" }}>
              <path d="M2 4l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {open && (
            <>
              <div style={{ position: "fixed", inset: 0, zIndex: 10 }} onClick={() => setOpen(false)} />
              <div style={{ position: "absolute", right: 0, top: "100%", zIndex: 20, marginTop: 8, width: 200, background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
                <div style={{ padding: "12px 16px", borderBottom: "1px solid var(--border)" }}>
                  <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.name}</p>
                  <p style={{ fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                </div>
                {[{ href: "/settings", label: "Settings" }, { href: "/billing", label: "Billing" }].map(item => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setOpen(false)}
                    style={{ display: "block", padding: "10px 16px", fontSize: 13, color: "var(--text-secondary)", textDecoration: "none", transition: "background 0.15s, color 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.background = "rgba(255,255,255,0.04)"; e.currentTarget.style.color = "var(--text)"; }}
                    onMouseLeave={e => { e.currentTarget.style.background = ""; e.currentTarget.style.color = "var(--text-secondary)"; }}
                  >{item.label}</Link>
                ))}
                <div style={{ borderTop: "1px solid var(--border)" }} />
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  style={{ width: "100%", padding: "10px 16px", textAlign: "left", fontSize: 13, color: "var(--red)", background: "none", border: "none", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "rgba(239,68,68,0.06)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "")}
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

  return (
    <div className="card" style={{ padding: 20 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-muted)" }}>Credits</p>
        {user.plan === "free" && (
          <Link href="/pricing" style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-purple)", textDecoration: "none" }}>Upgrade →</Link>
        )}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 4, marginTop: 8 }}>
        <span style={{ fontSize: 48, fontWeight: 700, lineHeight: 1, letterSpacing: -2, color: isLow ? "var(--red)" : "var(--text)" }}>
          {user.credits_remaining}
        </span>
        <span style={{ fontSize: 13, color: "var(--text-muted)", marginBottom: 6 }}>
          / {user.credits_total.toLocaleString()} {user.plan === "free" ? "lifetime" : "this mo."}
        </span>
      </div>
      <div style={{ marginTop: 12, height: 4, background: "rgba(255,255,255,0.06)", borderRadius: 2 }}>
        <div style={{ height: 4, borderRadius: 2, width: `${pct}%`, background: isLow ? "var(--red)" : "var(--ig)", transition: "width 0.7s ease" }} />
      </div>
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, href, accentColor }: {
  label: string; value: string | number; sub?: string; href?: string; accentColor: string;
}) {
  return (
    <div className="card" style={{ padding: 20 }}>
      <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-muted)" }}>{label}</p>
      <p style={{ marginTop: 8, fontSize: 40, fontWeight: 700, lineHeight: 1, letterSpacing: -2, color: accentColor }}>{value}</p>
      {sub && <p style={{ marginTop: 4, fontSize: 12, color: "var(--text-muted)" }}>{sub}</p>}
      {href && (
        <Link href={href} style={{ display: "inline-block", marginTop: 12, fontSize: 12, fontWeight: 600, color: accentColor, textDecoration: "none", opacity: 0.8 }}>
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
    <div
      className="card"
      style={{ display: "flex", alignItems: "center", gap: 16, padding: "14px 16px" }}
    >
      <div style={{ position: "relative", width: 72, height: 48, flexShrink: 0, borderRadius: 8, overflow: "hidden", background: "rgba(255,255,255,0.04)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {video.thumbnail_url ? (
          <img src={video.thumbnail_url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
        ) : video.status === "processing" ? (
          <Spinner size={20} />
        ) : (
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <rect x="1" y="1" width="16" height="16" rx="3" stroke="rgba(255,255,255,0.15)" strokeWidth="1.2" />
            <path d="M7 6l5 3-5 3V6Z" fill="rgba(255,255,255,0.2)" />
          </svg>
        )}
      </div>

      <div style={{ minWidth: 0, flex: 1 }}>
        <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{video.title || "Untitled video"}</p>
        <div style={{ marginTop: 2, display: "flex", alignItems: "center", gap: 8 }}>
          <p style={{ fontSize: 12, color: "var(--text-muted)" }}>{timeAgo(video.created_at)}</p>
          {platformLabel && (
            <span style={{ background: "rgba(255,255,255,0.06)", color: "var(--text-muted)", padding: "1px 6px", borderRadius: 4, fontFamily: "monospace", fontSize: 9, textTransform: "uppercase" }}>
              {platformLabel}
            </span>
          )}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
        {video.video_url && video.status === "done" && (
          <a
            href={video.video_url}
            target="_blank"
            rel="noreferrer"
            style={{ padding: "5px 12px", fontSize: 12, color: "var(--text-secondary)", border: "1px solid var(--border)", borderRadius: 8, textDecoration: "none", transition: "border-color 0.2s, color 0.2s" }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text)"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
          >Download</a>
        )}
        <span style={{ padding: "3px 10px", borderRadius: 100, fontFamily: "monospace", fontSize: 9, textTransform: "uppercase", letterSpacing: 1, color: s.color, background: s.bg }}>
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
      <div className="card" style={{ padding: "40px 24px", textAlign: "center" }}>
        <p style={{ fontSize: 13, color: "var(--text-muted)" }}>No activity yet.</p>
      </div>
    );
  }

  return (
    <div className="card" style={{ overflow: "hidden" }}>
      {items.map((item, i) => {
        const meta = activityMeta(item.action);
        const detail = item.metadata?.title ? String(item.metadata.title)
          : item.metadata?.plan ? `→ ${String(item.metadata.plan)}`
          : item.metadata?.credits ? `${String(item.metadata.credits)} credits`
          : null;
        return (
          <div
            key={item.id}
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              padding: "12px 16px",
              borderBottom: i < items.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <div style={{ marginTop: 2, width: 24, height: 24, flexShrink: 0, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: meta.color, background: `${meta.color}15` }}>
              {meta.icon}
            </div>
            <div style={{ minWidth: 0, flex: 1 }}>
              <p style={{ fontSize: 13, color: "var(--text)" }}>{meta.label}</p>
              {detail && <p style={{ marginTop: 2, fontSize: 12, color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{detail}</p>}
            </div>
            <span style={{ flexShrink: 0, fontFamily: "monospace", fontSize: 11, color: "var(--text-muted)" }}>{timeAgo(item.created_at)}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Upgrade banner ───────────────────────────────────────────────────────────

function UpgradeBanner({ credits }: { credits: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12, padding: "16px 20px", border: "1px solid rgba(245,133,41,0.25)", background: "rgba(245,133,41,0.05)", borderRadius: 12 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" style={{ marginTop: 2, flexShrink: 0 }}>
          <path d="M9 2L1 16h16L9 2Z" stroke="#f58529" strokeWidth="1.4" strokeLinejoin="round" />
          <path d="M9 7v4M9 13h.01" stroke="#f58529" strokeWidth="1.4" strokeLinecap="round" />
        </svg>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#f58529" }}>Running low — {credits} credits left</p>
          <p style={{ marginTop: 2, fontSize: 12, color: "var(--text-muted)" }}>Upgrade to keep creating without interruption.</p>
        </div>
      </div>
      <Link
        href="/pricing"
        style={{ padding: "7px 16px", fontSize: 13, fontWeight: 600, border: "1px solid rgba(245,133,41,0.3)", borderRadius: 8, color: "#f58529", textDecoration: "none" }}
        onMouseEnter={e => (e.currentTarget.style.background = "rgba(245,133,41,0.08)")}
        onMouseLeave={e => (e.currentTarget.style.background = "")}
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
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Spinner size={36} />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16 }}>
        <p style={{ fontSize: 13, color: "var(--red)" }}>{error || "Something went wrong."}</p>
        <button onClick={fetchDashboard} className="btn-primary" style={{ padding: "10px 24px" }}>
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
    <div style={{ minHeight: "100vh", background: "var(--bg)", color: "var(--text)" }}>
      <DashNav user={user} />

      <main style={{ maxWidth: 1200, margin: "0 auto", padding: "40px 20px" }}>

        {/* Header */}
        <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 32 }}>
          <div>
            <h1 style={{ fontSize: "clamp(28px, 4vw, 40px)", fontWeight: 800, letterSpacing: -1.5, color: "var(--text)" }}>
              GOOD {greeting},{" "}
              <span className="ig-text">{firstName}</span>
            </h1>
            <p style={{ marginTop: 4, fontSize: 13, color: "var(--text-muted)" }}>{user.email}</p>
          </div>
          <Link href="/create" className="btn-primary" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "11px 20px" }}>
            <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
              <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            Create Video
          </Link>
        </div>

        {showUpgrade && (
          <div style={{ marginBottom: 24 }}>
            <UpgradeBanner credits={user.credits_remaining} />
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: 24 }} className="lg:grid-cols-[1fr_280px] grid-cols-1">

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
              <div style={{ gridColumn: "span 1" }}>
                <CreditsWidget user={user} />
              </div>
              <StatCard label="Videos Created" value={videos.length} sub="Recent jobs" href="/history" accentColor="var(--accent-purple)" />
              <StatCard label="Credits Used" value={user.credits_used} sub={user.plan === "free" ? "Lifetime" : "This month"} accentColor="var(--accent-orange)" />
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>Recent Videos</h2>
                <Link href="/history" style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.2s" }}
                  onMouseEnter={e => (e.currentTarget.style.color = "var(--text)")}
                  onMouseLeave={e => (e.currentTarget.style.color = "var(--text-muted)")}
                >View all →</Link>
              </div>

              {videos.length === 0 ? (
                <div className="card" style={{ padding: "48px 24px", textAlign: "center" }}>
                  <p style={{ color: "var(--text-muted)", fontSize: 14 }}>No videos yet — create your first one!</p>
                  <Link href="/create" style={{ display: "inline-block", marginTop: 12, fontSize: 13, fontWeight: 600, color: "var(--accent-purple)", textDecoration: "none" }}>
                    Create now →
                  </Link>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {videos.map(v => <VideoRow key={v.id} video={v} />)}
                </div>
              )}
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: -0.5 }}>Activity Log</h2>
                <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{activity.length} recent events</span>
              </div>
              <ActivityLog items={activity} />
            </div>
          </div>

          {/* Sidebar */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>Quick Create</h3>
              <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: 20 }}>
                Turn any topic into a video in minutes.
              </p>
              <Link href="/create" className="btn-primary" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, padding: "12px 20px", fontSize: 13 }}>
                <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                  <path d="M7 2v10M2 7h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
                New Video
              </Link>
            </div>

            <div className="card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 11, fontWeight: 600, marginBottom: 12, color: "var(--text-muted)", textTransform: "uppercase", fontFamily: "monospace", letterSpacing: 1 }}>Your Plan</h3>
              <span style={{ fontSize: 28, fontWeight: 700, letterSpacing: -1, color: planCfg.color }}>
                {planCfg.label.toUpperCase()}
              </span>
              <p style={{ marginTop: 4, fontSize: 12, color: "var(--text-muted)" }}>{planCfg.credits}</p>

              {user.plan === "free" ? (
                <>
                  <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                    {["No watermark", "1080p exports", "AI Agent", "Auto-post"].map(feat => (
                      <div key={feat} style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 12, color: "var(--text-muted)" }}>
                        <span style={{ color: "var(--text-muted)" }}>·</span>
                        {feat}
                      </div>
                    ))}
                  </div>
                  <Link
                    href="/pricing"
                    className="btn-ghost"
                    style={{ display: "flex", alignItems: "center", justifyContent: "center", marginTop: 16, padding: "10px 20px", fontSize: 13 }}
                  >
                    Upgrade Plan
                  </Link>
                </>
              ) : (
                <Link href="/billing" style={{ display: "inline-block", marginTop: 12, fontSize: 12, fontWeight: 600, color: planCfg.color, textDecoration: "none" }}>
                  Manage billing →
                </Link>
              )}
            </div>

            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontFamily: "monospace", fontSize: 10, letterSpacing: 2, textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 4 }}>Member since</p>
              <p style={{ fontSize: 13, color: "var(--text)" }}>
                {new Date(user.created_at).toLocaleDateString("en-US", { month: "long", year: "numeric" })}
              </p>
            </div>

            <div className="card" style={{ padding: 20 }}>
              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>Need help?</p>
              <p style={{ fontSize: 12, color: "var(--text-muted)", marginBottom: 12 }}>Our team is here to help you create.</p>
              <Link href="/contact" style={{ fontSize: 12, fontWeight: 600, color: "var(--accent-blue)", textDecoration: "none" }}>
                Contact support →
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
