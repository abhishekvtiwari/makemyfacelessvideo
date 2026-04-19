// app/page.tsx
import EmailForm from "@/components/EmailForm";
import PricingSection from "@/components/PricingSection";

// ─── Icon components ────────────────────────────────────────────────────────

function YouTubeIcon() {
  return (
    <svg width="32" height="22" viewBox="0 0 32 22" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M31.4 3.43A4.01 4.01 0 0 0 28.57.6C26.08 0 16 0 16 0S5.92 0 3.43.6A4.01 4.01 0 0 0 .6 3.43C0 5.93 0 11 0 11s0 5.07.6 7.57A4.01 4.01 0 0 0 3.43 21.4C5.92 22 16 22 16 22s10.08 0 12.57-.6a4.01 4.01 0 0 0 2.83-2.83C32 16.07 32 11 32 11s0-5.07-.6-7.57ZM12.73 15.64V6.36L21.09 11l-8.36 4.64Z" fill="#FF0000" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="24" height="28" viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.5 0h-4.1v19.1a4.5 4.5 0 0 1-4.5 4.4 4.5 4.5 0 0 1-4.5-4.4 4.5 4.5 0 0 1 4.5-4.4c.44 0 .87.06 1.27.18V10.7a8.7 8.7 0 0 0-1.27-.09A8.9 8.9 0 0 0 0 19.5 8.9 8.9 0 0 0 8.9 28a8.9 8.9 0 0 0 8.9-8.9V9.4A13.5 13.5 0 0 0 24 11V6.9A8.5 8.5 0 0 1 17.5 0Z" fill="white" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="ig-grad" x1="0" y1="28" x2="28" y2="0" gradientUnits="userSpaceOnUse">
          <stop stopColor="#F9CE34" />
          <stop offset="0.35" stopColor="#EE2A7B" />
          <stop offset="1" stopColor="#6228D7" />
        </linearGradient>
      </defs>
      <rect width="28" height="28" rx="7" fill="url(#ig-grad)" />
      <circle cx="14" cy="14" r="5.5" stroke="white" strokeWidth="2" fill="none" />
      <circle cx="20.5" cy="7.5" r="1.5" fill="white" />
    </svg>
  );
}

function ScriptIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="4" y="3" width="16" height="20" rx="3" stroke="#FF2D55" strokeWidth="2" fill="none" />
      <path d="M8 9h8M8 13h8M8 17h5" stroke="#FF2D55" strokeWidth="1.5" strokeLinecap="round" />
      <circle cx="21" cy="21" r="4" fill="#BF5AF2" />
      <path d="M19.5 21h3M21 19.5v3" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function VoiceIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="10" y="3" width="8" height="14" rx="4" stroke="#BF5AF2" strokeWidth="2" fill="none" />
      <path d="M5 15a9 9 0 0 0 18 0" stroke="#BF5AF2" strokeWidth="2" strokeLinecap="round" fill="none" />
      <line x1="14" y1="24" x2="14" y2="27" stroke="#BF5AF2" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function VisualIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
      <rect x="2" y="5" width="24" height="16" rx="3" stroke="#FF6B35" strokeWidth="2" fill="none" />
      <polygon points="12,10 12,17 19,13.5" fill="#FF6B35" />
    </svg>
  );
}

// ─── Feature card ────────────────────────────────────────────────────────────

function FeatureCard({
  icon,
  title,
  description,
  badge,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  badge?: string;
}) {
  return (
    <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-7 flex flex-col gap-4 transition-all duration-200 hover:border-[rgba(255,45,85,0.3)] hover:bg-[#141420]">
      <div className="flex items-start justify-between">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#1a1a24]">
          {icon}
        </div>
        {badge && (
          <span className="rounded-full border border-[rgba(191,90,242,0.3)] bg-[rgba(191,90,242,0.1)] px-3 py-1 font-mono text-xs text-[#bf5af2]">
            {badge}
          </span>
        )}
      </div>
      <h3 className="font-body text-xl font-semibold text-[#e8e8f0]">{title}</h3>
      <p className="font-body text-[#6b6b80] leading-relaxed">{description}</p>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function HomePage() {
  const features = [
    {
      icon: <ScriptIcon />,
      title: "AI Script Writer",
      description:
        "AI generates a fully structured video script optimised for retention — hooks, story beats, and a strong CTA baked in.",
      badge: "AI Powered",
    },
    {
      icon: <VoiceIcon />,
      title: "Natural AI Voice",
      description:
        "Choose from dozens of ElevenLabs voices. Pacing, emphasis, and emotion are handled automatically.",
    },
    {
      icon: <VisualIcon />,
      title: "Cinematic Visuals",
      description:
        "Pexels B-roll clips matched scene-by-scene to your script. No green screen, no camera, no editing software needed.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-[#e8e8f0]">

      {/* ── Navbar ── */}
      <nav className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,15,0.85)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4">
          <span className="font-display text-2xl tracking-wider text-[#e8e8f0]">
            MMFV<span className="gradient-text">.</span>
          </span>
          <div className="flex items-center gap-4">
            <a href="#pricing" className="hidden font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0] sm:block">
              Pricing
            </a>
            <button className="btn-red-glow rounded-xl px-5 py-2.5 font-body text-sm font-semibold">
              Start Free
            </button>
          </div>
        </div>
      </nav>

      {/* ── Hero ── */}
      <section className="grain relative overflow-hidden bg-[#0a0a0f] px-5 pb-24 pt-24 sm:pt-32">
        {/* Radial glow behind headline */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 top-1/3 h-[600px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(255,45,85,0.12) 0%, rgba(191,90,242,0.06) 50%, transparent 70%)" }}
        />
        <div className="relative z-10 mx-auto flex max-w-4xl flex-col items-center gap-8 text-center">
          <span className="rounded-full border border-[rgba(191,90,242,0.3)] bg-[rgba(191,90,242,0.08)] px-4 py-2 font-mono text-xs text-[#bf5af2] tracking-widest uppercase">
            AI Powered
          </span>
          <h1 className="font-display text-6xl leading-none tracking-wider sm:text-8xl md:text-[108px]">
            CREATE VIRAL{" "}
            <span className="gradient-text">FACELESS</span>
            <br />
            VIDEOS WITH AI
          </h1>
          <p className="max-w-2xl font-body text-lg text-[#6b6b80] sm:text-xl leading-relaxed">
            Type a topic. Get a complete video — AI script, natural voiceover, cinematic
            B-roll, music, thumbnail, and metadata. Ready to upload in minutes.
          </p>
          <EmailForm />
          <p className="font-body text-xs text-[#6b6b80]">
            No credit card required &nbsp;·&nbsp; 3 free videos every month
          </p>
        </div>
      </section>

      {/* ── Platform logos ── */}
      <section className="border-y border-[rgba(255,255,255,0.06)] bg-[#111118] px-5 py-10">
        <div className="mx-auto max-w-7xl">
          <p className="mb-8 text-center font-body text-sm text-[#6b6b80] uppercase tracking-widest">
            Create for every platform
          </p>
          <div className="flex flex-wrap items-center justify-center gap-10 sm:gap-16">
            <div className="flex flex-col items-center gap-2.5 opacity-70 transition-opacity hover:opacity-100">
              <YouTubeIcon />
              <span className="font-body text-xs text-[#6b6b80]">YouTube</span>
            </div>
            <div className="flex flex-col items-center gap-2.5 opacity-70 transition-opacity hover:opacity-100">
              <TikTokIcon />
              <span className="font-body text-xs text-[#6b6b80]">TikTok</span>
            </div>
            <div className="flex flex-col items-center gap-2.5 opacity-70 transition-opacity hover:opacity-100">
              <InstagramIcon />
              <span className="font-body text-xs text-[#6b6b80]">Instagram</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section className="px-5 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 text-center">
            <h2 className="font-display text-5xl tracking-wider text-[#e8e8f0] sm:text-6xl">
              EVERYTHING YOU NEED TO{" "}
              <span className="gradient-text">GO VIRAL</span>
            </h2>
            <p className="mt-4 font-body text-[#6b6b80]">
              One topic. One click. A complete, ready-to-upload video.
            </p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((f) => (
              <FeatureCard key={f.title} {...f} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <PricingSection />

      {/* ── Footer ── */}
      <footer className="border-t border-[rgba(255,255,255,0.06)] bg-[#0a0a0f] px-5 py-14">
        <div className="mx-auto max-w-7xl flex flex-col items-center gap-8 sm:flex-row sm:justify-between">
          <div className="flex flex-col items-center gap-2 sm:items-start">
            <span className="font-display text-2xl tracking-wider text-[#e8e8f0]">
              MAKE MY FACELESS VIDEO<span className="gradient-text">.</span>
            </span>
            <p className="font-body text-sm text-[#6b6b80]">
              AI-powered faceless video creation for creators.
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-6 font-body text-sm text-[#6b6b80]">
            <a href="#" className="transition-colors hover:text-[#e8e8f0]">Privacy</a>
            <a href="#" className="transition-colors hover:text-[#e8e8f0]">Terms</a>
            <a href="#" className="transition-colors hover:text-[#e8e8f0]">Contact</a>
            <a href="#pricing" className="transition-colors hover:text-[#e8e8f0]">Pricing</a>
          </div>
        </div>
        <p className="mt-10 text-center font-body text-xs text-[#6b6b80]">
          © 2026 MakeMyFacelessVideo.com · AI-Powered Video Creation
        </p>
      </footer>

    </div>
  );
}
