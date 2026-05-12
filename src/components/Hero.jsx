import Logo from './Logo'

export default function Hero() {
  return (
    <section style={{
      minHeight: '100vh',
      background: 'var(--black)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      padding: '100px 24px 60px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background texture overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'radial-gradient(ellipse at 50% 0%, rgba(204,0,0,0.08) 0%, transparent 60%)',
        pointerEvents: 'none',
      }} />

      {/* Vertical text left */}
      <span style={{
        position: 'absolute', left: '24px', top: '50%',
        transform: 'translateY(-50%) rotate(-90deg)',
        fontSize: '9px', fontWeight: 600, letterSpacing: '4px',
        color: 'var(--red)', textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>DISCIPLINE FUELS FREEDOM</span>

      {/* Vertical text right */}
      <span style={{
        position: 'absolute', right: '24px', top: '50%',
        transform: 'translateY(-50%) rotate(90deg)',
        fontSize: '9px', fontWeight: 600, letterSpacing: '4px',
        color: 'var(--red)', textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>FOCUS · PURPOSE · LIFESTYLE</span>

      {/* Logo mark */}
      <div style={{ marginBottom: '32px' }}>
        <Logo size={80} color="#ffffff" />
      </div>

      {/* Brand name */}
      <p style={{
        fontSize: '11px', fontWeight: 600, letterSpacing: '6px',
        color: 'var(--grey)', textTransform: 'uppercase', marginBottom: '48px',
      }}>MOTION SICKNESS</p>

      {/* Red divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '40px' }}>
        <div style={{ width: '60px', height: '1px', background: 'var(--red)' }} />
        <Logo size={14} color="#CC0000" />
        <div style={{ width: '60px', height: '1px', background: 'var(--red)' }} />
      </div>

      {/* Main manifesto */}
      <div style={{ marginBottom: '16px' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(64px, 12vw, 140px)',
          fontWeight: 600,
          lineHeight: 0.9,
          letterSpacing: '-2px',
          color: 'var(--white)',
        }}>
          WORK<br />HARD
        </h1>
      </div>

      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 'clamp(28px, 4vw, 48px)',
        letterSpacing: '6px',
        color: 'var(--red)',
        marginBottom: '16px',
      }}>✕</div>

      <div style={{ marginBottom: '16px' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(64px, 12vw, 140px)',
          fontWeight: 600,
          lineHeight: 0.9,
          letterSpacing: '-2px',
          color: 'var(--white)',
        }}>
          PLAY<br />HARDER
        </h1>
      </div>

      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 'clamp(28px, 4vw, 48px)',
        letterSpacing: '6px',
        color: 'var(--red)',
        marginBottom: '16px',
      }}>=</div>

      <div style={{ marginBottom: '48px' }}>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(64px, 12vw, 140px)',
          fontWeight: 600,
          lineHeight: 0.9,
          letterSpacing: '-2px',
          color: 'var(--white)',
        }}>
          BALANCE
        </h1>
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px' }}>
        <div style={{ width: '60px', height: '1px', background: 'var(--red)' }} />
        <Logo size={14} color="#CC0000" />
        <div style={{ width: '60px', height: '1px', background: 'var(--red)' }} />
      </div>

      <p style={{
        fontSize: '10px', fontWeight: 600, letterSpacing: '4px',
        color: 'var(--grey)', textTransform: 'uppercase',
        marginBottom: '40px',
      }}>DISCIPLINE FUELS FREEDOM</p>

      {/* CTA buttons */}
      <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <a href="#shop" style={{
          display: 'inline-block',
          background: 'var(--white)',
          color: 'var(--black)',
          padding: '14px 40px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          transition: 'background 0.2s',
        }}
        onMouseEnter={e => e.target.style.background = 'var(--cream)'}
        onMouseLeave={e => e.target.style.background = 'var(--white)'}
        >Shop Now</a>

        <a href="#og-members" style={{
          display: 'inline-block',
          border: '1px solid var(--red)',
          color: 'var(--red)',
          padding: '14px 40px',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '3px',
          textTransform: 'uppercase',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.target.style.background = 'var(--red)'; e.target.style.color = 'var(--white)' }}
        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--red)' }}
        >OG Members</a>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        color: 'var(--grey)', fontSize: '9px', letterSpacing: '3px', textTransform: 'uppercase',
      }}>
        <span>Scroll</span>
        <div style={{ width: '1px', height: '40px', background: 'var(--black-border)', animation: 'scrollPulse 2s ease-in-out infinite' }} />
        <style>{`
          @keyframes scrollPulse {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 1; }
          }
        `}</style>
      </div>
    </section>
  )
}
