import { useState } from 'react'

const items = [
  {
    id: 'l1', name: 'S55 Polo Tank', tag: 'LADIES LINE',
    price: 85, image: '/images/ladies-polo.png',
    desc: 'Structured polo tank. S55 embroidery. Built to move.',
    placeholder: { bg: '#1a1a1a', text: '#fff' },
  },
  {
    id: 'l2', name: 'Cross-Back Sports Bra', tag: 'LADIES LINE',
    price: 65, image: '/images/ladies-bra.png',
    desc: 'Motion Sickness by S55. Sky blue. Cross-back support.',
    placeholder: { bg: '#b8d4e8', text: '#1a1a1a' },
  },
  {
    id: 'l3', name: 'Move With Motion Leggings', tag: 'LADIES LINE',
    price: 95, image: '/images/ladies-leggings.png',
    desc: 'High-waist. Sky blue. "Move With Motion" leg print.',
    placeholder: { bg: '#b8d4e8', text: '#1a1a1a' },
  },
  {
    id: 'l4', name: 'S55 Crop Track Jacket', tag: 'LADIES LINE',
    price: 110, image: '/images/ladies-jacket.png',
    desc: 'Blush pink. Full zip. Silver S55 logo. Statement piece.',
    placeholder: { bg: '#e8c8bb', text: '#1a1a1a' },
  },
  {
    id: 'l5', name: 'Motion Runner Shorts', tag: 'LADIES LINE',
    price: 70, image: '/images/ladies-shorts.png',
    desc: 'Butter yellow. S55 mark. White piping trim.',
    placeholder: { bg: '#f0e87a', text: '#1a1a1a' },
  },
]

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

function LadiesCard({ item, onInquire, onLightbox }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ background: 'var(--black-card)', border: `1px solid ${hovered ? '#333' : '#161616'}`, transition: 'border-color 0.25s', overflow: 'hidden' }}
    >
      <div
        onClick={() => onLightbox(item)}
        style={{ aspectRatio: '4/5', position: 'relative', overflow: 'hidden', background: item.placeholder.bg, cursor: 'zoom-in' }}
      >
        <img
          src={item.image} alt={item.name}
          onError={e => e.target.style.display = 'none'}
          style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover',
            transform: hovered ? 'scale(1.05)' : 'scale(1)', transition: 'transform 0.6s ease', zIndex: 1,
          }}
        />
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: item.placeholder.bg, zIndex: 0 }}>
          <p style={{ fontFamily: "'Bebas Neue'", fontSize: '11px', letterSpacing: '4px', color: item.placeholder.text, opacity: 0.3 }}>MOTION SICKNESS</p>
        </div>
        <div style={{ position: 'absolute', top: '12px', left: '12px', zIndex: 2, background: 'rgba(8,8,8,0.9)', color: '#fff', padding: '3px 10px', fontSize: '7px', fontWeight: 700, letterSpacing: '2px' }}>{item.tag}</div>
        <div style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 2, background: 'var(--red)', color: '#fff', padding: '3px 10px', fontSize: '7px', fontWeight: 700, letterSpacing: '2px' }}>LIMITED</div>
        <div style={{
          position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', zIndex: 3,
        }}>
          <button onClick={e => { e.stopPropagation(); onInquire(item) }} style={{
            background: '#fff', color: '#000', padding: '12px 32px',
            fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase',
            border: 'none', cursor: 'pointer',
          }}>Inquire</button>
        </div>
      </div>

      <div style={{ padding: '18px' }}>
        <p style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '6px' }}>
          Ladies Line · S55
        </p>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: '#fff' }}>{item.name}</h3>
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: '20px', color: '#fff' }}>${item.price}</span>
        </div>
        <p style={{ fontSize: '11px', color: '#666', marginBottom: '14px', lineHeight: 1.6 }}>{item.desc}</p>
        <button
          onClick={() => onInquire(item)}
          style={{ width: '100%', padding: '11px', background: 'transparent', border: '1px solid #2a2a2a', color: '#fff', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
          onMouseEnter={e => { e.target.style.background = '#fff'; e.target.style.color = '#000' }}
          onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = '#fff' }}
        >Inquire</button>
      </div>
    </div>
  )
}

export default function LadiesLine({ onInquire }) {
  const [lightbox, setLightbox] = useState(null)

  return (
    <section id="ladies" className="section-pad" style={{ background: 'var(--black)', padding: '100px 40px', borderTop: '1px solid #111' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '5px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Drop 001 · Women's Collection
          </p>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(48px, 8vw, 100px)',
            letterSpacing: '6px', color: '#fff', lineHeight: 0.9, marginBottom: '24px',
          }}>LADIES LINE</h2>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 'clamp(16px, 2vw, 22px)',
            fontStyle: 'italic', color: '#888', marginBottom: '32px',
          }}>Designed for women who move with purpose.</p>
          <div style={{ display: 'inline-block', background: 'var(--black-card)', border: '1px solid #1e1e1e', padding: '16px 36px', maxWidth: '520px' }}>
            <p style={{ fontSize: '12px', color: '#888', lineHeight: 1.9, fontStyle: 'italic' }}>
              "Built for performance. Worn for presence. The S55 Ladies Line moves with you — from the gym to the streets."
            </p>
          </div>
        </div>

        {/* Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2px' }}>
          {items.map(item => (
            <LadiesCard key={item.id} item={item} onInquire={onInquire || (() => {})} onLightbox={setLightbox} />
          ))}
        </div>

        {/* Notice */}
        <div style={{ marginTop: '48px', textAlign: 'center', padding: '24px', border: '1px solid #1a1a1a', background: 'var(--black-card)' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: '#555', textTransform: 'uppercase' }}>
            Ladies Line · Limited pieces · No guaranteed restock
          </p>
        </div>
      </div>

      {lightbox && <Lightbox image={lightbox.image} name={lightbox.name} onClose={() => setLightbox(null)} />}
    </section>
  )
}
