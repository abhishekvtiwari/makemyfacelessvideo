'use client'
// src/components/layout/Navbar.tsx
import { useEffect, useState } from 'react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open,     setOpen]     = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <nav
      style={{
        position:       'fixed',
        top:            0, left: 0, right: 0,
        zIndex:         50,
        padding:        '0 32px',
        height:         64,
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'space-between',
        background:     scrolled ? 'rgba(6,12,28,0.95)' : 'transparent',
        borderBottom:   scrolled ? '1px solid rgba(91,71,245,0.18)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        transition:     'background 0.4s ease, border-color 0.4s ease',
      }}
    >
      {/* Logo */}
      <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: '#5B47F5',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <polygon points="5,3 13,8 5,13" fill="white" />
          </svg>
        </div>
        <span style={{ fontFamily: 'var(--font-geist), sans-serif', fontWeight: 600, fontSize: 14, color: '#E2E8F0', letterSpacing: '-0.02em' }}>
          MakeMyFacelessVideo
        </span>
      </a>

      {/* Desktop nav */}
      <div className="hidden md:flex" style={{ gap: 36, alignItems: 'center' }}>
        {[['Features', '#features'], ['Pricing', '/pricing'], ['How It Works', '#how-it-works']].map(([label, href]) => (
          <a key={label} href={href}
            style={{ color: '#64748B', fontSize: 14, textDecoration: 'none', transition: 'color 0.2s' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#E2E8F0')}
            onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
          >{label}</a>
        ))}
      </div>

      {/* CTAs */}
      <div className="hidden md:flex" style={{ gap: 10, alignItems: 'center' }}>
        <a href="/auth/login"  className="btn-ghost"  style={{ padding: '8px 18px', fontSize: 13 }}>Sign In</a>
        <a href="/auth/signup" className="btn-violet" style={{ padding: '8px 18px', fontSize: 13 }}>Start Free</a>
      </div>

      {/* Hamburger */}
      <button
        className="md:hidden"
        onClick={() => setOpen(o => !o)}
        aria-label="Open menu"
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 8, color: '#E2E8F0' }}
      >
        <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
          {open
            ? <><line x1="4" y1="4" x2="18" y2="18" stroke="currentColor" strokeWidth="1.8"/><line x1="18" y1="4" x2="4" y2="18" stroke="currentColor" strokeWidth="1.8"/></>
            : <><line x1="3" y1="6" x2="19" y2="6" stroke="currentColor" strokeWidth="1.8"/><line x1="3" y1="11" x2="19" y2="11" stroke="currentColor" strokeWidth="1.8"/><line x1="3" y1="16" x2="19" y2="16" stroke="currentColor" strokeWidth="1.8"/></>
          }
        </svg>
      </button>

      {/* Mobile dropdown */}
      {open && (
        <div style={{
          position: 'absolute', top: 64, left: 0, right: 0,
          background: 'rgba(6,12,28,0.98)',
          borderBottom: '1px solid rgba(91,71,245,0.15)',
          backdropFilter: 'blur(16px)',
          padding: '20px 32px',
          display: 'flex', flexDirection: 'column', gap: 16,
        }}>
          {[['Features', '#features'], ['Pricing', '/pricing'], ['How It Works', '#how-it-works']].map(([label, href]) => (
            <a key={label} href={href} onClick={() => setOpen(false)}
              style={{ color: '#E2E8F0', fontSize: 15, textDecoration: 'none' }}
            >{label}</a>
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
