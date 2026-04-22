'use client'
// src/components/pricing/PricingClient.tsx
import { useEffect, useState } from 'react'
import { Navbar } from '@/components/sections/Navbar'
import { Footer } from '@/components/sections/Footer'
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
      <circle cx="7" cy="7" r="6" stroke="var(--green)" strokeWidth="1.2" />
      <polyline points="4,7 6,9 10,5" stroke="var(--green)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function CrossIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
      <circle cx="7" cy="7" r="6" stroke="rgba(255,255,255,0.12)" strokeWidth="1.2" />
      <line x1="5" y1="5" x2="9" y2="9" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" />
      <line x1="9" y1="5" x2="5" y2="9" stroke="rgba(255,255,255,0.2)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function CellValue({ v }: { v: boolean | string }) {
  if (v === true)  return <CheckIcon />
  if (v === false) return <CrossIcon />
  return <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{v}</span>
}

export default function PricingClient() {
  const [currency, setCurrency] = useState<Currency>('USD')
  const [yearly,   setYearly]   = useState(false)
  const [tableOpen, setTableOpen] = useState(false)

  useEffect(() => {
    setCurrency(detectCurrency())
  }, [])

  return (
    <>
      <Navbar />

      <main style={{ paddingTop: 56, minHeight: '100vh', background: 'var(--bg)' }}>

        {/* Header */}
        <div className="section">
          <div className="section-inner">
            <p className="label" style={{ marginBottom: 20 }}>/ PRICING</p>

            <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', flexWrap: 'wrap', gap: 20, marginBottom: 56 }}>
              <h1 style={{ fontSize: 'clamp(44px, 6vw, 72px)', lineHeight: 1.0, letterSpacing: -2, fontWeight: 700 }}>
                Simple pricing.<br />No surprises.
              </h1>

              {/* Toggles */}
              <div style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
                {/* Currency toggle */}
                <div
                  style={{
                    display: 'flex',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 100,
                    overflow: 'hidden',
                  }}
                >
                  {(['INR', 'USD'] as Currency[]).map(c => (
                    <button
                      key={c}
                      onClick={() => setCurrency(c)}
                      style={{
                        padding: '8px 18px',
                        fontSize: 13,
                        fontWeight: 500,
                        border: 'none',
                        cursor: 'pointer',
                        background: currency === c ? 'var(--ig)' : 'transparent',
                        color: currency === c ? '#fff' : 'var(--text-secondary)',
                        transition: 'background 0.2s, color 0.2s',
                      }}
                    >
                      {c}
                    </button>
                  ))}
                </div>

                {/* Billing period toggle */}
                <div
                  style={{
                    display: 'flex',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 100,
                    overflow: 'hidden',
                  }}
                >
                  {[{ l: 'Monthly', v: false }, { l: 'Yearly', v: true }].map(({ l, v }) => (
                    <button
                      key={l}
                      onClick={() => setYearly(v)}
                      style={{
                        padding: '8px 18px',
                        fontSize: 13,
                        fontWeight: 500,
                        border: 'none',
                        cursor: 'pointer',
                        background: yearly === v ? 'var(--ig)' : 'transparent',
                        color: yearly === v ? '#fff' : 'var(--text-secondary)',
                        transition: 'background 0.2s, color 0.2s',
                      }}
                    >
                      {l}
                    </button>
                  ))}
                </div>

                {yearly && (
                  <span
                    style={{
                      fontSize: 12,
                      color: 'var(--green)',
                      background: 'rgba(34,197,94,0.1)',
                      padding: '4px 12px',
                      borderRadius: 100,
                    }}
                  >
                    Save 20%
                  </span>
                )}
              </div>
            </div>

            {/* Plan cards */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: 16,
                marginBottom: 64,
              }}
            >
              {PLANS.map(plan => {
                const price  = currency === 'INR' ? (yearly ? plan.priceINRYearly : plan.priceINR) : (yearly ? plan.priceUSDYearly : plan.priceUSD)
                const symbol = currency === 'INR' ? '₹' : '$'
                const period = yearly ? '/yr' : '/mo'

                return (
                  <div
                    key={plan.id}
                    className="card"
                    style={{
                      padding: 28,
                      position: 'relative',
                      border: plan.highlighted ? '1px solid rgba(221,42,123,0.35)' : '1px solid var(--border)',
                    }}
                  >
                    {plan.highlighted && (
                      <div
                        style={{
                          position: 'absolute',
                          top: -12,
                          left: '50%',
                          transform: 'translateX(-50%)',
                          background: 'var(--ig)',
                          color: '#fff',
                          fontSize: 10,
                          fontFamily: 'monospace',
                          letterSpacing: '0.14em',
                          padding: '4px 14px',
                          borderRadius: 100,
                          whiteSpace: 'nowrap',
                        }}
                      >
                        MOST POPULAR
                      </div>
                    )}

                    <p className="label" style={{ marginBottom: 6 }}>{plan.name}</p>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 20 }}>{plan.tagline}</p>

                    <div style={{ marginBottom: 24 }}>
                      <span style={{ fontSize: 48, fontWeight: 700, color: 'var(--text)', lineHeight: 1, letterSpacing: -2 }}>
                        {symbol}{price.toLocaleString()}
                      </span>
                      <span style={{ fontSize: 13, color: 'var(--text-muted)', marginLeft: 4 }}>{period}</span>
                    </div>

                    <ul style={{ listStyle: 'none', padding: 0, margin: '0 0 28px', display: 'flex', flexDirection: 'column', gap: 10 }}>
                      {plan.features.map(f => (
                        <li key={f} style={{ fontSize: 13, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: 10 }}>
                          <CheckIcon />
                          {f}
                        </li>
                      ))}
                    </ul>

                    <a
                      href={plan.ctaHref}
                      className={plan.ctaVariant === 'filled' ? 'btn-primary' : 'btn-ghost'}
                      style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}
                    >
                      {plan.ctaLabel}
                    </a>
                  </div>
                )
              })}
            </div>

            {/* Feature comparison table */}
            <div style={{ marginBottom: 64 }}>
              <button
                onClick={() => setTableOpen(o => !o)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--text-secondary)',
                  fontSize: 13,
                  marginBottom: 24,
                  padding: 0,
                }}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ transform: tableOpen ? 'rotate(180deg)' : 'rotate(0)', transition: 'transform 0.25s' }}>
                  <polyline points="4,6 8,10 12,6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {tableOpen ? 'Hide' : 'Show'} full feature comparison
              </button>

              {tableOpen && (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                      <tr>
                        <th style={{ textAlign: 'left', padding: '12px 16px', fontSize: 11, fontFamily: 'monospace', color: 'var(--text-muted)', letterSpacing: '0.12em', borderBottom: '1px solid var(--border)' }}>
                          FEATURE
                        </th>
                        {PLANS.map(p => (
                          <th
                            key={p.id}
                            style={{
                              textAlign: 'center',
                              padding: '12px 16px',
                              fontSize: 11,
                              fontFamily: 'monospace',
                              color: p.highlighted ? 'var(--accent-pink)' : 'var(--text-muted)',
                              letterSpacing: '0.12em',
                              borderBottom: '1px solid var(--border)',
                            }}
                          >
                            {p.name}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {FEATURE_MATRIX.map((row, i) => (
                        <tr
                          key={row.label}
                          style={{
                            borderBottom: '1px solid var(--border)',
                            background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.015)',
                          }}
                        >
                          <td style={{ padding: '12px 16px', fontSize: 13, color: 'var(--text)' }}>{row.label}</td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}><CellValue v={row.free} /></td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}><CellValue v={row.basic} /></td>
                          <td style={{ padding: '12px 16px', textAlign: 'center', background: 'rgba(221,42,123,0.03)' }}><CellValue v={row.pro} /></td>
                          <td style={{ padding: '12px 16px', textAlign: 'center' }}><CellValue v={row.business} /></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
