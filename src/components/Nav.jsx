import { useState, useEffect } from 'react'
import Logo from './Logo'

export default function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const links = [
    { label: 'Shop', href: '#shop' },
    { label: 'OG Members', href: '#og-members' },
    { label: 'Our Story', href: '#story' },
    { label: 'Contact', href: '#contact' },
  ]

  return (
    <>
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 40px', height: '68px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(8,8,8,0.97)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid #1a1a1a' : 'none',
        transition: 'all 0.4s ease',
      }}>
        {/* Logo */}
        <a href="#" style={{ display: 'flex', alignItems: 'center', gap: '10px', textDecoration: 'none' }}>
          <Logo variant="mark" size={22} color="#ffffff" />
          <span className="nav-brand" style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: '13px', fontWeight: 300,
            letterSpacing: '6px', color: '#ffffff',
            textTransform: 'uppercase',
          }}>MOTION SICKNESS</span>
        </a>

        {/* Desktop nav */}
        <div style={{ display: 'flex', gap: '36px', alignItems: 'center' }} className="nav-desktop">
          {links.map(l => (
            <a key={l.label} href={l.href} style={{
              fontSize: '10px', fontWeight: 600, letterSpacing: '2px',
              textTransform: 'uppercase', color: '#888',
              transition: 'color 0.2s',
            }}
            onMouseEnter={e => e.target.style.color = '#fff'}
            onMouseLeave={e => e.target.style.color = '#888'}
            >{l.label}</a>
          ))}
          <a
            href="https://www.instagram.com/motionsickness.s55"
            target="_blank" rel="noopener noreferrer"
            style={{
              fontSize: '10px', fontWeight: 600, letterSpacing: '2px',
              textTransform: 'uppercase', color: 'var(--red)',
              display: 'flex', alignItems: 'center', gap: '6px',
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

        {/* Mobile hamburger */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          style={{ display: 'none', flexDirection: 'column', gap: '5px', padding: '4px', background: 'none', border: 'none', cursor: 'pointer' }}
          className="nav-mobile-btn"
        >
          <span style={{ width: '24px', height: '1px', background: menuOpen ? '#CC0000' : 'white', display: 'block', transition: 'transform 0.2s', transform: menuOpen ? 'rotate(45deg) translate(4px, 4px)' : 'none' }} />
          <span style={{ width: '24px', height: '1px', background: menuOpen ? '#CC0000' : 'white', display: 'block', opacity: menuOpen ? 0 : 1, transition: 'opacity 0.2s' }} />
          <span style={{ width: menuOpen ? '24px' : '16px', height: '1px', background: menuOpen ? '#CC0000' : 'white', display: 'block', transition: 'transform 0.2s, width 0.2s', transform: menuOpen ? 'rotate(-45deg) translate(4px, -3px)' : 'none' }} />
        </button>
      </nav>

      {/* Mobile menu */}
      {menuOpen && (
        <div style={{
          position: 'fixed', top: '68px', left: 0, right: 0, zIndex: 99,
          background: 'rgba(8,8,8,0.98)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #1a1a1a',
          padding: '32px 40px',
          display: 'flex', flexDirection: 'column', gap: '24px',
        }}>
          {links.map(l => (
            <a key={l.label} href={l.href}
              onClick={() => setMenuOpen(false)}
              style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#fff' }}
            >{l.label}</a>
          ))}
          <a href="https://www.instagram.com/motionsickness.s55" target="_blank" rel="noopener noreferrer"
            style={{ fontSize: '13px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: 'var(--red)' }}>
            @motionsickness.s55
          </a>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile-btn { display: flex !important; }
          .nav-brand { font-size: 10px !important; letter-spacing: 3px !important; }
        }
      `}</style>
    </>
  )
}
