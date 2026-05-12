import Logo from './Logo'

export default function Footer() {
  return (
    <footer style={{
      background: 'var(--black)',
      borderTop: '1px solid var(--black-border)',
    }}>
      {/* Drop notification bar */}
      <div style={{
        background: 'var(--black-card)',
        borderBottom: '1px solid var(--black-border)',
        padding: '40px',
        textAlign: 'center',
      }}>
        <p style={{
          fontSize: '10px', fontWeight: 700, letterSpacing: '4px',
          color: 'var(--red)', textTransform: 'uppercase', marginBottom: '12px',
        }}>Stay Ready · Drops Are Limited</p>
        <h3 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(24px, 4vw, 40px)',
          letterSpacing: '4px', color: 'var(--white)', marginBottom: '20px',
        }}>GET NOTIFIED FOR THE NEXT DROP</h3>
        <p style={{ color: '#666', fontSize: '12px', marginBottom: '24px' }}>
          100 pieces. Once it's gone, the next drop is 2 months out. No restocks.
        </p>
        <div style={{ display: 'flex', gap: '0', maxWidth: '440px', margin: '0 auto' }}>
          <input
            type="email"
            placeholder="your@email.com"
            style={{
              flex: 1, padding: '13px 16px',
              background: '#111', border: '1px solid #222',
              borderRight: 'none',
              color: '#fff', fontSize: '13px',
              fontFamily: "'Inter', sans-serif",
              outline: 'none',
            }}
          />
          <button style={{
            padding: '13px 28px',
            background: 'var(--white)', color: 'var(--black)',
            border: 'none', cursor: 'pointer',
            fontSize: '10px', fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase',
            whiteSpace: 'nowrap',
          }}>Notify Me</button>
        </div>
      </div>

      {/* Main footer */}
      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '64px 40px 40px',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr',
        gap: '60px',
      }} className="footer-grid">

        {/* Brand */}
        <div>
          <div style={{ marginBottom: '24px' }}>
            <Logo variant="lockup" size={14} color="#ffffff" />
          </div>
          <p style={{ color: '#666', fontSize: '12px', lineHeight: 1.9, maxWidth: '300px', marginBottom: '24px' }}>
            Motion Sickness is a limited drop clothing brand by S55 Ventures.
            Sourced and produced through SourceFlow. Houston, TX.
            29.7604° N · 95.3698° W
          </p>
          <a
            href="https://www.instagram.com/motionsickness.s55"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '10px', fontWeight: 700, letterSpacing: '2px',
              color: 'var(--red)', textTransform: 'uppercase',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
            </svg>
            @motionsickness.s55
          </a>
        </div>

        {/* Links */}
        <div>
          <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3px', color: 'var(--grey)', textTransform: 'uppercase', marginBottom: '20px' }}>
            Navigate
          </p>
          {[
            { label: 'Shop', href: '#shop' },
            { label: 'OG Members', href: '#og-members' },
            { label: 'Our Story', href: '#story' },
            { label: 'Contact', href: '#contact' },
          ].map(l => (
            <a key={l.label} href={l.href} style={{
              display: 'block', marginBottom: '12px',
              fontSize: '12px', color: '#888',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = '#888'}
            >{l.label}</a>
          ))}
        </div>

        {/* Info */}
        <div>
          <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3px', color: 'var(--grey)', textTransform: 'uppercase', marginBottom: '20px' }}>
            Info
          </p>
          {[
            'Limited Drops Only',
            'No Restocks',
            'OG Members Free Cap',
            'Sourced by SourceFlow',
            'Est. 2024 · Houston TX',
          ].map(l => (
            <p key={l} style={{ fontSize: '12px', color: '#555', marginBottom: '10px' }}>{l}</p>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid #111',
        padding: '20px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <p style={{ fontSize: '10px', color: '#444', letterSpacing: '1px' }}>
          © 2024 Motion Sickness by S55 Ventures. All rights reserved.
        </p>
        <p style={{ fontSize: '10px', color: '#444', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Discipline Fuels Freedom
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </footer>
  )
}
