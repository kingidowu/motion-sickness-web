import { useState } from 'react'

const items = [
  {
    id: 1, name: 'Core Tee', tag: 'DROP 001',
    price: 75, image: '/images/tee-heritage.png',
    desc: 'Built for movement, presence, and everyday wear.',
    placeholder: { bg: '#f0ebe0', text: '#1a1a1a' },
  },
  {
    id: 2, name: 'World Championship Tee', tag: 'DROP 001',
    price: 80, image: '/images/tee-racing.png',
    desc: 'Motion Sickness identity. S55 Racing detail.',
    placeholder: { bg: '#1a1a1a', text: '#F2EFE4' },
  },
  {
    id: 3, name: 'Houston Collegiate Tee', tag: 'DROP 001',
    price: 70, image: '/images/tee-houston.png',
    desc: 'Move With Motion. Designed in Houston.',
    placeholder: { bg: '#c9c9c9', text: '#132B57' },
  },
  {
    id: 4, name: 'Sailing Club Tee', tag: 'DROP 001',
    price: 75, image: '/images/tee-sailing.png',
    desc: 'Members In Motion. 29.7604° N · 95.3698° W.',
    placeholder: { bg: '#F2EFE4', text: '#142B40' },
  },
  {
    id: 5, name: 'Property Of MS Tee', tag: 'DROP 001',
    price: 85, image: '/images/tee-property.png',
    desc: 'Property of Motion Sickness. Studio 55.',
    placeholder: { bg: '#2a2a2a', text: '#ffffff' },
  },
  {
    id: 6, name: 'Ringer Tee', tag: 'DROP 001',
    price: 65, image: '/images/tee-ringer.png',
    desc: 'Clean. Bold. Motion Sickness by S55.',
    placeholder: { bg: '#ffffff', text: '#CC0000' },
  },
]

function DropCard({ item, onInquire }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: 'var(--black-card)', border: `1px solid ${hovered ? '#333' : '#161616'}`, transition: 'border-color 0.25s', overflow: 'hidden' }}
    >
      <div style={{ aspectRatio: '4/5', position: 'relative', overflow: 'hidden', background: item.placeholder.bg }}>
        <img src={item.image} alt={item.name} onError={e => e.target.style.display = 'none'}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.6s ease', zIndex: 1 }}
        />
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: item.placeholder.bg, zIndex: 0,
        }}>
          <p style={{ fontFamily: "'Bebas Neue'", fontSize: '11px', letterSpacing: '4px', color: item.placeholder.text, opacity: 0.3 }}>MOTION SICKNESS</p>
        </div>
        <div style={{
          position: 'absolute', top: '12px', left: '12px', zIndex: 2,
          background: 'rgba(8,8,8,0.9)', color: '#fff',
          padding: '3px 10px', fontSize: '7px', fontWeight: 700, letterSpacing: '2px',
        }}>{item.tag}</div>
        <div style={{
          position: 'absolute', top: '12px', right: '12px', zIndex: 2,
          background: 'var(--red)', color: '#fff',
          padding: '3px 10px', fontSize: '7px', fontWeight: 700, letterSpacing: '2px',
        }}>LIMITED</div>
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', zIndex: 3,
        }}>
          <button onClick={() => onInquire(item)} style={{
            background: '#fff', color: '#000', padding: '12px 32px',
            fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase',
            border: 'none', cursor: 'pointer',
          }}>Buy from Drop 001</button>
        </div>
      </div>

      <div style={{ padding: '18px' }}>
        <p style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '6px' }}>
          Drop 001 · Core Collection
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{item.name}</h3>
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: '20px', color: '#fff' }}>${item.price}</span>
        </div>
        <p style={{ fontSize: '11px', color: '#666', marginBottom: '14px', lineHeight: 1.6 }}>{item.desc}</p>
        <button onClick={() => onInquire(item)} style={{
          width: '100%', padding: '11px',
          background: 'transparent', border: '1px solid #2a2a2a',
          color: '#fff', fontSize: '9px', fontWeight: 700,
          letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
          transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.target.style.background = '#fff'; e.target.style.color = '#000' }}
        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#fff' }}
        >Buy from Drop 001</button>
      </div>
    </div>
  )
}

export default function Drop({ onInquire }) {
  return (
    <section id="drop" style={{ background: 'var(--black)', padding: '100px 40px', borderTop: '1px solid #111' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Drop header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '5px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Now Available
          </p>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(56px, 10vw, 120px)',
            letterSpacing: '6px', color: '#fff', lineHeight: 0.9, marginBottom: '24px',
          }}>DROP 001</h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(18px, 2.5vw, 26px)',
            fontStyle: 'italic', color: '#888', marginBottom: '12px',
          }}>Motion Sickness Core Collection</p>
          <p style={{ fontSize: '12px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '32px' }}>
            Limited release · No guaranteed restock
          </p>
          <div style={{
            display: 'inline-block',
            background: 'var(--black-card)', border: '1px solid #1e1e1e',
            padding: '20px 40px', maxWidth: '560px',
          }}>
            <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.9, fontStyle: 'italic' }}>
              "The first Motion Sickness release. Built around the original message: Move with motion. The rest will play out. Once this drop sells out, restock is not guaranteed."
            </p>
          </div>
        </div>

        {/* Product grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '2px',
        }}>
          {items.map(item => (
            <DropCard key={item.id} item={item} onInquire={onInquire || (() => {})} />
          ))}
        </div>

        {/* Bottom notice */}
        <div style={{
          marginTop: '48px', textAlign: 'center',
          padding: '24px', border: '1px solid #1a1a1a',
          background: 'var(--black-card)',
        }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: '#555', textTransform: 'uppercase' }}>
            Once Drop 001 sells out — the next drop is 2 months away. No exceptions.
          </p>
        </div>
      </div>
    </section>
  )
}
