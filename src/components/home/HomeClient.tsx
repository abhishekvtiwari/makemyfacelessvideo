'use client'
// src/components/home/HomeClient.tsx
// All interactive/animated behaviour for the homepage
import { useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import { PLANS } from '@/lib/plans'

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false })

// ── Scroll-reveal hook ────────────────────────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal')
    const io  = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }),
      { threshold: 0.15 },
    )
    els.forEach(el => io.observe(el))
    return () => io.disconnect()
  }, [])
}

// ── Animated counter ─────────────────────────────────────────────────────────
function Counter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const [val, setVal] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      io.disconnect()
      let start = 0
      const step = to / 60
      const tick = () => {
        start = Math.min(start + step, to)
        setVal(Math.floor(start))
        if (start < to) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    io.observe(el)
    return () => io.disconnect()
  }, [to])
  return <span ref={ref}>{val.toLocaleString()}{suffix}</span>
}

// ── Cycling number in hero ────────────────────────────────────────────────────
function CyclingNumber() {
  const seq  = [5, 6, 7]
  const [i, setI] = useState(2)
  useEffect(() => {
    const id = setInterval(() => setI(n => (n + 1) % seq.length), 900)
    return () => clearInterval(id)
  }, [])
  return (
    <span className="violet-pulse" style={{ color: 'var(--violet)' }}>
      {seq[i]}
    </span>
  )
}

// ── Navbar ────────────────────────────────────────────────────────────────────
function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position:     'fixed',
        top:           0,
        left:          0,
        right:         0,
        zIndex:        50,
        padding:      '0 24px',
        height:        64,
        display:      'flex',
        alignItems:   'center',
        justifyContent: 'space-between',
        background:   scrolled ? 'var(--bg)' : 'transparent',
        borderBottom: scrolled ? '1px solid rgba(91,71,245,0.2)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(12px)' : 'none',
        transition:   'background 0.3s ease, border-color 0.3s ease, backdrop-filter 0.3s ease',
      }}
    >
      {/* Logo */}
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'var(--violet)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <polygon points="5,3 13,8 5,13" fill="white" />
          </svg>
        </div>
        <span style={{ fontFamily: 'var(--font-geist)', fontWeight: 600, fontSize: 15, color: 'var(--text)', letterSpacing: '-0.02em' }}>
          MakeMyFacelessVideo
        </span>
      </a>

      {/* Desktop links */}
      <div className="hidden md:flex" style={{ gap: 32 }}>
        {['Features', 'Pricing', 'How It Works'].map(link => (
          <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`}
            style={{ color: 'var(--muted)', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
          >{link}</a>
        ))}
      </div>

      {/* CTA */}
      <div className="hidden md:flex" style={{ gap: 10, alignItems: 'center' }}>
        <a href="/auth/login" className="btn-ghost" style={{ padding: '8px 18px', fontSize: 13 }}>Sign In</a>
        <a href="/auth/signup" className="btn-violet" style={{ padding: '8px 18px', fontSize: 13 }}>Start Free</a>
      </div>

      {/* Hamburger */}
      <button
        className="md:hidden"
        onClick={() => setOpen(o => !o)}
        aria-label="Menu"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8 }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          {open
            ? <><line x1="4" y1="4" x2="18" y2="18" stroke="var(--text)" strokeWidth="1.8" /><line x1="18" y1="4" x2="4" y2="18" stroke="var(--text)" strokeWidth="1.8" /></>
            : <><line x1="3" y1="6" x2="19" y2="6" stroke="var(--text)" strokeWidth="1.8" /><line x1="3" y1="11" x2="19" y2="11" stroke="var(--text)" strokeWidth="1.8" /><line x1="3" y1="16" x2="19" y2="16" stroke="var(--text)" strokeWidth="1.8" /></>
          }
        </svg>
      </button>

      {/* Mobile menu */}
      {open && (
        <div style={{
          position: 'absolute', top: 64, left: 0, right: 0,
          background: 'var(--surface)', borderBottom: '1px solid var(--border)',
          padding: '20px 24px', display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {['Features', 'Pricing', 'How It Works'].map(link => (
            <a key={link} href={`#${link.toLowerCase().replace(/ /g, '-')}`}
              onClick={() => setOpen(false)}
              style={{ color: 'var(--text)', fontSize: 15, textDecoration: 'none' }}
            >{link}</a>
          ))}
          <div style={{ display: 'flex', gap: 10, paddingTop: 8 }}>
            <a href="/auth/login"  className="btn-ghost"  style={{ flex: 1, textAlign: 'center', fontSize: 13 }}>Sign In</a>
            <a href="/auth/signup" className="btn-violet" style={{ flex: 1, textAlign: 'center', fontSize: 13 }}>Start Free</a>
          </div>
        </div>
      )}
    </nav>
  )
}

// ── Stats bar ─────────────────────────────────────────────────────────────────
function StatsBar() {
  const items = [
    { label: 'SCRIPT',  value: '2.1s' },
    { label: 'VOICE',   value: '4.3s' },
    { label: 'VISUALS', value: '18s'  },
    { label: 'TOTAL',   value: '< 25s' },
  ]
  return (
    <div className="reveal" style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderRadius: 12,
      padding: '16px 24px',
      display: 'flex',
      alignItems: 'center',
      gap: 24,
      flexWrap: 'wrap',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <span className="live-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
        <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: '#10B981', letterSpacing: '0.12em' }}>LIVE</span>
      </div>
      {items.map((item, i) => (
        <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          {i > 0 && <span style={{ color: 'var(--border)', fontSize: 18 }}>|</span>}
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
            <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: 'var(--muted)', letterSpacing: '0.12em' }}>{item.label}</span>
            <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 15, color: 'var(--text)', fontWeight: 700 }}>{item.value}</span>
          </div>
        </div>
      ))}
    </div>
  )
}

// ── Pricing section ───────────────────────────────────────────────────────────
function PricingSection() {
  const [currency, setCurrency] = useState<'INR' | 'USD'>('INR')
  const [yearly,   setYearly]   = useState(false)

  return (
    <section id="pricing" style={{ padding: '100px 24px', maxWidth: 1120, margin: '0 auto' }}>
      <p className="section-label reveal" style={{ marginBottom: 16 }}>/ 05 · PRICING</p>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16, marginBottom: 48 }}>
        <h2 className="font-display reveal" style={{ fontSize: 'clamp(40px, 5vw, 56px)', lineHeight: 1.05, color: 'var(--text)', fontWeight: 400 }}>
          Pay for videos.<br />Not subscriptions.
        </h2>
        {/* Toggles */}
        <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Currency */}
          <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9999, overflow: 'hidden' }}>
            {(['INR', 'USD'] as const).map(c => (
              <button key={c} onClick={() => setCurrency(c)} style={{
                padding: '7px 16px', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
                background: currency === c ? 'var(--violet)' : 'transparent',
                color: currency === c ? '#fff' : 'var(--muted)',
                transition: 'background 0.2s, color 0.2s',
              }}>{c}</button>
            ))}
          </div>
          {/* Billing period */}
          <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9999, overflow: 'hidden' }}>
            {[{ label: 'Monthly', v: false }, { label: 'Yearly', v: true }].map(({ label, v }) => (
              <button key={label} onClick={() => setYearly(v)} style={{
                padding: '7px 16px', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
                background: yearly === v ? 'var(--violet)' : 'transparent',
                color: yearly === v ? '#fff' : 'var(--muted)',
                transition: 'background 0.2s, color 0.2s',
              }}>{label}</button>
            ))}
          </div>
          {yearly && (
            <span style={{ fontSize: 12, color: '#10B981', background: 'rgba(16,185,129,0.12)', padding: '4px 10px', borderRadius: 9999 }}>
              Save 20%
            </span>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20 }}>
        {PLANS.map((plan, i) => {
          const price = currency === 'INR'
            ? (yearly ? plan.priceINRYearly : plan.priceINR)
            : (yearly ? plan.priceUSDYearly : plan.priceUSD)
          const symbol = currency === 'INR' ? '₹' : '$'
          const period = yearly ? '/yr' : '/mo'

          return (
            <div
              key={plan.id}
              className="reveal card"
              style={{
                transitionDelay: `${i * 100}ms`,
                padding: 28,
                position: 'relative',
                border: plan.highlighted
                  ? '1px solid rgba(91,71,245,0.6)'
                  : '1px solid var(--border)',
                boxShadow: plan.highlighted ? '0 0 40px rgba(91,71,245,0.15)' : undefined,
              }}
            >
              {plan.highlighted && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: 'var(--violet)', color: '#fff', fontSize: 11,
                  fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.12em',
                  padding: '4px 14px', borderRadius: 9999,
                }}>MOST POPULAR</div>
              )}
              <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.14em', marginBottom: 6 }}>{plan.name}</p>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>{plan.tagline}</p>
              <div style={{ marginBottom: 24 }}>
                <span style={{ fontFamily: 'var(--font-fraunces)', fontSize: 44, fontWeight: 400, color: 'var(--text)', lineHeight: 1 }}>{symbol}{price.toLocaleString()}</span>
                <span style={{ fontSize: 13, color: 'var(--muted)', marginLeft: 4 }}>{period}</span>
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map(f => (
                  <li key={f} style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 10 }}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="var(--teal)" strokeWidth="1.2" />
                      <polyline points="4,7 6,9 10,5" stroke="var(--teal)" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a href="/auth/signup" className={`btn-${plan.ctaVariant}`} style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                {plan.ctaLabel}
              </a>
            </div>
          )
        })}
      </div>
    </section>
  )
}

// ── Main export ───────────────────────────────────────────────────────────────
export default function HomeClient() {
  useReveal()

  return (
    <>
      <Navbar />

      {/* ── HERO ────────────────────────────────────────────── */}
      <section style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: '100px 24px 0', maxWidth: 1280, margin: '0 auto', position: 'relative' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}
          className="max-md:grid-cols-1"
        >
          {/* Left */}
          <div>
            <p className="section-label" style={{ marginBottom: 20 }}>/ 01 · AI VIDEO PLATFORM</p>
            <h1 className="font-display" style={{ fontSize: 'clamp(44px, 6vw, 72px)', lineHeight: 1.05, fontWeight: 400, color: 'var(--text)', marginBottom: 24 }}>
              Create a faceless video in{' '}
              <CyclingNumber /> minutes.
            </h1>
            <p style={{ fontSize: 18, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              Drop a topic. We write the script, cast the voice, source the visuals, and hand you a finished video. No camera. No editor. No excuses.
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/auth/signup" className="btn-violet" style={{ fontSize: 15 }}>Start Creating →</a>
              <a href="#how-it-works" className="btn-ghost" style={{ fontSize: 15 }}>See How It Works</a>
            </div>
          </div>

          {/* Right — 3D canvas */}
          <div style={{ height: 480, borderRadius: 16, overflow: 'hidden', position: 'relative' }}>
            <HeroCanvas />
            {/* Niche labels overlay */}
            {['Finance', 'Motivation', 'History', 'Tech', 'True Crime'].map((n, i) => {
              const angles = [0, 72, 144, 216, 288]
              const a = ((angles[i] - 90) * Math.PI) / 180
              const r = 38
              const cx = 50 + r * Math.cos(a)
              const cy = 50 + r * Math.sin(a)
              return (
                <div key={n} style={{
                  position: 'absolute',
                  left: `${cx}%`, top: `${cy}%`,
                  transform: 'translate(-50%, -50%)',
                  background: 'rgba(13,20,38,0.85)',
                  border: '1px solid rgba(91,71,245,0.45)',
                  borderRadius: 8,
                  padding: '6px 14px',
                  fontSize: 12,
                  fontFamily: 'var(--font-geist-mono)',
                  color: 'var(--text)',
                  letterSpacing: '0.08em',
                  pointerEvents: 'none',
                  backdropFilter: 'blur(6px)',
                }}>{n}</div>
              )
            })}
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ marginTop: 48, paddingBottom: 48 }}>
          <StatsBar />
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section id="features" style={{ padding: '100px 24px', maxWidth: 1120, margin: '0 auto' }}>
        <p className="section-label reveal" style={{ marginBottom: 16 }}>/ 02 · HOW IT WORKS</p>
        <h2 className="font-display reveal" style={{ fontSize: 'clamp(40px, 5vw, 56px)', lineHeight: 1.05, fontWeight: 400, color: 'var(--text)', marginBottom: 16 }}>
          Four steps.<br />One prompt.
        </h2>
        <p className="reveal" style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 520, marginBottom: 56, lineHeight: 1.7 }}>
          Every faceless video needs a hook, a voice, a visual loop, and a pace. We handle all four simultaneously.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {[
            { num: '01', title: 'Script Engine', icon: '✦', desc: 'Writes hook-led scripts tuned to your niche, tone, and duration. Paced for 30–600s.' },
            { num: '02', title: 'Voice Cast',    icon: '◈', desc: 'Studio-grade AI voices. Choose tone, speed, and emotion. Hindi + English supported.' },
            { num: '03', title: 'Visual Engine', icon: '▣', desc: 'Sources cinematic stock footage scene-by-scene from your script keywords. Auto-matched.' },
            { num: '04', title: 'Auto Render',   icon: '▶', desc: 'Assembles script + voice + visuals into a finished MP4. Download or publish same session.' },
          ].map((card, i) => (
            <div key={card.num} className="reveal card" style={{
              transitionDelay: `${i * 100}ms`,
              padding: 28,
              borderTop: '2px solid var(--violet)',
              position: 'relative',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <span style={{ fontSize: 22, color: 'var(--text)' }}>{card.icon}</span>
                <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 11, color: 'var(--teal)', letterSpacing: '0.12em' }}>MODULE {card.num}</span>
              </div>
              <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 22, fontWeight: 400, color: 'var(--text)', marginBottom: 12 }}>{card.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NICHES ──────────────────────────────────────────── */}
      <section style={{ padding: '80px 0', overflow: 'hidden' }}>
        <div style={{ padding: '0 24px', maxWidth: 1120, margin: '0 auto 48px' }}>
          <p className="section-label reveal" style={{ marginBottom: 16 }}>/ 03 · PRESET NICHES</p>
          <h2 className="font-display reveal" style={{ fontSize: 'clamp(40px, 5vw, 56px)', lineHeight: 1.05, fontWeight: 400, color: 'var(--text)' }}>
            Pick a niche.<br />We know the format.
          </h2>
        </div>

        {[
          { items: ['Motivational', 'Mind-Blowing Facts', 'Story Time', 'Finance', 'True Crime', 'History', 'Tech Explained', 'News Recap', 'Life Hacks', 'Psychology'], dir: 'left' },
          { items: ['Top 10 Lists', 'Book Summaries', 'Science Facts', 'Business Tips', 'Productivity', 'Health', 'Investing', 'World Records', 'Mysteries', 'Philosophy'], dir: 'right' },
        ].map((row, ri) => (
          <div key={ri} style={{ overflow: 'hidden', marginBottom: 14 }}>
            <div className={`ticker-${row.dir}`} style={{ display: 'flex', gap: 10, width: 'max-content', padding: '4px 0' }}>
              {[...row.items, ...row.items].map((item, i) => (
                <a key={i} href="#features" onClick={e => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) }}
                  style={{
                    display: 'inline-block',
                    padding: '9px 18px',
                    background: 'var(--surface)',
                    border: '1px solid rgba(91,71,245,0.35)',
                    borderRadius: 9999,
                    fontSize: 13,
                    color: 'var(--text)',
                    whiteSpace: 'nowrap',
                    textDecoration: 'none',
                    transition: 'background 0.2s, color 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--violet)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--text)' }}
                >{item}</a>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── WORKFLOW ─────────────────────────────────────────── */}
      <section id="how-it-works" style={{ padding: '100px 24px', maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}
          className="max-md:grid-cols-1"
        >
          <div>
            <p className="section-label reveal" style={{ marginBottom: 16 }}>/ 04 · WORKFLOW</p>
            <h2 className="font-display reveal" style={{ fontSize: 'clamp(40px, 5vw, 56px)', lineHeight: 1.05, fontWeight: 400, color: 'var(--text)', marginBottom: 20 }}>
              From blank<br />field to finished<br />video.
            </h2>
            <p className="reveal" style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7 }}>
              A four-step pipeline. Fully automated. Zero guesswork.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              { n: '01', title: 'Drop a Topic',         desc: 'Pick your niche, set a duration, write one sentence. That\'s your whole brief.' },
              { n: '02', title: 'Script Generated',     desc: 'We write a hook, body, and CTA. Paced to your exact duration. Editable before render.' },
              { n: '03', title: 'Voice + Visuals Cast', desc: 'Pick a voice. Visuals are sourced scene-by-scene in parallel. Renders in under 30 seconds.' },
              { n: '04', title: 'Download & Publish',   desc: 'Your finished MP4 with captions is ready. Export at 1080p. Publish same session.' },
            ].map((step, i) => (
              <div key={step.n} className="reveal" style={{
                transitionDelay: `${i * 120}ms`,
                display: 'flex', gap: 20,
                paddingBottom: i < 3 ? 32 : 0,
                position: 'relative',
              }}>
                {/* connecting line */}
                {i < 3 && (
                  <div style={{
                    position: 'absolute', left: 20, top: 28, bottom: 0, width: 1,
                    background: 'linear-gradient(to bottom, rgba(91,71,245,0.4), rgba(91,71,245,0.05))',
                  }} />
                )}
                <div style={{ flexShrink: 0, width: 40 }}>
                  <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, color: 'var(--teal)', fontWeight: 700 }}>{step.n}</span>
                </div>
                <div>
                  <h3 style={{ fontFamily: 'var(--font-fraunces)', fontSize: 20, fontWeight: 400, color: 'var(--text)', marginBottom: 8 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRICING ──────────────────────────────────────────── */}
      <PricingSection />

      {/* ── SOCIAL PROOF ─────────────────────────────────────── */}
      <section style={{ padding: '100px 24px', maxWidth: 1120, margin: '0 auto' }}>
        <p className="section-label reveal" style={{ marginBottom: 16 }}>/ 06 · CREATORS</p>
        <h2 className="font-display reveal" style={{ fontSize: 'clamp(36px, 4vw, 48px)', lineHeight: 1.08, fontWeight: 400, color: 'var(--text)', marginBottom: 56 }}>
          Built for creators<br />who ship daily.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 64 }}>
          {[
            { quote: 'I went from 0 to 30 videos published in my first month. The script quality is insane.', handle: '@financewithravi', subs: '48K subscribers' },
            { quote: 'Finally a tool that understands faceless YouTube. The niche templates save hours.', handle: '@techexplained_', subs: '91K subscribers' },
            { quote: 'Hindi voice quality is better than anything I\'ve tried. My retention went up 40%.', handle: '@gyaanwala', subs: '22K subscribers' },
          ].map((t, i) => (
            <div key={i} className="reveal card" style={{ transitionDelay: `${i * 100}ms`, padding: 28 }}>
              <div style={{ fontSize: 36, color: 'var(--violet)', lineHeight: 1, marginBottom: 16, fontFamily: 'Georgia, serif' }}>"</div>
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, marginBottom: 20 }}>{t.quote}</p>
              <div>
                <p style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{t.handle}</p>
                <p style={{ fontSize: 12, color: 'var(--muted)' }}>{t.subs}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="reveal" style={{ display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[
            { label: 'creators', value: 12400, suffix: '+' },
            { label: 'videos generated', value: 340000, suffix: '+' },
            { label: 'average rating', value: 4.8, suffix: '★' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p style={{ fontFamily: 'var(--font-fraunces)', fontSize: 40, fontWeight: 400, color: 'var(--text)', lineHeight: 1 }}>
                <Counter to={stat.value} suffix={stat.suffix} />
              </p>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section style={{
        margin: '0 24px 100px',
        borderRadius: 20,
        background: 'linear-gradient(135deg, #1a1040 0%, #060C1C 40%, #0a1a2e 100%)',
        border: '1px solid rgba(91,71,245,0.25)',
        padding: '80px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Glow orbs */}
        <div style={{ position: 'absolute', top: '30%', left: '20%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(91,71,245,0.08)', filter: 'blur(60px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '20%', right: '20%', width: 200, height: 200, borderRadius: '50%', background: 'rgba(13,148,136,0.06)', filter: 'blur(50px)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="font-display reveal" style={{ fontSize: 'clamp(48px, 7vw, 80px)', fontWeight: 400, color: '#fff', lineHeight: 1, marginBottom: 16 }}>
            Press start.
          </h2>
          <p className="reveal" style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 36 }}>
            Your first faceless video is 7 minutes away.
          </p>
          <a href="/auth/signup" className="reveal" style={{
            display: 'inline-block',
            background: '#fff',
            color: '#060C1C',
            borderRadius: 9999,
            padding: '16px 40px',
            fontSize: 16,
            fontWeight: 600,
            textDecoration: 'none',
            transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.03)'; e.currentTarget.style.boxShadow = '0 0 40px rgba(255,255,255,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            Start Creating Free →
          </a>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────── */}
      <footer style={{ borderTop: '1px solid var(--border)', padding: '60px 24px 32px', maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
              <div style={{ width: 28, height: 28, borderRadius: 7, background: 'var(--violet)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none"><polygon points="5,3 13,8 5,13" fill="white" /></svg>
              </div>
              <span style={{ fontWeight: 600, fontSize: 14 }}>MakeMyFacelessVideo</span>
            </div>
            <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.65 }}>AI-powered faceless video creation.</p>
          </div>
          <div>
            <p style={{ fontSize: 11, fontFamily: 'var(--font-geist-mono)', color: 'var(--muted)', letterSpacing: '0.12em', marginBottom: 16 }}>PRODUCT</p>
            {['Features', 'Pricing', 'How It Works', 'Dashboard'].map(l => (
              <a key={l} href={`#${l.toLowerCase().replace(/ /g, '-')}`} style={{ display: 'block', fontSize: 13, color: 'var(--muted)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
              >{l}</a>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 11, fontFamily: 'var(--font-geist-mono)', color: 'var(--muted)', letterSpacing: '0.12em', marginBottom: 16 }}>LEGAL</p>
            {['Privacy Policy', 'Terms & Conditions', 'Refund Policy'].map(l => (
              <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: 'var(--muted)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
              >{l}</a>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 11, fontFamily: 'var(--font-geist-mono)', color: 'var(--muted)', letterSpacing: '0.12em', marginBottom: 16 }}>CONTACT</p>
            <a href="mailto:hello@makemyfacelessvideo.com" style={{ display: 'block', fontSize: 13, color: 'var(--muted)', textDecoration: 'none', marginBottom: 10 }}>
              hello@makemyfacelessvideo.com
            </a>
            {['Instagram', 'YouTube'].map(l => (
              <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: 'var(--muted)', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
                onMouseEnter={e => (e.currentTarget.style.color = 'var(--text)')}
                onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
              >{l}</a>
            ))}
          </div>
        </div>
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: 24, textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#475569' }}>© 2025 MakeMyFacelessVideo.com · All rights reserved.</p>
        </div>
      </footer>
    </>
  )
}
