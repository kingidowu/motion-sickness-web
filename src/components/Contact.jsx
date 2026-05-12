import Logo from './Logo'

export default function Contact() {
  return (
    <section id="contact" style={{
      background: 'var(--black-card)',
      borderTop: '1px solid var(--black-border)',
      padding: '100px 40px',
    }}>
      <div style={{ maxWidth: '900px', margin: '0 auto', textAlign: 'center' }}>
        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '4px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '16px' }}>
          Get In Touch
        </p>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(40px, 7vw, 80px)',
          letterSpacing: '3px', color: 'var(--white)', lineHeight: 1, marginBottom: '20px',
        }}>MOVE WITH MOTION</h2>
        <p style={{ color: '#777', fontSize: '14px', lineHeight: 1.9, maxWidth: '480px', margin: '0 auto 56px' }}>
          Questions about the drop, OG member status, wholesale, or collabs?
          Reach out. We move fast.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', marginBottom: '56px' }} className="contact-cards">
          {[
            { label: 'General Inquiries', sub: 'Orders, sizing, availability', icon: '✦' },
            { label: 'OG Members', sub: 'Claim your free cap + tank top', icon: '✦' },
            { label: 'Collabs & Press', sub: 'Partnerships and brand work', icon: '✦' },
          ].map(card => (
            <div key={card.label} style={{
              background: 'var(--black)',
              border: '1px solid var(--black-border)',
              padding: '28px 24px',
              textAlign: 'center',
            }}>
              <p style={{ fontSize: '12px', color: 'var(--red)', marginBottom: '8px' }}>{card.icon}</p>
              <p style={{ fontSize: '12px', fontWeight: 600, color: 'var(--white)', marginBottom: '6px' }}>{card.label}</p>
              <p style={{ fontSize: '11px', color: '#666' }}>{card.sub}</p>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
          <a
            href="https://www.instagram.com/motionsickness.s55"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '12px',
              background: 'var(--red)', color: 'var(--white)',
              padding: '16px 48px',
              fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase',
              transition: 'background 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = 'var(--red-dark)'}
            onMouseLeave={e => e.currentTarget.style.background = 'var(--red)'}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor"/>
            </svg>
            DM Us on Instagram
          </a>
          <p style={{ fontSize: '11px', color: '#555' }}>
            @motionsickness.s55 · Houston, TX · 29.7604° N 95.3698° W
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .contact-cards { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </section>
  )
}
