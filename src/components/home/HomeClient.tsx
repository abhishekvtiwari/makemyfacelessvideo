'use client'
// src/components/home/HomeClient.tsx
import { useCallback, useEffect, useRef, useState } from 'react'
import dynamic from 'next/dynamic'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import Cursor from './Cursor'
import ScrollProgress from './ScrollProgress'

const HeroCanvas = dynamic(() => import('./HeroCanvas'), { ssr: false })

// ── Text splitter ──────────────────────────────────────────────────────────────
function splitChars(el: HTMLElement): HTMLSpanElement[] {
  const text = el.textContent ?? ''
  el.textContent = ''
  el.setAttribute('aria-label', text)
  return Array.from(text).map(char => {
    const s = document.createElement('span')
    s.textContent = char === ' ' ? '\u00A0' : char
    s.style.display = 'inline-block'
    s.setAttribute('aria-hidden', 'true')
    el.appendChild(s)
    return s
  })
}

// ── revealOnScroll GSAP utility ────────────────────────────────────────────────
function revealOnScroll(els: NodeListOf<Element> | Element[], options: Record<string, any> = {}) {
  const gsap = (window as any).gsap
  const ScrollTrigger = (window as any).ScrollTrigger
  if (!gsap || !ScrollTrigger) return
  Array.from(els).forEach(el => {
    gsap.from(el, {
      scrollTrigger: {
        trigger: el,
        start: 'top 85%',
        once: true,
        ...(options.scrollTrigger ?? {}),
      },
      y: 40,
      opacity: 0,
      duration: 0.7,
      ease: 'expo.out',
      ...options,
    })
  })
}

// ── Cycling hero number ────────────────────────────────────────────────────────
function CyclingNumber() {
  const seq = [5, 6, 7]
  const [i, setI] = useState(2)
  useEffect(() => {
    const id = setInterval(() => setI(n => (n + 1) % seq.length), 900)
    return () => clearInterval(id)
  }, [])
  return <span className="violet-pulse" style={{ color: 'var(--violet)' }}>{seq[i]}</span>
}

// ── Animated counter ──────────────────────────────────────────────────────────
function AnimCounter({ to, suffix = '' }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const start = performance.now()
      const duration = 1800
      const tick = (now: number) => {
        const progress = Math.min((now - start) / duration, 1)
        const ease = 1 - Math.pow(1 - progress, 3)
        el.textContent = Math.floor(to * ease).toLocaleString() + suffix
        if (progress < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.5 })
    observer.observe(el)
    return () => observer.disconnect()
  }, [to, suffix])
  return <span ref={ref}>0{suffix}</span>
}

export default function HomeClient() {
  const heroLineRef   = useRef<HTMLSpanElement>(null)
  const heroMinsRef   = useRef<HTMLSpanElement>(null)
  const heroSubRef    = useRef<HTMLParagraphElement>(null)
  const heroCtasRef   = useRef<HTMLDivElement>(null)
  const heroCanvasRef = useRef<HTMLDivElement>(null)
  const featuresRef   = useRef<HTMLElement>(null)
  const nichesRef     = useRef<HTMLElement>(null)
  const workflowRef   = useRef<HTMLElement>(null)
  const ctaRef        = useRef<HTMLElement>(null)
  const heroRef       = useRef<HTMLElement>(null)

  // ── Hero entry — staggered opacity reveal ─────────────────────────────────
  const runHeroEntry = useCallback(() => {
    const gsap = (window as any).gsap
    if (!gsap) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const line1 = heroLineRef.current
    const line2 = heroMinsRef.current
    const sub   = heroSubRef.current
    const ctas  = heroCtasRef.current
    const cvs   = heroCanvasRef.current
    if (!line1 || !line2 || !sub || !ctas) return

    const chars1 = splitChars(line1)
    const chars2 = splitChars(line2)

    const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
    tl.from(chars1, { y: -50, opacity: 0, stagger: 0.035, duration: 0.65 })
      .from(chars2, { y: -50, opacity: 0, stagger: 0.035, duration: 0.65 }, '-=0.35')
      .from(sub,    { y: 20, opacity: 0, duration: 0.6 }, '-=0.2')
      .from(ctas,   { y: 16, opacity: 0, duration: 0.5 }, '-=0.4')
      .from(cvs,    { opacity: 0, duration: 0.8 }, '-=0.4')
  }, [])

  // ── Page entry on mount (no overlay) ─────────────────────────────────────
  useEffect(() => {
    const timer = setTimeout(() => runHeroEntry(), 120)
    return () => clearTimeout(timer)
  }, [runHeroEntry])

  // ── Scroll-driven GSAP setup ───────────────────────────────────────────────
  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const timer = setTimeout(() => {
      const gsap = (window as any).gsap
      const ScrollTrigger = (window as any).ScrollTrigger
      if (!gsap || !ScrollTrigger) return

      gsap.registerPlugin(ScrollTrigger)

      // ── Features — cards enter + tilt on scroll ──────────────────────────
      if (featuresRef.current) {
        const cards = featuresRef.current.querySelectorAll('.feature-card')

        ScrollTrigger.create({
          trigger:    featuresRef.current,
          start:      'top top',
          end:        '+=300',
          pin:        true,
          pinSpacing: true,
        })

        gsap.from(cards, {
          scrollTrigger: { trigger: featuresRef.current, start: 'top 75%', scrub: 1.5 },
          y: 80, opacity: 0, scale: 0.94, stagger: 0.15, ease: 'expo.out',
        })

        cards.forEach((card) => {
          ScrollTrigger.create({
            trigger: card, start: 'top 80%', once: true,
            onEnter: () => {
              const el = card as HTMLElement
              gsap.to(el, { boxShadow: '0 8px 40px rgba(70,51,224,0.12)', duration: 0.5, ease: 'power2.out' })
            },
          })
        })
      }

      // ── Niches — rows slam in ────────────────────────────────────────────
      if (nichesRef.current) {
        const rows = nichesRef.current.querySelectorAll('.ticker-row')
        gsap.from(rows[0], {
          scrollTrigger: { trigger: nichesRef.current, start: 'top 80%', scrub: 1.5 },
          x: '-60vw', opacity: 0, ease: 'expo.out',
        })
        gsap.from(rows[1], {
          scrollTrigger: { trigger: nichesRef.current, start: 'top 80%', scrub: 1.5 },
          x: '60vw', opacity: 0, ease: 'expo.out',
        })
        const words = nichesRef.current.querySelectorAll('.niche-word')
        gsap.from(words, {
          scrollTrigger: { trigger: nichesRef.current, start: 'top 75%', scrub: 1.2 },
          y: 50, opacity: 0, stagger: 0.08, ease: 'expo.out',
        })
      }

      // ── Workflow — pinned steps ──────────────────────────────────────────
      if (workflowRef.current) {
        const steps = workflowRef.current.querySelectorAll('.workflow-step')
        const progressFill = workflowRef.current.querySelector('.workflow-progress-fill') as HTMLElement | null

        ScrollTrigger.create({
          trigger: workflowRef.current, start: 'top top', end: '+=400',
          pin: true, pinSpacing: true,
        })

        steps.forEach((step, i) => {
          gsap.from(step, {
            scrollTrigger: {
              trigger: workflowRef.current,
              start: `top+=${i * 80} top`,
              end:   `top+=${i * 80 + 100} top`,
              scrub: 1.2,
            },
            x: 60, opacity: 0, ease: 'expo.out',
          })
        })

        if (progressFill) {
          gsap.to(progressFill, {
            scrollTrigger: { trigger: workflowRef.current, start: 'top top', end: '+=400', scrub: 1 },
            height: '100%', ease: 'none',
          })
        }
      }

      // ── Social proof ────────────────────────────────────────────────────
      const testimonials = document.querySelectorAll('.testimonial-card')
      testimonials.forEach((card, i) => {
        gsap.from(card, {
          scrollTrigger: { trigger: card, start: 'top 85%', scrub: 1 },
          x: i % 2 === 0 ? -60 : 60, opacity: 0, ease: 'expo.out',
        })
      })

      // ── CTA headline scramble → 0 ────────────────────────────────────────
      if (ctaRef.current) {
        const h2 = ctaRef.current.querySelector('.cta-headline') as HTMLElement | null
        if (h2) {
          const chars = splitChars(h2)
          chars.forEach(c => { c.style.transform = `rotate(${(Math.random() - 0.5) * 30}deg)` })
          gsap.to(chars, {
            scrollTrigger: { trigger: ctaRef.current, start: 'top 75%', scrub: 1.5 },
            rotation: 0, stagger: 0.02, ease: 'expo.out',
          })
          gsap.from(chars, {
            scrollTrigger: { trigger: ctaRef.current, start: 'top 75%', scrub: 1.5 },
            opacity: 0, stagger: 0.02,
          })
        }
      }

      // ── revealOnScroll for misc elements ─────────────────────────────────
      revealOnScroll(document.querySelectorAll('.reveal-on-scroll'))

      ScrollTrigger.refresh()
    }, 300)

    return () => {
      clearTimeout(timer)
      const ScrollTrigger = (window as any).ScrollTrigger
      ScrollTrigger?.getAll().forEach((st: any) => st.kill())
    }
  }, [])

  return (
    <>
      <Cursor />
      <ScrollProgress />
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section
        ref={heroRef}
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '100px 32px 0',
          maxWidth: 1280,
          margin: '0 auto',
          position: 'relative',
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 48, alignItems: 'center' }}
          className="max-md:grid-cols-1">

          <div>
            <p className="section-label" style={{ marginBottom: 20 }}>/ 01 · AI VIDEO PLATFORM</p>
            <h1 className="font-display" style={{ fontSize: 'clamp(44px, 6vw, 72px)', lineHeight: 1.05, fontWeight: 400, color: 'var(--text)', marginBottom: 28 }}>
              <span ref={heroLineRef}>Create a faceless video in</span>{' '}
              <CyclingNumber />{' '}
              <span ref={heroMinsRef}>minutes.</span>
            </h1>
            <p ref={heroSubRef} style={{ fontSize: 18, color: 'var(--muted)', lineHeight: 1.7, marginBottom: 36, maxWidth: 480 }}>
              Drop a topic. We write the script, cast the voice, source the visuals, and hand you a finished video. No camera. No editor. No excuses.
            </p>
            <div ref={heroCtasRef} style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <a href="/auth/signup" className="btn-violet" style={{ fontSize: 15 }}>Start Creating →</a>
              <a href="#how-it-works" className="btn-ghost" style={{ fontSize: 15 }}>See How It Works</a>
            </div>
          </div>

          <div ref={heroCanvasRef} style={{ height: 500, borderRadius: 16, overflow: 'hidden', background: 'var(--elevated)' }}>
            <HeroCanvas />
          </div>
        </div>

        {/* Stats bar */}
        <div style={{ marginTop: 48, paddingBottom: 60 }}>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 12,
            padding: '16px 28px',
            display: 'flex',
            alignItems: 'center',
            gap: 28,
            flexWrap: 'wrap',
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="live-dot" style={{ width: 8, height: 8, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
              <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: '#059669', letterSpacing: '0.14em' }}>LIVE</span>
            </div>
            {[{ l: 'SCRIPT', v: '2.1s' }, { l: 'VOICE', v: '4.3s' }, { l: 'VISUALS', v: '18s' }, { l: 'TOTAL', v: '< 25s' }].map((s, i) => (
              <div key={s.l} style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
                {i > 0 && <span style={{ color: 'var(--border)', fontSize: 18 }}>|</span>}
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
                  <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: 'var(--muted)', letterSpacing: '0.12em' }}>{s.l}</span>
                  <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 14, color: 'var(--text)', fontWeight: 700 }}>{s.v}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ──────────────────────────────────────────────────────────── */}
      <section ref={featuresRef} id="features"
        style={{ padding: '100px 32px', maxWidth: 1120, margin: '0 auto' }}>
        <p className="section-label" style={{ marginBottom: 16 }}>/ 02 · HOW IT WORKS</p>
        <h2 className="font-display" style={{ fontSize: 'clamp(40px, 5vw, 56px)', lineHeight: 1.05, fontWeight: 400, color: 'var(--text)', marginBottom: 16 }}>
          Four steps.<br />One prompt.
        </h2>
        <p style={{ fontSize: 16, color: 'var(--muted)', maxWidth: 520, marginBottom: 56, lineHeight: 1.7 }}>
          Every faceless video needs a hook, a voice, a visual loop, and a pace. We handle all four simultaneously.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 20 }}>
          {[
            { num: '01', title: 'Script Engine', icon: '✦', desc: 'Writes hook-led scripts tuned to your niche, tone, and duration. Paced for 30–600s.' },
            { num: '02', title: 'Voice Cast',    icon: '◈', desc: 'Studio-grade AI voices. Choose tone, speed, and emotion. Hindi + English supported.' },
            { num: '03', title: 'Visual Engine', icon: '▣', desc: 'Sources cinematic stock footage scene-by-scene from your script keywords. Auto-matched.' },
            { num: '04', title: 'Auto Render',   icon: '▶', desc: 'Assembles script + voice + visuals into a finished MP4. Download or publish same session.' },
          ].map(card => (
            <div key={card.num} className="feature-card card"
              style={{ padding: 28, borderTop: '3px solid var(--violet)', willChange: 'transform' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
                <span style={{ fontSize: 22, color: 'var(--text)' }}>{card.icon}</span>
                <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: 'var(--teal)', letterSpacing: '0.12em' }}>MODULE {card.num}</span>
              </div>
              <h3 className="font-display" style={{ fontSize: 22, fontWeight: 400, color: 'var(--text)', marginBottom: 12 }}>{card.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>{card.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── NICHES ────────────────────────────────────────────────────────────── */}
      <section ref={nichesRef} style={{ padding: '80px 0', overflow: 'hidden' }}>
        <div style={{ padding: '0 32px', maxWidth: 1120, margin: '0 auto 48px' }}>
          <p className="section-label" style={{ marginBottom: 16 }}>/ 03 · PRESET NICHES</p>
          <h2 className="font-display" style={{ fontSize: 'clamp(40px, 5vw, 56px)', lineHeight: 1.05, fontWeight: 400, color: 'var(--text)' }}>
            {'Pick a niche.'.split(' ').map((w, i) => (
              <span key={i} className="niche-word" style={{ display: 'inline-block', marginRight: '0.25em', willChange: 'transform' }}>{w}</span>
            ))}<br />
            {'We know the format.'.split(' ').map((w, i) => (
              <span key={i} className="niche-word" style={{ display: 'inline-block', marginRight: '0.25em', willChange: 'transform' }}>{w}</span>
            ))}
          </h2>
        </div>

        {[
          { items: ['Motivational', 'Mind-Blowing Facts', 'Story Time', 'Finance', 'True Crime', 'History', 'Tech Explained', 'News Recap', 'Life Hacks', 'Psychology'], dir: 'left' },
          { items: ['Top 10 Lists', 'Book Summaries', 'Science Facts', 'Business Tips', 'Productivity', 'Health', 'Investing', 'World Records', 'Mysteries', 'Philosophy'], dir: 'right' },
        ].map((row, ri) => (
          <div key={ri} className="ticker-row" style={{ overflow: 'hidden', marginBottom: 14, willChange: 'transform' }}>
            <div className={`ticker-${row.dir}`} style={{ display: 'flex', gap: 10, width: 'max-content', padding: '4px 0' }}>
              {[...row.items, ...row.items].map((item, i) => (
                <a key={i} href="#features"
                  onClick={e => { e.preventDefault(); document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' }) }}
                  style={{ display: 'inline-block', padding: '9px 18px', background: 'var(--surface)', border: '1px solid rgba(70,51,224,0.2)', borderRadius: 9999, fontSize: 13, color: 'var(--text)', whiteSpace: 'nowrap', textDecoration: 'none', transition: 'background 0.2s, color 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}
                  onMouseEnter={e => { e.currentTarget.style.background = 'var(--violet)'; e.currentTarget.style.color = '#fff' }}
                  onMouseLeave={e => { e.currentTarget.style.background = 'var(--surface)'; e.currentTarget.style.color = 'var(--text)' }}
                >{item}</a>
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── WORKFLOW ──────────────────────────────────────────────────────────── */}
      <section ref={workflowRef} id="how-it-works"
        style={{ padding: '100px 32px', maxWidth: 1120, margin: '0 auto' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 64, alignItems: 'start' }}
          className="max-md:grid-cols-1">
          <div>
            <p className="section-label" style={{ marginBottom: 16 }}>/ 04 · WORKFLOW</p>
            <h2 className="font-display" style={{ fontSize: 'clamp(40px, 5vw, 56px)', lineHeight: 1.05, fontWeight: 400, color: 'var(--text)', marginBottom: 20 }}>
              From blank<br />field to finished<br />video.
            </h2>
            <p style={{ fontSize: 15, color: 'var(--muted)', lineHeight: 1.7 }}>
              A four-step pipeline. Fully automated. Zero guesswork.
            </p>
          </div>

          <div style={{ position: 'relative' }}>
            <div style={{ position: 'absolute', left: 18, top: 28, bottom: 0, width: 1, background: 'rgba(70,51,224,0.12)' }}>
              <div className="workflow-progress-fill" style={{ width: '100%', height: 0, background: 'linear-gradient(to bottom, #4633E0, rgba(70,51,224,0.2))', willChange: 'height' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              {[
                { n: '01', title: 'Drop a Topic',         desc: "Pick your niche, set a duration, write one sentence. That's your whole brief." },
                { n: '02', title: 'Script Generated',     desc: 'We write a hook, body, and CTA. Paced to your exact duration. Editable before render.' },
                { n: '03', title: 'Voice + Visuals Cast', desc: 'Pick a voice. Visuals are sourced scene-by-scene in parallel. Renders in under 30 seconds.' },
                { n: '04', title: 'Download & Publish',   desc: 'Your finished MP4 with captions is ready. Export at 1080p. Publish same session.' },
              ].map((step, i) => (
                <div key={step.n} className="workflow-step" style={{ display: 'flex', gap: 24, paddingBottom: i < 3 ? 36 : 0, willChange: 'transform' }}>
                  <div style={{ flexShrink: 0, width: 36, paddingTop: 2 }}>
                    <span style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 13, color: 'var(--teal)', fontWeight: 700 }}>{step.n}</span>
                  </div>
                  <div>
                    <h3 className="font-display" style={{ fontSize: 20, fontWeight: 400, color: 'var(--text)', marginBottom: 8 }}>{step.title}</h3>
                    <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.65 }}>{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ──────────────────────────────────────────────────────── */}
      <section style={{ padding: '100px 32px', maxWidth: 1120, margin: '0 auto' }}>
        <p className="section-label" style={{ marginBottom: 16 }}>/ 05 · CREATORS</p>
        <h2 className="font-display" style={{ fontSize: 'clamp(36px, 4vw, 48px)', lineHeight: 1.08, fontWeight: 400, color: 'var(--text)', marginBottom: 56 }}>
          Built for creators<br />who ship daily.
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 64 }}>
          {[
            { q: 'I went from 0 to 30 videos published in my first month. The script quality is insane.',    h: '@financewithravi', s: '48K subscribers' },
            { q: 'Finally a tool that understands faceless YouTube. The niche templates save hours.',         h: '@techexplained_',  s: '91K subscribers' },
            { q: "Hindi voice quality is better than anything I've tried. My retention went up 40%.",        h: '@gyaanwala',       s: '22K subscribers' },
          ].map((t, i) => (
            <div key={i} className="testimonial-card card" style={{ padding: 28, willChange: 'transform' }}>
              <div style={{ fontSize: 40, color: 'var(--violet)', lineHeight: 1, marginBottom: 16, fontFamily: 'Georgia, serif' }}>"</div>
              <p style={{ fontSize: 14, color: 'var(--text)', lineHeight: 1.7, marginBottom: 20 }}>{t.q}</p>
              <p style={{ fontSize: 13, color: 'var(--text)', fontWeight: 600 }}>{t.h}</p>
              <p style={{ fontSize: 12, color: 'var(--muted)' }}>{t.s}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap', justifyContent: 'center' }}>
          {[{ l: 'creators', to: 12400, suffix: '+' }, { l: 'videos generated', to: 340000, suffix: '+' }, { l: 'average rating', to: 4.8, suffix: '★' }].map(s => (
            <div key={s.l} style={{ textAlign: 'center' }}>
              <p className="font-display" style={{ fontSize: 44, fontWeight: 400, color: 'var(--text)', lineHeight: 1 }}>
                <AnimCounter to={s.to} suffix={s.suffix} />
              </p>
              <p style={{ fontSize: 13, color: 'var(--muted)', marginTop: 6 }}>{s.l}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA BANNER ────────────────────────────────────────────────────────── */}
      <section ref={ctaRef} style={{
        margin: '0 32px 100px',
        borderRadius: 20,
        background: 'linear-gradient(135deg, #EEF0FF 0%, #F0F7FF 50%, #EDFAF7 100%)',
        border: '1px solid rgba(70,51,224,0.15)',
        padding: '80px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{ position: 'absolute', top: '20%', left: '15%', width: 400, height: 400, borderRadius: '50%', background: 'rgba(70,51,224,0.06)', filter: 'blur(80px)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 300, height: 300, borderRadius: '50%', background: 'rgba(10,122,112,0.05)', filter: 'blur(60px)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 className="font-display cta-headline"
            style={{ fontSize: 'clamp(56px, 8vw, 96px)', fontWeight: 400, color: '#0A0A0A', lineHeight: 0.95, marginBottom: 20, willChange: 'transform' }}>
            Press start.
          </h2>
          <p style={{ fontSize: 18, color: 'var(--muted)', marginBottom: 40 }}>
            Your first faceless video is 7 minutes away.
          </p>
          <a href="/auth/signup" style={{
            display: 'inline-block', background: '#4633E0', color: '#fff',
            borderRadius: 9999, padding: '16px 44px', fontSize: 16, fontWeight: 600,
            textDecoration: 'none', transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.04)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(70,51,224,0.35)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; e.currentTarget.style.boxShadow = 'none' }}
          >
            Start Creating Free →
          </a>
        </div>
      </section>

      <Footer />
    </>
  )
}
