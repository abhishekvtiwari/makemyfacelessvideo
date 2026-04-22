'use client'
// src/components/pricing/PricingClient.tsx
import { useEffect, useRef, useState } from 'react'
import Navbar from '@/components/layout/Navbar'
import Footer from '@/components/layout/Footer'
import { PLANS, FEATURE_MATRIX } from '@/lib/plans'

type Currency = 'INR' | 'USD'

function detectCurrency(): Currency {
  if (typeof window === 'undefined') return 'USD'
  const tz   = Intl.DateTimeFormat().resolvedOptions().timeZone
  const lang = navigator.language ?? ''
  return (tz === 'Asia/Kolkata' || tz === 'Asia/Calcutta' || lang.startsWith('en-IN')) ? 'INR' : 'USD'
}

function CheckIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="6" stroke="#0A7A70" strokeWidth="1.2" />
      <polyline points="4,7 6,9 10,5" stroke="#0A7A70" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
function CrossIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="6" stroke="rgba(0,0,0,0.12)" strokeWidth="1.2" />
      <line x1="5" y1="5" x2="9" y2="9" stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="9" y1="5" x2="5" y2="9" stroke="rgba(0,0,0,0.18)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function CellValue({ v }: { v: boolean | string }) {
  if (v === true)  return <CheckIcon />
  if (v === false) return <CrossIcon />
  return <span style={{ fontSize: 12, color: '#6B7280' }}>{v}</span>
}

export default function PricingClient() {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [yearly,   setYearly]   = useState(false)
  const [tableOpen, setTableOpen] = useState(false)
  const cardsRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setCurrency(detectCurrency())
  }, [])

  useEffect(() => {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced || !cardsRef.current) return

    const gsap = (window as any).gsap
    const ScrollTrigger = (window as any).ScrollTrigger
    if (!gsap || !ScrollTrigger) return

    gsap.registerPlugin(ScrollTrigger)

    const cards = cardsRef.current.querySelectorAll('.pricing-card')

    gsap.from(cards, {
      scrollTrigger: { trigger: cardsRef.current, start: 'top 80%', once: true },
      y: 60, rotateX: 8, opacity: 0, scale: 0.92,
      duration: 0.8, ease: 'expo.out', stagger: 0.12,
      transformOrigin: 'top center',
    })

    const proCard = cardsRef.current.querySelector('.pricing-card-pro') as HTMLElement | null
    if (proCard) {
      ScrollTrigger.create({
        trigger: proCard, start: 'top 75%', once: true,
        onEnter: () => gsap.to(proCard, { scale: 1.03, duration: 0.4, ease: 'expo.out', delay: 0.35 }),
      })
    }

    const rows = document.querySelectorAll('.compare-row')
    gsap.from(rows, {
      scrollTrigger: { trigger: '.compare-table', start: 'top 85%', once: true },
      opacity: 0, y: 16, stagger: 0.03, duration: 0.5, ease: 'power2.out',
    })

    return () => ScrollTrigger.getAll().forEach((st: any) => st.kill())
  }, [])

  return (
    <>
      <Navbar />

      <main style={{ paddingTop: 100, minHeight: '100vh' }}>

        {/* ── Header ─────────────────────────────────────────────────────── */}
        <div style={{ maxWidth: 1120, margin: '0 auto', padding: '60px 32px 0' }}>
          <p className="section-label" style={{ marginBottom: 16 }}>/ PRICING</p>

          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 56 }}>
            <h1 className="font-display" style={{ fontSize: 'clamp(44px, 6vw, 72px)', lineHeight: 1.0, fontWeight: 400, color: 'var(--text)' }}>
              Simple pricing.<br />No surprises.
            </h1>

            {/* Toggles */}
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Currency */}
              <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9999, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                {(['INR', 'USD'] as Currency[]).map(c => (
                  <button key={c} onClick={() => setCurrency(c)} style={{
                    padding: '8px 18px', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
                    background: currency === c ? 'var(--violet)' : 'transparent',
                    color: currency === c ? '#fff' : 'var(--muted)',
                    transition: 'background 0.2s, color 0.2s',
                  }}>{c}</button>
                ))}
              </div>

              {/* Billing period */}
              <div style={{ display: 'flex', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 9999, overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                {[{ l: 'Monthly', v: false }, { l: 'Yearly', v: true }].map(({ l, v }) => (
                  <button key={l} onClick={() => setYearly(v)} style={{
                    padding: '8px 18px', fontSize: 13, fontWeight: 500, border: 'none', cursor: 'pointer',
                    background: yearly === v ? 'var(--violet)' : 'transparent',
                    color: yearly === v ? '#fff' : 'var(--muted)',
                    transition: 'background 0.2s, color 0.2s',
                  }}>{l}</button>
                ))}
              </div>

              {yearly && (
                <span style={{ fontSize: 12, color: '#059669', background: 'rgba(5,150,105,0.10)', padding: '4px 12px', borderRadius: 9999 }}>
                  Save 20%
                </span>
              )}
            </div>
          </div>

          {/* ── Plan cards ──────────────────────────────────────────────── */}
          <div ref={cardsRef} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 20, marginBottom: 64 }}>
            {PLANS.map(plan => {
              const price  = currency === 'INR' ? (yearly ? plan.priceINRYearly : plan.priceINR) : (yearly ? plan.priceUSDYearly : plan.priceUSD)
              const symbol = currency === 'INR' ? '₹' : '$'
              const period = yearly ? '/yr' : '/mo'

              return (
                <div
                  key={plan.id}
                  className={`pricing-card card pricing-card-${plan.id}`}
                  style={{
                    padding:    28,
                    position:   'relative',
                    border:     plan.highlighted ? '1px solid rgba(70,51,224,0.4)' : '1px solid var(--border)',
                    boxShadow:  plan.highlighted ? '0 8px 40px rgba(70,51,224,0.10)' : '0 1px 3px rgba(0,0,0,0.06)',
                    willChange: 'transform',
                  }}
                >
                  {plan.highlighted && (
                    <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)', background: 'var(--violet)', color: '#fff', fontSize: 10, fontFamily: 'var(--font-geist-mono)', letterSpacing: '0.14em', padding: '4px 14px', borderRadius: 9999, whiteSpace: 'nowrap' }}>
                      MOST POPULAR
                    </div>
                  )}

                  <p style={{ fontFamily: 'var(--font-geist-mono)', fontSize: 10, color: 'var(--teal)', letterSpacing: '0.14em', marginBottom: 6 }}>{plan.name}</p>
                  <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>{plan.tagline}</p>

                  <div style={{ marginBottom: 24 }}>
                    <span className="font-display" style={{ fontSize: 48, fontWeight: 400, color: 'var(--text)', lineHeight: 1 }}>{symbol}{price.toLocaleString()}</span>
                    <span style={{ fontSize: 13, color: 'var(--muted)', marginLeft: 4 }}>{period}</span>
                  </div>

                  <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {plan.features.map(f => (
                      <li key={f} style={{ fontSize: 13, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 10 }}>
                        <CheckIcon />
                        {f}
                      </li>
                    ))}
                  </ul>

                  <a href={plan.ctaHref} className={`btn-${plan.ctaVariant}`}
                    style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                    {plan.ctaLabel}
                  </a>
                </div>
              )
            })}
          </div>

          {/* ── Feature comparison table ─────────────────────────────────── */}
          <div style={{ marginBottom: 100 }}>
            <button
              onClick={() => setTableOpen(o => !o)}
              style={{ display: 'flex', alignItems: 'center', gap: 10, background: 'none', border: 'none', cursor: 'pointer', color: 'var(--muted)', fontSize: 13, marginBottom: 24, padding: 0 }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: tableOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s' }}>
                <polyline points="4,6 8,10 12,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {tableOpen ? 'Hide' : 'Show'} full feature comparison
            </button>

            {tableOpen && (
              <div className="compare-table" style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontFamily: 'var(--font-geist-mono)', color: 'var(--muted)', letterSpacing: '0.12em', borderBottom: '1px solid var(--border)' }}>FEATURE</th>
                      {PLANS.map(p => (
                        <th key={p.id} style={{ textAlign: 'center', padding: '12px 16px', fontSize: 11, fontFamily: 'var(--font-geist-mono)', color: p.highlighted ? 'var(--violet)' : 'var(--muted)', letterSpacing: '0.12em', borderBottom: '1px solid var(--border)' }}>
                          {p.name}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {FEATURE_MATRIX.map((row, i) => (
                      <tr key={row.label} className="compare-row" style={{ borderBottom: '1px solid rgba(0,0,0,0.04)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,0,0,0.015)' }}>
                        <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text)' }}>{row.label}</td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}><CellValue v={row.free} /></td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}><CellValue v={row.basic} /></td>
                        <td style={{ padding: '12px 16px', textAlign: 'center', background: 'rgba(70,51,224,0.03)' }}><CellValue v={row.pro} /></td>
                        <td style={{ padding: '12px 16px', textAlign: 'center' }}><CellValue v={row.business} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
