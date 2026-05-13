import Logo from './Logo'

const navLinks = [
  { label: 'Shop', href: '#shop' },
  { label: 'About', href: '#story' },
  { label: 'Contact', href: '#contact' },
  { label: 'Sign In / Join', href: '/login' },
  { label: 'Instagram', href: 'https://www.instagram.com/motionsickness.s55', external: true },
]

const policyLinks = [
  { label: 'Shipping Policy', href: '/shipping-policy' },
  { label: 'Refund Policy', href: '/refund-policy' },
  { label: 'Privacy Policy', href: '/privacy-policy' },
  { label: 'Terms of Service', href: '/terms' },
  { label: 'Intellectual Property', href: '/intellectual-property' },
  { label: 'Size Guide', href: '/size-guide' },
]

const linkStyle = {
  display: 'block', marginBottom: '12px',
  fontSize: '12px', color: '#888',
  textDecoration: 'none', transition: 'color 0.2s',
}

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
        <div className="email-bar" style={{ display: 'flex', gap: '0', maxWidth: '440px', margin: '0 auto' }}>
          <input
            type="email"
            placeholder="your@email.com"
            style={{
              flex: 1, padding: '13px 16px',
              background: '#111', border: '1px solid #222',
              borderRight: 'none',
              color: '#fff', fontSize: '13px',
              fontFamily: "'Inter', sans-serif",
              outline: 'none', minWidth: 0,
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

      {/* Official store notice */}
      <div style={{
        background: '#0a0a0a',
        borderBottom: '1px solid var(--black-border)',
        padding: '20px 40px',
        textAlign: 'center',
      }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: '#444', textTransform: 'uppercase' }}>
          Official Store Notice
        </p>
        <p style={{ fontSize: '11px', color: '#333', marginTop: '6px', lineHeight: 1.7 }}>
          This is the official online store for Motion Sickness by S55. Any other website, seller, or page using our images,
          logos, designs, or product content without permission is not authorized.
        </p>
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
          <p style={{ color: '#666', fontSize: '12px', lineHeight: 1.9, maxWidth: '300px', marginBottom: '16px' }}>
            Motion Sickness is a limited drop clothing brand by S55 LLC.
            Sourced and produced through Flowsource. Houston, TX.
            29.7604° N · 95.3698° W
          </p>
          <p style={{ color: '#444', fontSize: '11px', lineHeight: 1.8, maxWidth: '320px', marginBottom: '24px' }}>
            All logos, graphics, product images, designs, slogans, product names, and brand assets on this website
            are owned by Motion Sickness by S55. No content may be copied, reproduced, modified, sold, or used
            without written permission.
          </p>
          <a
            href="https://www.instagram.com/motionsickness.s55"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '8px',
              fontSize: '10px', fontWeight: 700, letterSpacing: '2px',
              color: 'var(--red)', textTransform: 'uppercase',
              textDecoration: 'none',
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

        {/* Navigate */}
        <div>
          <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3px', color: 'var(--grey)', textTransform: 'uppercase', marginBottom: '20px' }}>
            Navigate
          </p>
          {navLinks.map(l => (
            <a
              key={l.label}
              href={l.href}
              target={l.external ? '_blank' : undefined}
              rel={l.external ? 'noopener noreferrer' : undefined}
              style={linkStyle}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = '#888'}
            >{l.label}</a>
          ))}
        </div>

        {/* Legal */}
        <div>
          <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3px', color: 'var(--grey)', textTransform: 'uppercase', marginBottom: '20px' }}>
            Legal
          </p>
          {policyLinks.map(l => (
            <a
              key={l.label}
              href={l.href}
              style={linkStyle}
              onMouseEnter={e => e.target.style.color = '#fff'}
              onMouseLeave={e => e.target.style.color = '#888'}
            >{l.label}</a>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div style={{
        borderTop: '1px solid #111',
        padding: '24px 40px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '12px',
      }}>
        <div>
          <p style={{ fontSize: '11px', fontWeight: 600, color: '#555', letterSpacing: '1px', marginBottom: '4px' }}>
            Official Motion Sickness by S55 Store
          </p>
          <p style={{ fontSize: '10px', color: '#333', letterSpacing: '1px' }}>
            © 2026 Motion Sickness by S55. All rights reserved.
          </p>
        </div>
        <p style={{ fontSize: '10px', color: '#444', letterSpacing: '2px', textTransform: 'uppercase' }}>
          Discipline Fuels Freedom
        </p>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .footer-grid { grid-template-columns: 1fr !important; gap: 40px !important; padding: 40px 20px !important; }
          .email-bar { max-width: 100% !important; flex-direction: column; }
          .email-bar input { border-right: 1px solid #222 !important; border-bottom: none !important; }
        }
      `}</style>
    </footer>
  )
}
