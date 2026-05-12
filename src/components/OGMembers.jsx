import Logo from './Logo'

export default function OGMembers({ onInquire }) {
  return (
    <section id="og-members" style={{
      background: 'var(--black)',
      borderTop: '1px solid var(--black-border)',
      borderBottom: '1px solid var(--black-border)',
      overflow: 'hidden',
    }}>
      {/* Banner strip */}
      <div style={{
        background: 'var(--red)',
        padding: '10px',
        textAlign: 'center',
        fontSize: '10px', fontWeight: 700, letterSpacing: '4px',
        textTransform: 'uppercase', color: 'var(--white)',
      }}>
        Original Members · Never Replicated · Joy Is Coming ♥
      </div>

      <div style={{
        maxWidth: '1200px', margin: '0 auto',
        padding: '80px 40px',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '80px',
        alignItems: 'center',
      }} className="og-grid">

        {/* Left — text */}
        <div>
          <p style={{
            fontSize: '10px', fontWeight: 700, letterSpacing: '4px',
            color: 'var(--red)', textTransform: 'uppercase', marginBottom: '16px',
          }}>Free Cap Program · OG Members First</p>

          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(48px, 7vw, 88px)',
            letterSpacing: '2px',
            color: 'var(--white)',
            lineHeight: 0.95,
            marginBottom: '24px',
          }}>
            OG<br />MEMBERS<br />FIRST
          </h2>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
            <div style={{ width: '40px', height: '1px', background: 'var(--red)' }} />
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase' }}>
              Cap + Ladies Tank Top
            </p>
          </div>

          <p style={{ color: '#999', fontSize: '14px', lineHeight: 1.8, marginBottom: '32px', maxWidth: '420px' }}>
            The first caps go to our original members — friends, family, and the first supporters of the brand.
            If you're our people, you go collect. Every colorway has its own original member version.
            Numbered <strong style={{ color: 'var(--white)' }}>001/OG</strong>. Limited. Personal. Original.
          </p>

          {/* Feature list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '40px' }}>
            {[
              'First caps go to our original members',
              'Each founder gifts caps to close supporters',
              'Every colorway has its own OG version',
              'Special 001 numbering — distinctive detail',
              'Free for original members · FREE 99',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
                <Logo variant="mark" size={14} color="#CC0000" />
                <span style={{ fontSize: '12px', color: '#bbb', letterSpacing: '0.5px' }}>{item}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <button
              onClick={() => onInquire && onInquire({ name: 'OG Member Pack', subtitle: 'Cap + Ladies Tank Top', tag: 'OG MEMBERS FIRST', category: 'accessories' })}
              style={{
                background: 'var(--white)', color: 'var(--black)',
                padding: '14px 36px',
                fontSize: '10px', fontWeight: 700, letterSpacing: '3px',
                textTransform: 'uppercase', border: 'none', cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseEnter={e => e.target.style.background = 'var(--cream)'}
              onMouseLeave={e => e.target.style.background = 'var(--white)'}
            >Claim Your OG Pack</button>

            <button
              onClick={() => document.getElementById('contact').scrollIntoView({ behavior: 'smooth' })}
              style={{
                background: 'transparent', color: 'var(--white)',
                padding: '14px 36px',
                fontSize: '10px', fontWeight: 700, letterSpacing: '3px',
                textTransform: 'uppercase', border: '1px solid #333', cursor: 'pointer',
              }}
            >Inquire</button>
          </div>
        </div>

        {/* Right — product display cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px' }}>
          {/* Cap card */}
          <div style={{
            background: '#D4C5A0',
            aspectRatio: '3/4',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '24px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: '12px', left: '12px',
              background: 'var(--black)', color: 'var(--white)',
              padding: '3px 8px',
              fontSize: '8px', fontWeight: 700, letterSpacing: '2px',
            }}>OG CAP</div>
            <Logo variant="mark" size={56} color="#1a1a1a" />
            <p style={{
              marginTop: '16px', fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '12px', letterSpacing: '3px', color: '#1a1a1a',
            }}>CREAM / RED BRIM</p>
            <p style={{ fontSize: '9px', color: '#555', letterSpacing: '1px', marginTop: '4px' }}>S55 EMBROIDERED</p>
            <div style={{
              position: 'absolute', bottom: '12px', right: '12px',
              background: 'var(--red)', color: 'var(--white)',
              padding: '3px 8px',
              fontSize: '8px', fontWeight: 700, letterSpacing: '2px',
            }}>001/OG</div>
          </div>

          {/* Tank top card */}
          <div style={{
            background: '#F2EFE4',
            aspectRatio: '3/4',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            padding: '24px',
            position: 'relative',
          }}>
            <div style={{
              position: 'absolute', top: '12px', left: '12px',
              background: 'var(--black)', color: 'var(--white)',
              padding: '3px 8px',
              fontSize: '8px', fontWeight: 700, letterSpacing: '2px',
            }}>LADIES TANK</div>
            <Logo variant="s55" size={56} color="#CC0000" />
            <p style={{
              marginTop: '8px', fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '12px', letterSpacing: '3px', color: '#1a1a1a',
            }}>CREAM / BLACK</p>
            <p style={{ fontSize: '9px', color: '#555', letterSpacing: '1px', marginTop: '4px' }}>FOR THE LADIES</p>
            <div style={{
              position: 'absolute', bottom: '12px', right: '12px',
              background: 'var(--red)', color: 'var(--white)',
              padding: '3px 8px',
              fontSize: '8px', fontWeight: 700, letterSpacing: '2px',
            }}>FREE 99</div>
          </div>

          {/* Bottom tagline card — full width */}
          <div style={{
            gridColumn: '1 / -1',
            background: 'var(--black-card)',
            border: '1px solid #1a1a1a',
            padding: '20px',
            display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
            textAlign: 'center',
          }}>
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '20px', letterSpacing: '4px', color: 'var(--white)',
            }}>ORIGINAL MEMBERS. NEVER REPLICATED.</p>
            <p style={{ fontSize: '9px', color: 'var(--grey)', letterSpacing: '3px', textTransform: 'uppercase' }}>
              Designed for the first supporters of the brand
            </p>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .og-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        }
      `}</style>
    </section>
  )
}
