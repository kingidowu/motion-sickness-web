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
      padding: '120px 24px 80px',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Background image */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'url(/images/hero-bg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center top',
        opacity: 0.18,
        filter: 'grayscale(40%)',
      }} />
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(8,8,8,0.3) 0%, rgba(8,8,8,0.7) 60%, rgba(8,8,8,1) 100%)',
      }} />

      {/* Vertical side text */}
      <span style={{
        position: 'absolute', left: '24px', top: '50%',
        transform: 'translateY(-50%) rotate(-90deg)',
        fontSize: '8px', fontWeight: 700, letterSpacing: '4px',
        color: 'var(--red)', textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>DISCIPLINE FUELS FREEDOM</span>
      <span style={{
        position: 'absolute', right: '24px', top: '50%',
        transform: 'translateY(-50%) rotate(90deg)',
        fontSize: '8px', fontWeight: 700, letterSpacing: '4px',
        color: 'var(--red)', textTransform: 'uppercase', whiteSpace: 'nowrap',
      }}>FOCUS · PURPOSE · LIFESTYLE</span>

      {/* Content */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Logo image */}
        <div style={{ marginBottom: '40px' }}>
          <img src="/images/logo.png" alt="Motion Sickness" style={{
            width: '180px', margin: '0 auto',
            opacity: 0.95,
            mixBlendMode: 'screen',
          }} />
        </div>

        {/* Brand name */}
        <h1 style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(36px, 8vw, 96px)',
          fontWeight: 300,
          letterSpacing: 'clamp(6px, 2vw, 20px)',
          color: 'var(--white)',
          textTransform: 'uppercase',
          lineHeight: 1,
          marginBottom: '32px',
        }}>MOTION SICKNESS</h1>

        {/* Slogan */}
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(18px, 3vw, 28px)',
          fontStyle: 'italic',
          color: 'var(--grey-light)',
          marginBottom: '8px',
          letterSpacing: '1px',
        }}>Move with motion.</p>
        <p style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: 'clamp(18px, 3vw, 28px)',
          fontStyle: 'italic',
          color: 'var(--grey-light)',
          marginBottom: '48px',
          letterSpacing: '1px',
        }}>The rest will play out.</p>

        {/* Drop badge */}
        <div style={{
          display: 'inline-block',
          border: '1px solid var(--red)',
          padding: '6px 20px',
          marginBottom: '32px',
          fontSize: '9px', fontWeight: 700, letterSpacing: '4px',
          color: 'var(--red)', textTransform: 'uppercase',
        }}>DROP 001 AVAILABLE NOW</div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="#drop" style={{
            display: 'inline-block',
            background: 'var(--white)', color: 'var(--black)',
            padding: '16px 48px',
            fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
            textTransform: 'uppercase', transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.target.style.background = '#e0e0e0'}
          onMouseLeave={e => e.target.style.background = 'var(--white)'}
          >Shop Drop 001</a>

          <a href="#og-members" style={{
            display: 'inline-block',
            border: '1px solid var(--red)', color: 'var(--red)',
            padding: '16px 48px',
            fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
            textTransform: 'uppercase', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.target.style.background = 'var(--red)'; e.target.style.color = '#fff' }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = 'var(--red)' }}
          >OG Members</a>
        </div>

        {/* Subtext */}
        <p style={{
          marginTop: '40px',
          fontSize: '11px', color: '#555', letterSpacing: '2px',
          textTransform: 'uppercase',
        }}>A streetwear brand by S55 · Limited pieces · No guaranteed restock</p>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        color: '#444', fontSize: '8px', letterSpacing: '3px', textTransform: 'uppercase',
      }}>
        <span>Scroll</span>
        <div style={{ width: '1px', height: '40px', background: '#222', animation: 'pulse 2s ease-in-out infinite' }} />
        <style>{`@keyframes pulse { 0%,100%{opacity:0.2} 50%{opacity:1} }`}</style>
      </div>
    </section>
  )
}
