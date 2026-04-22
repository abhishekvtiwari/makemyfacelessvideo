'use client'
// src/components/layout/Footer.tsx
export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(0,0,0,0.08)', padding: '60px 32px 32px', maxWidth: 1120, margin: '0 auto' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 40, marginBottom: 48 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 28, height: 28, borderRadius: 7, background: '#4633E0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none"><polygon points="5,3 13,8 5,13" fill="white" /></svg>
            </div>
            <span style={{ fontWeight: 600, fontSize: 13, color: '#0A0A0A' }}>MakeMyFacelessVideo</span>
          </div>
          <p style={{ fontSize: 13, color: '#6B7280', lineHeight: 1.65 }}>AI-powered faceless video creation.</p>
        </div>

        <div>
          <p style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', color: '#6B7280', letterSpacing: '0.14em', marginBottom: 16 }}>PRODUCT</p>
          {[['Features', '#features'], ['Pricing', '/pricing'], ['How It Works', '#how-it-works'], ['Dashboard', '/dashboard']].map(([l, h]) => (
            <a key={l} href={h} style={{ display: 'block', fontSize: 13, color: '#6B7280', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0A0A0A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
            >{l}</a>
          ))}
        </div>

        <div>
          <p style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', color: '#6B7280', letterSpacing: '0.14em', marginBottom: 16 }}>LEGAL</p>
          {['Privacy Policy', 'Terms & Conditions', 'Refund Policy'].map(l => (
            <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: '#6B7280', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0A0A0A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
            >{l}</a>
          ))}
        </div>

        <div>
          <p style={{ fontSize: 10, fontFamily: 'var(--font-geist-mono)', color: '#6B7280', letterSpacing: '0.14em', marginBottom: 16 }}>CONTACT</p>
          <a href="mailto:hello@makemyfacelessvideo.com" style={{ display: 'block', fontSize: 13, color: '#6B7280', textDecoration: 'none', marginBottom: 10 }}>
            hello@makemyfacelessvideo.com
          </a>
          {['Instagram', 'YouTube'].map(l => (
            <a key={l} href="#" style={{ display: 'block', fontSize: 13, color: '#6B7280', textDecoration: 'none', marginBottom: 10, transition: 'color 0.2s' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#0A0A0A')}
              onMouseLeave={e => (e.currentTarget.style.color = '#6B7280')}
            >{l}</a>
          ))}
        </div>
      </div>

      <div style={{ borderTop: '1px solid rgba(0,0,0,0.07)', paddingTop: 24, textAlign: 'center' }}>
        <p style={{ fontSize: 12, color: '#9CA3AF' }}>© 2026 MakeMyFacelessVideo.com · All rights reserved.</p>
      </div>
    </footer>
  )
}
