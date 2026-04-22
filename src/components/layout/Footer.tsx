'use client'
// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '60px 32px 32px', maxWidth: 1120, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: '#5B47F5', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><polygon points="5,3 13,8 5,13" fill="white" /></svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: 13 }}>MakeMyFacelessVideo</span>
          </div>
          <p style={{ fontSize: 13, color: '#64748B', lineHeight: 1.65 }}>AI-powered faceless video creation.</p>
        </div>

        <div>
          <p style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', color: '#64748B', letterSpacing: '0.14em', marginBottom: 16 }}>PRODUCT</p>
          {[['Features', '#features'], ['Pricing', '/pricing'], ['How It Works', '#how-it-works'], ['Dashboard', '/dashboard']].map(([l, h]) => (
            <a key={l} href={h} style={{ display: 'block', fontSize: 13, color: '#64748B', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#E2E8F0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
            >{l}</a>
          ))}
        </div>

        <div>
          <p style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', color: '#64748B', letterSpacing: '0.14em', marginBottom: 16 }}>LEGAL</p>
          {['Privacy Policy', 'Terms & Conditions', 'Refund Policy'].map(l => (
            <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: '#64748B', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#E2E8F0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
            >{l}</a>
          ))}
        </div>

        <div>
          <p style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', color: '#64748B', letterSpacing: '0.14em', marginBottom: 16 }}>CONTACT</p>
          <a href="mailto:hello@makemyfacelessvideo.com" style={{ display: 'block', fontSize: 13, color: '#64748B', textDecoration: 'none', marginBottom: 10 }}>
            hello@makemyfacelessvideo.com
          </a>
          {['Instagram', 'YouTube'].map(l => (
            <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: '#64748B', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#E2E8F0')}
              onMouseLeave={e => (e.currentTarget.style.color = '#64748B')}
            >{l}</a>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#475569' }}>© 2025 MakeMyFacelessVideo.com · All rights reserved.</p>
      </div>
    </footer>
  )
}
