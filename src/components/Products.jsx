import { useState } from 'react'
import Logo from './Logo'

const collections = [
  { id: 'all', label: 'All' },
  { id: 'tees', label: 'Tees' },
  { id: 'jerseys', label: 'Jerseys' },
  { id: 'womens', label: "Women's" },
  { id: 'accessories', label: 'Accessories' },
]

const products = [
  {
    id: 1,
    name: 'Heritage Crest Tee',
    subtitle: 'Design 01 · Core Collection',
    category: 'tees',
    price: 75,
    tag: 'CORE COLLECTION',
    color: 'Off-White',
    drop: 100,
    details: ['Oversized', '280 GSM Cotton', 'Garment Washed'],
    image: '/images/tee-heritage.jpg',
    placeholder: { bg: '#f0ebe0', text: '#1a1a1a' },
  },
  {
    id: 2,
    name: 'World Championship Tee',
    subtitle: 'Design 02 · Racing',
    category: 'tees',
    price: 80,
    tag: 'LIMITED DROP',
    color: 'Vintage Black',
    drop: 100,
    details: ['Oversized', 'Heavyweight Cotton', 'Vintage Wash'],
    image: '/images/tee-racing.jpg',
    placeholder: { bg: '#1a1a1a', text: '#F2EFE4' },
  },
  {
    id: 3,
    name: 'Studio 55 Houston Tee',
    subtitle: 'Design 03 · Collegiate',
    category: 'tees',
    price: 70,
    tag: 'CORE COLLECTION',
    color: 'Heather Grey',
    drop: 150,
    details: ['Oversized', 'Heavyweight Cotton'],
    image: '/images/tee-houston.jpg',
    placeholder: { bg: '#c9c9c9', text: '#132B57' },
  },
  {
    id: 4,
    name: 'Sailing Club Tee',
    subtitle: 'Design 04 · Nautical',
    category: 'tees',
    price: 75,
    tag: 'LIMITED DROP',
    color: 'Cream',
    drop: 100,
    details: ['Oversized', 'Heavyweight Cotton'],
    image: '/images/tee-sailing.jpg',
    placeholder: { bg: '#F2EFE4', text: '#142B40' },
  },
  {
    id: 5,
    name: 'Property Of MS Tee',
    subtitle: 'Design 05 · Utility',
    category: 'tees',
    price: 85,
    tag: 'LIMITED DROP',
    color: 'Charcoal Black',
    drop: 100,
    details: ['Wide Box Fit', '255 GSM', 'Garment Dyed'],
    image: '/images/tee-property.jpg',
    placeholder: { bg: '#2a2a2a', text: '#ffffff' },
  },
  {
    id: 6,
    name: 'Ringer Tee',
    subtitle: 'Design 06 · Classic',
    category: 'tees',
    price: 65,
    tag: 'CORE COLLECTION',
    color: 'White / Red',
    drop: 150,
    details: ['Oversized', '250 GSM', 'Ringer Collar & Cuffs'],
    image: '/images/tee-ringer.jpg',
    placeholder: { bg: '#ffffff', text: '#CC0000' },
  },
  {
    id: 7,
    name: 'Studio 55 Jersey',
    subtitle: 'Colorway A — Navy / Red / White',
    category: 'jerseys',
    price: 120,
    tag: 'LIMITED EDITION',
    color: 'Navy',
    drop: 55,
    details: ['100% Polyester', 'Sublimation Print'],
    image: '/images/jersey-navy.jpg',
    placeholder: { bg: '#132B57', text: '#ffffff' },
  },
  {
    id: 8,
    name: 'Studio 55 Jersey',
    subtitle: 'Colorway B — Black / Red / Cream',
    category: 'jerseys',
    price: 120,
    tag: 'LIMITED EDITION',
    color: 'Black / Red / Cream',
    drop: 55,
    details: ['100% Polyester', 'Sublimation Print'],
    image: '/images/jersey-black.jpg',
    placeholder: { bg: '#111111', text: '#F2EFE4' },
  },
  {
    id: 9,
    name: 'Studio 55 Jersey',
    subtitle: 'Colorway C — Cream / Green',
    category: 'jerseys',
    price: 120,
    tag: 'LIMITED EDITION',
    color: 'Cream / Green',
    drop: 55,
    details: ['100% Polyester', 'Sublimation Print'],
    image: '/images/jersey-cream.jpg',
    placeholder: { bg: '#F2EFE4', text: '#1a3a1a' },
  },
  {
    id: 10,
    name: 'Ladies Tank Top',
    subtitle: 'OG Members First',
    category: 'womens',
    price: 55,
    tag: 'OG MEMBERS FIRST',
    color: 'Cream',
    drop: 100,
    details: ['Ribbed Fabric', 'S55 Chest Logo'],
    image: '/images/ladies-tank.jpg',
    placeholder: { bg: '#F2EFE4', text: '#CC0000' },
  },
  {
    id: 11,
    name: "Women's Athletic Set",
    subtitle: 'Sports Bra + Leggings',
    category: 'womens',
    price: 105,
    tag: "WOMEN'S LINE",
    color: 'Multiple Colorways',
    drop: 100,
    details: ['High Performance', 'MS Logo Mark'],
    image: '/images/athletic-set.jpg',
    placeholder: { bg: '#1a1a1a', text: '#ffffff' },
  },
  {
    id: 12,
    name: 'S55 Cap',
    subtitle: 'Original Members Edition',
    category: 'accessories',
    price: 55,
    ogFree: true,
    tag: 'OG MEMBERS FREE',
    color: 'Cream / Red Brim',
    drop: 55,
    details: ['Embroidered S55 Logo', 'OG Numbered'],
    image: '/images/cap-og.jpg',
    placeholder: { bg: '#D4C5A0', text: '#1a1a1a' },
  },
]

function ProductCard({ product, onInquire }) {
  const [hovered, setHovered] = useState(false)

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: 'var(--black-card)',
        border: `1px solid ${hovered ? '#2a2a2a' : 'var(--black-border)'}`,
        transition: 'border-color 0.25s',
        overflow: 'hidden',
      }}
    >
      <div style={{
        aspectRatio: '4/5',
        position: 'relative',
        overflow: 'hidden',
        background: product.placeholder.bg,
      }}>
        <img
          src={product.image}
          alt={product.name}
          onError={e => { e.target.style.display = 'none' }}
          style={{
            position: 'absolute', inset: 0,
            width: '100%', height: '100%', objectFit: 'cover',
            transform: hovered ? 'scale(1.05)' : 'scale(1)',
            transition: 'transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            zIndex: 1,
          }}
        />
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          background: product.placeholder.bg,
          zIndex: 0,
        }}>
          <Logo variant="mark" size={52} color={product.placeholder.text} />
          <p style={{
            marginTop: '14px',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '11px', letterSpacing: '4px',
            color: product.placeholder.text, opacity: 0.35,
          }}>MOTION SICKNESS</p>
        </div>

        <div style={{
          position: 'absolute', top: '14px', left: '14px',
          background: product.tag.includes('OG') ? 'var(--red)' : 'rgba(8,8,8,0.88)',
          color: 'var(--white)', padding: '4px 10px',
          fontSize: '7px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
          zIndex: 2,
        }}>{product.tag}</div>

        <div style={{
          position: 'absolute', top: '14px', right: '14px',
          background: 'rgba(8,8,8,0.88)', color: '#888', padding: '4px 10px',
          fontSize: '7px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
          zIndex: 2,
        }}>{product.drop} PCS</div>

        <div style={{
          position: 'absolute', inset: 0,
          background: 'rgba(0,0,0,0.55)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', zIndex: 3,
        }}>
          <button onClick={() => onInquire(product)} style={{
            background: 'var(--white)', color: 'var(--black)',
            padding: '12px 32px', fontSize: '9px', fontWeight: 700,
            letterSpacing: '3px', textTransform: 'uppercase', border: 'none', cursor: 'pointer',
          }}>{product.ogFree ? 'Claim Free' : 'Order Now'}</button>
        </div>
      </div>

      <div style={{ padding: '16px 18px' }}>
        <p style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '2px', color: 'var(--grey)', textTransform: 'uppercase', marginBottom: '5px' }}>
          {product.subtitle}
        </p>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: '4px' }}>
          <h3 style={{ fontSize: '14px', fontWeight: 600, color: 'var(--white)' }}>{product.name}</h3>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px',
            color: product.ogFree ? 'var(--red)' : 'var(--white)', letterSpacing: '1px',
          }}>{product.ogFree ? 'FREE' : `$${product.price}`}</span>
        </div>
        <p style={{ fontSize: '10px', color: '#555', marginBottom: '12px' }}>{product.color}</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
          {product.details.map(d => (
            <span key={d} style={{
              fontSize: '7px', padding: '3px 7px',
              border: '1px solid #1e1e1e', color: '#666',
            }}>{d}</span>
          ))}
        </div>
        <button onClick={() => onInquire(product)} style={{
          width: '100%', padding: '10px', background: 'transparent',
          border: `1px solid ${product.ogFree ? 'var(--red)' : '#2a2a2a'}`,
          color: product.ogFree ? 'var(--red)' : 'var(--white)',
          fontSize: '9px', fontWeight: 700, letterSpacing: '2px',
          textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
        }}
        onMouseEnter={e => { e.target.style.background = product.ogFree ? 'var(--red)' : 'var(--white)'; e.target.style.color = product.ogFree ? 'var(--white)' : 'var(--black)' }}
        onMouseLeave={e => { e.target.style.background = 'transparent'; e.target.style.color = product.ogFree ? 'var(--red)' : 'var(--white)' }}
        >
          {product.ogFree ? 'OG Members — Claim Free' : 'Inquire / Order'}
        </button>
      </div>
    </div>
  )
}

export default function Products({ onInquire }) {
  const [active, setActive] = useState('all')
  const filtered = active === 'all' ? products : products.filter(p => p.category === active)

  return (
    <section id="shop" style={{ padding: '100px 40px', background: 'var(--black)' }}>
      {/* Limited drop banner */}
      <div style={{
        maxWidth: '1400px', margin: '0 auto 56px',
        border: '1px solid #1a1a1a', padding: '20px 32px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: '16px', background: 'var(--black-card)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <Logo variant="mark" size={18} color="#CC0000" />
          <div>
            <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase' }}>Limited Drop Policy</p>
            <p style={{ fontSize: '12px', color: '#777', marginTop: '2px' }}>100–200 pieces per drop. Once gone, next drop is 2 months out.</p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: '28px' }}>
          {['No Restocks', 'No Exceptions', '2 Month Cycle'].map(t => (
            <p key={t} style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: '#666', textTransform: 'uppercase' }}>{t}</p>
          ))}
        </div>
      </div>

      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '4px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '14px' }}>
          Core Collection · Drop 001 · Est. 2024
        </p>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(48px, 8vw, 96px)',
          letterSpacing: '4px', color: 'var(--white)', lineHeight: 1, marginBottom: '14px',
        }}>THE COLLECTION</h2>
        <p style={{ color: '#666', fontSize: '13px', maxWidth: '360px', margin: '0 auto', lineHeight: 1.8 }}>
          This is not for everyone.<br />Limited to 100–200 pieces per drop. Once gone, you wait.
        </p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: '2px', marginBottom: '48px', flexWrap: 'wrap' }}>
        {collections.map(c => (
          <button key={c.id} onClick={() => setActive(c.id)} style={{
            padding: '8px 22px', fontSize: '9px', fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase',
            background: active === c.id ? 'var(--white)' : 'transparent',
            color: active === c.id ? 'var(--black)' : '#666',
            border: `1px solid ${active === c.id ? 'var(--white)' : '#1e1e1e'}`,
            cursor: 'pointer', transition: 'all 0.2s',
          }}>{c.label}</button>
        ))}
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))',
        gap: '2px', maxWidth: '1400px', margin: '0 auto',
      }}>
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} onInquire={onInquire || (() => {})} />
        ))}
      </div>
    </section>
  )
}
