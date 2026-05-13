import { useState } from 'react'
import Logo from './Logo'

function Lightbox({ image, name, onClose }) {
  const [scale, setScale] = useState(1)
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.95)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'zoom-out' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '24px', right: '32px', background: 'none', border: 'none', color: '#fff', fontSize: '28px', cursor: 'pointer', zIndex: 2 }}>✕</button>
      <div style={{ position: 'absolute', bottom: '32px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '12px', zIndex: 2 }}>
        <button onClick={e => { e.stopPropagation(); setScale(s => Math.max(1, s - 0.5)) }} style={{ background: '#222', border: '1px solid #333', color: '#fff', width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer' }}>−</button>
        <button onClick={e => { e.stopPropagation(); setScale(s => Math.min(3, s + 0.5)) }} style={{ background: '#222', border: '1px solid #333', color: '#fff', width: '36px', height: '36px', fontSize: '18px', cursor: 'pointer' }}>+</button>
      </div>
      <img src={image} alt={name} onClick={e => e.stopPropagation()} style={{ maxWidth: '90vw', maxHeight: '90vh', objectFit: 'contain', transform: `scale(${scale})`, transition: 'transform 0.2s ease' }} />
    </div>
  )
}

export default function OGMembers({ onInquire }) {
  const [lightbox, setLightbox] = useState(null)
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

        {/* Right — OG Members promo */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {/* Full promo image */}
          <div onClick={() => setLightbox({ image: '/images/ladies-tank.png', name: 'OG Members' })} style={{
            background: '#1a1a1a',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'zoom-in',
            borderRadius: '2px',
          }}>
            <img src="/images/ladies-tank.png" alt="OG Members" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{
              position: 'absolute', top: '12px', left: '12px',
              background: 'var(--black)', color: 'var(--white)',
              padding: '3px 8px',
              fontSize: '8px', fontWeight: 700, letterSpacing: '2px',
            }}>OG MEMBERS</div>
            <div style={{
              position: 'absolute', bottom: '12px', right: '12px',
              background: 'var(--red)', color: 'var(--white)',
              padding: '3px 8px',
              fontSize: '8px', fontWeight: 700, letterSpacing: '2px',
            }}>FREE 99</div>
          </div>

          {/* Cap colorways */}
          <div onClick={() => setLightbox({ image: '/images/cap-og.png', name: 'OG Members Cap — All Colorways' })} style={{
            background: '#0d0d0d',
            position: 'relative',
            overflow: 'hidden',
            cursor: 'zoom-in',
            borderRadius: '2px',
            marginTop: '2px',
          }}>
            <img src="/images/cap-og.png" alt="OG Members Cap — 5 Colorways" style={{ width: '100%', objectFit: 'cover', display: 'block' }} />
            <div style={{
              position: 'absolute', top: '12px', left: '12px',
              background: 'var(--black)', color: 'var(--white)',
              padding: '3px 8px',
              fontSize: '8px', fontWeight: 700, letterSpacing: '2px',
            }}>5 COLORWAYS</div>
            <div style={{
              position: 'absolute', bottom: '12px', left: '12px',
              background: 'rgba(0,0,0,0.7)', color: 'var(--white)',
              padding: '3px 8px',
              fontSize: '8px', letterSpacing: '2px',
            }}>OG MEMBERS CAP · 001</div>
          </div>

          {/* Bottom tagline */}
          <div style={{
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
          .og-grid { grid-template-columns: 1fr !important; gap: 40px !important; padding: 48px 20px !important; }
        }
      `}</style>

      {lightbox && <Lightbox image={lightbox.image} name={lightbox.name} onClose={() => setLightbox(null)} />}
    </section>
  )
}
