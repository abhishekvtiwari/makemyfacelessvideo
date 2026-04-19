// src/app/page.tsx
import Link from "next/link";
import PricingSection from "@/components/PricingSection";

// ─── Icons ───────────────────────────────────────────────────────────────────

function YouTubeIcon() {
  return (
    <svg width="30" height="21" viewBox="0 0 32 22" fill="none">
      <path d="M31.4 3.43A4.01 4.01 0 0 0 28.57.6C26.08 0 16 0 16 0S5.92 0 3.43.6A4.01 4.01 0 0 0 .6 3.43C0 5.93 0 11 0 11s0 5.07.6 7.57A4.01 4.01 0 0 0 3.43 21.4C5.92 22 16 22 16 22s10.08 0 12.57-.6a4.01 4.01 0 0 0 2.83-2.83C32 16.07 32 11 32 11s0-5.07-.6-7.57ZM12.73 15.64V6.36L21.09 11l-8.36 4.64Z" fill="#FF0000" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="22" height="26" viewBox="0 0 24 28" fill="none">
      <path d="M17.5 0h-4.1v19.1a4.5 4.5 0 0 1-4.5 4.4 4.5 4.5 0 0 1-4.5-4.4 4.5 4.5 0 0 1 4.5-4.4c.44 0 .87.06 1.27.18V10.7a8.7 8.7 0 0 0-1.27-.09A8.9 8.9 0 0 0 0 19.5 8.9 8.9 0 0 0 8.9 28a8.9 8.9 0 0 0 8.9-8.9V9.4A13.5 13.5 0 0 0 24 11V6.9A8.5 8.5 0 0 1 17.5 0Z" fill="white" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 28 28" fill="none">
      <defs>
        <linearGradient id="ig-g" x1="0" y1="28" x2="28" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F9CE34" />
          <stop offset="0.35" stopColor="#EE2A7B" />
          <stop offset="1" stopColor="#6228D7" />
        </linearGradient>
      </defs>
      <rect width="28" height="28" rx="7" fill="url(#ig-g)" />
      <circle cx="14" cy="14" r="5.5" stroke="white" strokeWidth="2" fill="none" />
      <circle cx="20.5" cy="7.5" r="1.5" fill="white" />
    </svg>
  );
}

// ─── Shared spinner ───────────────────────────────────────────────────────────

function Spinner({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg className={`animate-spin text-[#ff2d55] ${className}`} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════════ */}
      <nav className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,15,0.9)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5">
          <Link href="/" className="font-display text-2xl tracking-wider text-[#e8e8f0]">
            MMFV<span className="gradient-text">.</span>
          </Link>
          <div className="flex items-center gap-3">
            <a href="#how-it-works" className="hidden font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0] sm:block">
              How it works
            </a>
            <a href="#pricing" className="hidden font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0] sm:block">
              Pricing
            </a>
            <Link href="/auth" className="hidden font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0] sm:block">
              Login
            </Link>
            <Link href="/auth" className="btn-red-glow rounded-xl px-5 py-2.5 font-body text-sm font-semibold">
              Start Free
            </Link>
          </div>
        </div>
      </nav>

      {/* ══ HERO ════════════════════════════════════════════════════════════════ */}
      <section className="grain relative overflow-hidden bg-[#0a0a0f] px-5 pb-20 pt-20 sm:pt-28">
        {/* Background glows */}
        <div aria-hidden className="pointer-events-none absolute left-1/2 top-0 h-[700px] w-[900px] -translate-x-1/2 rounded-full opacity-50"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,45,85,0.15) 0%, rgba(191,90,242,0.08) 40%, transparent 70%)" }} />

        <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-7 text-center">

          {/* Badge */}
          <div className="flex items-center gap-2 rounded-full border border-[rgba(191,90,242,0.3)] bg-[rgba(191,90,242,0.08)] px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-[#bf5af2] animate-pulse" />
            <span className="font-mono text-xs text-[#bf5af2] tracking-widest uppercase">AI Powered · Launch Special</span>
          </div>

          {/* Headline */}
          <h1 className="font-display text-[clamp(52px,10vw,110px)] leading-[0.92] tracking-wider">
            CREATE VIRAL{" "}
            <span className="gradient-text">FACELESS</span>
            <br />
            VIDEOS WITH AI
          </h1>

          {/* Subtext */}
          <p className="max-w-2xl font-body text-lg text-[#6b6b80] sm:text-xl leading-relaxed">
            Type any topic. Get a complete, ready-to-upload video — AI script, natural
            voiceover, cinematic B-roll, music, captions, thumbnail, and metadata.
            Done in minutes.
          </p>

          {/* CTAs */}
          <div className="flex flex-col items-center gap-3 sm:flex-row">
            <Link href="/auth" className="btn-red-glow rounded-xl px-8 py-4 font-body text-base font-semibold">
              Start Creating Free →
            </Link>
            <a href="#how-it-works" className="rounded-xl border border-[rgba(255,255,255,0.12)] px-8 py-4 font-body text-base font-semibold text-[#e8e8f0] transition-all hover:border-[rgba(255,255,255,0.3)] hover:bg-[rgba(255,255,255,0.04)]">
              See How It Works
            </a>
          </div>

          <p className="font-body text-xs text-[#6b6b80]">
            No credit card required &nbsp;·&nbsp; 50 free credits on signup &nbsp;·&nbsp; Cancel anytime
          </p>

          {/* Stats bar */}
          <div className="mt-2 flex flex-wrap items-center justify-center gap-8 border-t border-[rgba(255,255,255,0.06)] pt-8 w-full">
            {[
              { value: "5,000+", label: "Creators" },
              { value: "500K+", label: "Videos made" },
              { value: "4.9★", label: "Avg rating" },
              { value: "$258/yr", label: "Cheaper than rivals" },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-0.5">
                <span className="font-display text-2xl tracking-wider text-[#e8e8f0]">{s.value}</span>
                <span className="font-body text-xs text-[#6b6b80]">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PLATFORM LOGOS ═══════════════════════════════════════════════════════ */}
      <section className="border-y border-[rgba(255,255,255,0.06)] bg-[#111118] px-5 py-8">
        <div className="mx-auto max-w-7xl">
          <p className="mb-6 text-center font-mono text-xs text-[#6b6b80] uppercase tracking-widest">
            Publish directly to every platform
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
            {[
              { icon: <YouTubeIcon />, name: "YouTube" },
              { icon: <TikTokIcon />, name: "TikTok" },
              { icon: <InstagramIcon />, name: "Instagram Reels" },
            ].map((p) => (
              <div key={p.name} className="flex flex-col items-center gap-2 opacity-60 transition-opacity hover:opacity-100">
                {p.icon}
                <span className="font-body text-xs text-[#6b6b80]">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ HOW IT WORKS ═════════════════════════════════════════════════════════ */}
      <section id="how-it-works" className="px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#6b6b80]">The process</p>
            <h2 className="font-display text-5xl tracking-wider sm:text-6xl">
              THREE STEPS TO YOUR{" "}
              <span className="gradient-text">NEXT VIDEO</span>
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-3">
            {[
              {
                step: "01",
                title: "Enter Your Topic",
                desc: "Type anything — a news story, a product, a life lesson. Our AI understands context and audience.",
                color: "#ff2d55",
              },
              {
                step: "02",
                title: "AI Builds the Video",
                desc: "Script, voiceover, B-roll, music, captions, and thumbnail — generated automatically in minutes.",
                color: "#bf5af2",
              },
              {
                step: "03",
                title: "Download & Publish",
                desc: "Export at 1080p with all formats. Auto-post to YouTube, TikTok, and Instagram in one click.",
                color: "#ff6b35",
              },
            ].map((item) => (
              <div key={item.step} className="relative rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-8">
                <span className="font-display text-7xl tracking-wider opacity-10" style={{ color: item.color }}>
                  {item.step}
                </span>
                <div className="mt-4">
                  <h3 className="font-display text-2xl tracking-wider text-[#e8e8f0]">{item.title}</h3>
                  <p className="mt-3 font-body text-sm text-[#6b6b80] leading-relaxed">{item.desc}</p>
                </div>
                <div className="absolute right-6 top-6 h-2 w-2 rounded-full" style={{ backgroundColor: item.color }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FEATURES ════════════════════════════════════════════════════════════ */}
      <section className="bg-[#111118] px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <p className="mb-3 font-mono text-xs uppercase tracking-widest text-[#6b6b80]">What you get</p>
            <h2 className="font-display text-5xl tracking-wider sm:text-6xl">
              EVERYTHING TO{" "}
              <span className="gradient-text">GO VIRAL</span>
            </h2>
            <p className="mt-4 font-body text-[#6b6b80]">
              One topic. One click. A complete, upload-ready video.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: "📝",
                title: "AI Script Writer",
                desc: "Hook → narrative arc → CTA. Structured for maximum retention, optimised per platform.",
                badge: "AI Powered",
                accent: "#ff2d55",
              },
              {
                icon: "🎙️",
                title: "Natural AI Voiceover",
                desc: "Dozens of ElevenLabs voices. Pacing, emphasis, and emotion handled automatically.",
                badge: null,
                accent: "#bf5af2",
              },
              {
                icon: "🎬",
                title: "Cinematic B-Roll",
                desc: "Pexels stock matched scene-by-scene to your script. No camera or editing needed.",
                badge: null,
                accent: "#ff6b35",
              },
              {
                icon: "🎵",
                title: "Background Music",
                desc: "Mood-matched music that auto-ducks under speech. Professional sound every time.",
                badge: null,
                accent: "#30d158",
              },
              {
                icon: "💬",
                title: "Cinematic Captions",
                desc: "Auto-generated word-by-word captions styled for maximum engagement and retention.",
                badge: "New",
                accent: "#ff9f0a",
              },
              {
                icon: "🤖",
                title: "AI Agent (Growth+)",
                desc: "Researches trending topics, generates batches, and auto-posts on your schedule.",
                badge: "Growth+",
                accent: "#bf5af2",
              },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#0a0a0f] p-7 transition-all duration-200 hover:border-[rgba(255,255,255,0.15)] hover:bg-[#0d0d14]">
                <div className="flex items-start justify-between">
                  <span className="text-3xl">{f.icon}</span>
                  {f.badge && (
                    <span className="rounded-full border border-[rgba(191,90,242,0.3)] bg-[rgba(191,90,242,0.1)] px-2.5 py-0.5 font-mono text-[10px] text-[#bf5af2] uppercase tracking-wider">
                      {f.badge}
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-xl tracking-wider text-[#e8e8f0]">{f.title}</h3>
                <p className="mt-2 font-body text-sm text-[#6b6b80] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ PRICING ═════════════════════════════════════════════════════════════ */}
      <PricingSection />

      {/* ══ FINAL CTA ════════════════════════════════════════════════════════════ */}
      <section className="grain relative overflow-hidden px-5 py-24">
        <div aria-hidden className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse at 50% 50%, rgba(255,45,85,0.1) 0%, rgba(191,90,242,0.05) 40%, transparent 70%)" }} />
        <div className="relative z-10 mx-auto max-w-2xl text-center">
          <h2 className="font-display text-5xl tracking-wider sm:text-6xl">
            START CREATING TODAY
          </h2>
          <p className="mt-4 font-body text-[#6b6b80]">
            Join 5,000+ creators. 50 free credits, no card required.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/auth" className="btn-red-glow rounded-xl px-10 py-4 font-body text-base font-semibold">
              Create Your First Video Free
            </Link>
            <a href="#pricing" className="font-body text-sm text-[#6b6b80] underline underline-offset-4 transition-colors hover:text-[#e8e8f0]">
              View all plans
            </a>
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══════════════════════════════════════════════════════════════ */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#0a0a0f] px-5 py-14">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-10 sm:flex-row sm:justify-between">
            {/* Brand */}
            <div className="flex flex-col gap-3 sm:max-w-xs">
              <Link href="/" className="font-display text-2xl tracking-wider">
                MMFV<span className="gradient-text">.</span>
              </Link>
              <p className="font-body text-sm text-[#6b6b80] leading-relaxed">
                AI-powered faceless video creation. Script, voice, visuals, music — fully automated.
              </p>
              <p className="font-body text-xs text-[#6b6b80]">Payments via Stripe · USD only</p>
            </div>

            {/* Links */}
            <div className="grid grid-cols-2 gap-x-16 gap-y-3 sm:flex sm:gap-16">
              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs uppercase tracking-widest text-[#6b6b80]">Product</p>
                <a href="#how-it-works" className="font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0]">How it works</a>
                <a href="#pricing" className="font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0]">Pricing</a>
                <Link href="/auth" className="font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0]">Sign up</Link>
              </div>
              <div className="flex flex-col gap-3">
                <p className="font-mono text-xs uppercase tracking-widest text-[#6b6b80]">Legal</p>
                <Link href="/privacy" className="font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0]">Privacy</Link>
                <Link href="/terms" className="font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0]">Terms</Link>
                <Link href="/contact" className="font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0]">Contact</Link>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-2 border-t border-[rgba(255,255,255,0.06)] pt-8 sm:flex-row sm:justify-between">
            <p className="font-body text-xs text-[#6b6b80]">© 2026 MakeMyFacelessVideo.com</p>
            <p className="font-body text-xs text-[#6b6b80]">Made for creators, by creators.</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
