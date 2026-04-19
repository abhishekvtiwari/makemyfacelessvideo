// src/app/create/page.tsx
"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type Platform = "youtube" | "tiktok" | "instagram";
type Duration = "short" | "medium" | "long";
type Style = "educational" | "entertaining" | "inspirational";
type Language = "en" | "hi";
type VisualType = "stock" | "upload" | "gameplay" | "web_images" | "ai_gen";
type VoiceMode = "narration" | "dialogue";

interface VideoInput {
  topic: string;
  platform: Platform;
  duration: Duration;
  style: Style;
  language: Language;
  voice_speed: number;
  mode: VoiceMode;
  visual_type: VisualType;
}

// ─── Option maps ──────────────────────────────────────────────────────────────

const PLATFORMS: { id: Platform; label: string; icon: string; aspect: string; dur: string }[] = [
  { id: "youtube",   label: "YouTube",   icon: "YT", aspect: "16:9", dur: "3-15 min" },
  { id: "tiktok",    label: "TikTok",    icon: "TK", aspect: "9:16", dur: "30-90 sec" },
  { id: "instagram", label: "Instagram", icon: "IG", aspect: "9:16", dur: "15-60 sec" },
];

const DURATIONS: { id: Duration; label: string; desc: string }[] = [
  { id: "short",  label: "Short",  desc: "Quick hit — max engagement" },
  { id: "medium", label: "Medium", desc: "Balanced depth & retention" },
  { id: "long",   label: "Long",   desc: "Deep dive — higher watch time" },
];

const STYLES: { id: Style; label: string; emoji: string; desc: string }[] = [
  { id: "educational",   label: "Educational",   emoji: "🎓", desc: "Teach and inform" },
  { id: "entertaining",  label: "Entertaining",  emoji: "🎭", desc: "Engage and entertain" },
  { id: "inspirational", label: "Inspirational", emoji: "⚡", desc: "Motivate and inspire" },
];

const VISUAL_TYPES: { id: VisualType; label: string; badge?: string; desc: string }[] = [
  { id: "stock",      label: "Stock Footage",   desc: "Pexels library — best quality" },
  { id: "web_images", label: "Web Images",      desc: "Ken Burns effect on web images" },
  { id: "gameplay",   label: "Gameplay",        desc: "Gaming visuals — viral style" },
  { id: "ai_gen",     label: "AI Generated",    badge: "AI", desc: "Unique visuals, no license" },
  { id: "upload",     label: "My Footage",      desc: "Upload your own video clips" },
];

const TOPIC_IDEAS = [
  "10 Psychology tricks that actually work",
  "Why most people never get rich — the brutal truth",
  "The dark side of TikTok's algorithm",
  "How to build a $10K/month faceless YouTube channel",
  "5 ancient civilizations that vanished overnight",
  "The real reason why you can't focus anymore",
];

// ─── Spinner ──────────────────────────────────────────────────────────────────

function Spinner() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
      <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

// ─── Section wrapper ──────────────────────────────────────────────────────────

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-6 sm:p-8">
      <div className="mb-5 flex items-center gap-3">
        <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[rgba(255,45,85,0.15)] font-mono text-xs font-bold text-[#ff2d55]">
          {number}
        </span>
        <h2 className="font-display text-lg tracking-wider text-[#e8e8f0]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function CreatePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [form, setForm] = useState<VideoInput>({
    topic: "",
    platform: "youtube",
    duration: "medium",
    style: "educational",
    language: "en",
    voice_speed: 1.0,
    mode: "narration",
    visual_type: "stock",
  });
  const [charCount, setCharCount] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0a0a0f]">
        <svg className="h-8 w-8 animate-spin text-[#ff2d55]" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.3" />
          <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      </div>
    );
  }

  if (status === "unauthenticated") {
    router.push("/auth");
    return null;
  }

  function setField<K extends keyof VideoInput>(key: K, value: VideoInput[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (error) setError("");
  }

  function handleTopicChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const v = e.target.value;
    if (v.length > 300) return;
    setField("topic", v);
    setCharCount(v.length);
  }

  async function handleGenerate() {
    if (form.topic.trim().length < 10) {
      setError("Topic must be at least 10 characters.");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      // TODO: POST to /api/video/generate and redirect to blueprint preview
      await new Promise((r) => setTimeout(r, 1500)); // placeholder
      router.push("/dashboard");
    } catch {
      setError("Generation failed. Please try again.");
    } finally {
      setGenerating(false);
    }
  }

  const canGenerate = form.topic.trim().length >= 10 && !generating;

  return (
    <div className="min-h-screen bg-[#0a0a0f]">

      {/* Nav */}
      <nav className="sticky top-0 z-50 border-b border-[rgba(255,255,255,0.06)] bg-[rgba(10,10,15,0.92)] backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <Link href="/dashboard" className="flex items-center gap-2 font-body text-sm text-[#6b6b80] transition-colors hover:text-[#e8e8f0]">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M10 3L5 8l5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Dashboard
          </Link>
          <Link href="/" className="font-display text-xl tracking-wider text-[#e8e8f0]">
            MMFV<span className="gradient-text">.</span>
          </Link>
          <div className="w-20" />
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-5 py-10">

        {/* Header */}
        <div className="mb-8">
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-[rgba(191,90,242,0.3)] bg-[rgba(191,90,242,0.08)] px-3 py-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[#bf5af2]" />
            <span className="font-mono text-xs tracking-widest text-[#bf5af2]">AI POWERED</span>
          </div>
          <h1 className="font-display text-4xl tracking-wider text-[#e8e8f0] sm:text-5xl">
            CREATE YOUR VIDEO
          </h1>
          <p className="mt-2 font-body text-sm text-[#6b6b80]">
            Fill in the details below — AI will handle the rest.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_320px]">

          {/* Left — form sections */}
          <div className="flex flex-col gap-5">

            {/* 1. Topic */}
            <Section number="1" title="WHAT'S YOUR VIDEO ABOUT?">
              <div className="relative">
                <textarea
                  value={form.topic}
                  onChange={handleTopicChange}
                  placeholder="e.g. The psychology behind why people procrastinate and how to beat it forever"
                  rows={4}
                  className="input-dark w-full resize-none rounded-xl px-4 py-3.5 font-body text-sm leading-relaxed focus:outline-none"
                />
                <span className="absolute bottom-3 right-3 font-mono text-xs text-[#6b6b80]">
                  {charCount}/300
                </span>
              </div>

              {/* Idea pills */}
              <div className="mt-3">
                <p className="mb-2 font-body text-xs text-[#6b6b80]">Need inspiration?</p>
                <div className="flex flex-wrap gap-2">
                  {TOPIC_IDEAS.map((idea) => (
                    <button
                      key={idea}
                      onClick={() => { setField("topic", idea); setCharCount(idea.length); }}
                      className="rounded-lg border border-[rgba(255,255,255,0.07)] bg-[#1a1a24] px-3 py-1.5 font-body text-xs text-[#6b6b80] transition-all hover:border-[rgba(255,255,255,0.15)] hover:text-[#e8e8f0]"
                    >
                      {idea}
                    </button>
                  ))}
                </div>
              </div>
            </Section>

            {/* 2. Platform */}
            <Section number="2" title="SELECT PLATFORM">
              <div className="grid grid-cols-3 gap-3">
                {PLATFORMS.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setField("platform", p.id)}
                    className={`flex flex-col items-center gap-2 rounded-xl border p-4 transition-all ${
                      form.platform === p.id
                        ? "border-[#ff2d55] bg-[rgba(255,45,85,0.08)]"
                        : "border-[rgba(255,255,255,0.07)] bg-[#1a1a24] hover:border-[rgba(255,255,255,0.15)]"
                    }`}
                  >
                    <span className={`font-mono text-xs font-bold ${form.platform === p.id ? "text-[#ff2d55]" : "text-[#6b6b80]"}`}>
                      {p.icon}
                    </span>
                    <span className="font-body text-sm font-medium text-[#e8e8f0]">{p.label}</span>
                    <span className="font-body text-xs text-[#6b6b80]">{p.aspect} · {p.dur}</span>
                  </button>
                ))}
              </div>
            </Section>

            {/* 3. Duration + Style */}
            <div className="grid gap-5 sm:grid-cols-2">

              <Section number="3" title="DURATION">
                <div className="flex flex-col gap-2">
                  {DURATIONS.map((d) => (
                    <button
                      key={d.id}
                      onClick={() => setField("duration", d.id)}
                      className={`flex items-center justify-between rounded-xl border px-4 py-3 transition-all ${
                        form.duration === d.id
                          ? "border-[#ff2d55] bg-[rgba(255,45,85,0.08)]"
                          : "border-[rgba(255,255,255,0.07)] bg-[#1a1a24] hover:border-[rgba(255,255,255,0.15)]"
                      }`}
                    >
                      <span className="font-body text-sm text-[#e8e8f0]">{d.label}</span>
                      <span className="font-body text-xs text-[#6b6b80]">{d.desc}</span>
                    </button>
                  ))}
                </div>
              </Section>

              <Section number="4" title="STYLE">
                <div className="flex flex-col gap-2">
                  {STYLES.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setField("style", s.id)}
                      className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-all ${
                        form.style === s.id
                          ? "border-[#ff2d55] bg-[rgba(255,45,85,0.08)]"
                          : "border-[rgba(255,255,255,0.07)] bg-[#1a1a24] hover:border-[rgba(255,255,255,0.15)]"
                      }`}
                    >
                      <span className="text-lg">{s.emoji}</span>
                      <div className="text-left">
                        <p className="font-body text-sm text-[#e8e8f0]">{s.label}</p>
                        <p className="font-body text-xs text-[#6b6b80]">{s.desc}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </Section>
            </div>

            {/* 5. Visuals */}
            <Section number="5" title="VISUAL SOURCE">
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                {VISUAL_TYPES.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setField("visual_type", v.id)}
                    className={`relative flex flex-col gap-1 rounded-xl border px-3 py-3 text-left transition-all ${
                      form.visual_type === v.id
                        ? "border-[#ff2d55] bg-[rgba(255,45,85,0.08)]"
                        : "border-[rgba(255,255,255,0.07)] bg-[#1a1a24] hover:border-[rgba(255,255,255,0.15)]"
                    }`}
                  >
                    {v.badge && (
                      <span className="absolute right-2 top-2 rounded bg-[rgba(191,90,242,0.2)] px-1.5 py-0.5 font-mono text-[10px] text-[#bf5af2]">
                        {v.badge}
                      </span>
                    )}
                    <span className="font-body text-sm font-medium text-[#e8e8f0]">{v.label}</span>
                    <span className="font-body text-xs text-[#6b6b80]">{v.desc}</span>
                  </button>
                ))}
              </div>
            </Section>

            {/* 6. Advanced options */}
            <Section number="6" title="VOICE & LANGUAGE">
              <div className="grid gap-4 sm:grid-cols-2">

                {/* Language */}
                <div>
                  <p className="mb-2 font-body text-xs font-medium text-[#6b6b80]">LANGUAGE</p>
                  <div className="flex gap-2">
                    {([["en", "English"], ["hi", "Hindi"]] as [Language, string][]).map(([id, label]) => (
                      <button
                        key={id}
                        onClick={() => setField("language", id)}
                        className={`flex-1 rounded-xl border py-2.5 font-body text-sm transition-all ${
                          form.language === id
                            ? "border-[#ff2d55] bg-[rgba(255,45,85,0.08)] text-[#e8e8f0]"
                            : "border-[rgba(255,255,255,0.07)] bg-[#1a1a24] text-[#6b6b80] hover:border-[rgba(255,255,255,0.15)]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Mode */}
                <div>
                  <p className="mb-2 font-body text-xs font-medium text-[#6b6b80]">VOICE MODE</p>
                  <div className="flex gap-2">
                    {([["narration", "Narration"], ["dialogue", "Dialogue"]] as [VoiceMode, string][]).map(([id, label]) => (
                      <button
                        key={id}
                        onClick={() => setField("mode", id)}
                        className={`flex-1 rounded-xl border py-2.5 font-body text-sm transition-all ${
                          form.mode === id
                            ? "border-[#ff2d55] bg-[rgba(255,45,85,0.08)] text-[#e8e8f0]"
                            : "border-[rgba(255,255,255,0.07)] bg-[#1a1a24] text-[#6b6b80] hover:border-[rgba(255,255,255,0.15)]"
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Speed */}
                <div className="sm:col-span-2">
                  <div className="mb-2 flex items-center justify-between">
                    <p className="font-body text-xs font-medium text-[#6b6b80]">VOICE SPEED</p>
                    <span className="font-mono text-xs text-[#e8e8f0]">{form.voice_speed.toFixed(1)}x</span>
                  </div>
                  <input
                    type="range"
                    min="0.8"
                    max="1.2"
                    step="0.1"
                    value={form.voice_speed}
                    onChange={(e) => setField("voice_speed", parseFloat(e.target.value))}
                    className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-[#1a1a24] accent-[#ff2d55]"
                  />
                  <div className="mt-1.5 flex justify-between font-body text-xs text-[#6b6b80]">
                    <span>Slow (0.8x)</span>
                    <span>Normal (1.0x)</span>
                    <span>Fast (1.2x)</span>
                  </div>
                </div>
              </div>
            </Section>

            {/* Error */}
            {error && (
              <div className="flex items-start gap-2.5 rounded-xl border border-[rgba(255,69,58,0.3)] bg-[rgba(255,69,58,0.08)] px-4 py-3">
                <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="mt-px shrink-0">
                  <circle cx="8" cy="8" r="7" stroke="#FF453A" strokeWidth="1.5" />
                  <path d="M8 5v3.5M8 11h.01" stroke="#FF453A" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
                <p className="font-body text-sm text-[#ff453a]">{error}</p>
              </div>
            )}

            {/* Generate button */}
            <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="btn-red-glow w-full rounded-2xl py-4 font-display text-xl tracking-wider disabled:opacity-50"
            >
              {generating ? (
                <span className="flex items-center justify-center gap-3">
                  <Spinner />
                  GENERATING YOUR VIDEO…
                </span>
              ) : (
                "GENERATE VIDEO — 1 CREDIT"
              )}
            </button>
          </div>

          {/* Right — summary card */}
          <div className="flex flex-col gap-4 lg:sticky lg:top-[73px] lg:self-start">

            {/* Summary */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-6">
              <h3 className="mb-4 font-display text-base tracking-wider text-[#e8e8f0]">SUMMARY</h3>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Platform", value: PLATFORMS.find((p) => p.id === form.platform)?.label ?? "—" },
                  { label: "Duration",  value: DURATIONS.find((d) => d.id === form.duration)?.label ?? "—" },
                  { label: "Style",     value: STYLES.find((s) => s.id === form.style)?.label ?? "—" },
                  { label: "Visuals",   value: VISUAL_TYPES.find((v) => v.id === form.visual_type)?.label ?? "—" },
                  { label: "Language",  value: form.language === "en" ? "English" : "Hindi" },
                  { label: "Mode",      value: form.mode === "narration" ? "Narration" : "Dialogue" },
                  { label: "Speed",     value: `${form.voice_speed.toFixed(1)}x` },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between">
                    <span className="font-body text-xs text-[#6b6b80]">{label}</span>
                    <span className="font-body text-sm text-[#e8e8f0]">{value}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 rounded-xl border border-[rgba(255,45,85,0.2)] bg-[rgba(255,45,85,0.05)] px-4 py-3 text-center">
                <p className="font-body text-xs text-[#6b6b80]">Cost</p>
                <p className="font-display text-2xl tracking-wider text-[#ff2d55]">1 CREDIT</p>
              </div>
            </div>

            {/* What you get */}
            <div className="rounded-2xl border border-[rgba(255,255,255,0.07)] bg-[#111118] p-6">
              <h3 className="mb-4 font-display text-base tracking-wider text-[#e8e8f0]">WHAT YOU GET</h3>
              <ul className="flex flex-col gap-2.5">
                {[
                  "AI script + hook + CTA",
                  "Voiceover (ElevenLabs)",
                  "Synced B-roll visuals",
                  "Background music",
                  "Cinematic captions",
                  "YouTube/TikTok metadata",
                  "Custom thumbnail prompt",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2.5">
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                      <path d="M2 7l3 3L12 3" stroke="#30d158" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <span className="font-body text-xs text-[#6b6b80]">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Est. time */}
            <div className="rounded-xl border border-[rgba(255,255,255,0.07)] bg-[#111118] px-4 py-3">
              <div className="flex items-center gap-2.5">
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className="shrink-0">
                  <circle cx="7" cy="7" r="6" stroke="#6b6b80" strokeWidth="1.2" />
                  <path d="M7 4v3.5l2 2" stroke="#6b6b80" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
                <span className="font-body text-xs text-[#6b6b80]">
                  Estimated generation time: <span className="text-[#e8e8f0]">60–120 seconds</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
