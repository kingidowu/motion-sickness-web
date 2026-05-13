import { useState } from 'react'
import ProductViewer from './ProductViewer'

const UNLOCK_PASSWORD = '007'

const items = [
  {
    id: 'l1', name: 'S55 Polo Tank', tag: 'LADIES LINE',
    price: 85, image: '/images/ladies-polo.png',
    desc: 'Structured polo tank. S55 embroidery. Built to move.',
    placeholder: { bg: '#1a1a1a', text: '#fff' },
    locked: false,
  },
  {
    id: 'l2', name: 'Sky Blue Athletic Set', tag: 'LADIES LINE',
    price: 150, image: '/images/ladies-bra.png', image2: '/images/ladies-leggings.png',
    desc: 'Sports bra + leggings. Same colorway. Move With Motion.',
    placeholder: { bg: '#b8d4e8', text: '#1a1a1a' },
    locked: true, isSet: true,
  },
  {
    id: 'l4', name: 'S55 Crop Track Jacket', tag: 'LADIES LINE',
    price: 110, image: '/images/ladies-jacket.png',
    desc: 'Blush pink. Full zip. Silver S55 logo. Statement piece.',
    placeholder: { bg: '#e8c8bb', text: '#1a1a1a' },
    locked: true,
  },
  {
    id: 'l5', name: 'Motion Runner Shorts', tag: 'LADIES LINE',
    price: 70, image: '/images/ladies-shorts.png',
    desc: 'Butter yellow. S55 mark. White piping trim.',
    placeholder: { bg: '#f0e87a', text: '#1a1a1a' },
    locked: true,
  },
]

function PasswordModal({ item, onUnlock, onClose }) {
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const attempt = () => {
    if (value === UNLOCK_PASSWORD) { onUnlock() }
    else { setError(true); setValue(''); setTimeout(() => setError(false), 1200) }
  }
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div onClick={e => e.stopPropagation()} style={{ background: '#0d0d0d', border: `1px solid ${error ? 'var(--red)' : '#1e1e1e'}`, padding: '48px 40px', maxWidth: '400px', width: '100%', textAlign: 'center', transition: 'border-color 0.2s' }}>
        <div style={{ fontSize: '28px', marginBottom: '16px' }}>🔒</div>
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '22px', letterSpacing: '4px', color: '#fff', marginBottom: '8px' }}>MEMBERS ONLY</p>
        <p style={{ fontSize: '11px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '8px' }}>{item.name}</p>
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '32px', lineHeight: 1.7 }}>Enter your access code to unlock this piece.</p>
        <input autoFocus type="password" value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && attempt()} placeholder="Access code"
          style={{ width: '100%', background: '#111', border: `1px solid ${error ? 'var(--red)' : '#222'}`, color: '#fff', padding: '12px 14px', fontSize: '16px', letterSpacing: '6px', textAlign: 'center', fontFamily: "'Inter', sans-serif", outline: 'none', marginBottom: '12px' }} />
        {error && <p style={{ fontSize: '10px', color: 'var(--red)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Invalid code</p>}
        <button onClick={attempt} style={{ width: '100%', padding: '13px', background: 'var(--red)', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer' }}>Unlock</button>
        <button onClick={onClose} style={{ marginTop: '12px', background: 'none', border: 'none', color: '#555', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  )
}

function LadiesCard({ item, isUnlocked, onInquire, onUnlock }) {
  const [hovered, setHovered] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const locked = item.locked && !isUnlocked
  const handleBuy = () => locked ? setShowPassword(true) : onInquire(item)

  const images = item.isSet
    ? [{ label: 'Bra', image: item.image }, { label: 'Leggings', image: item.image2 }, { label: 'Packaging', image: '/images/packaging-ladies.png' }]
    : [{ label: 'Front', image: item.image }, { label: 'Back', image: item.image }, { label: 'Packaging', image: '/images/packaging-ladies.png' }]

  return (
    <>
      <div
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        style={{ background: 'var(--black-card)', border: `1px solid ${hovered ? '#333' : '#161616'}`, transition: 'border-color 0.25s', overflow: 'hidden', position: 'relative' }}
      >
        {/* Tags */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', zIndex: 10, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
          <span style={{ background: 'rgba(8,8,8,0.9)', color: '#fff', padding: '3px 10px', fontSize: '7px', fontWeight: 700, letterSpacing: '2px' }}>
            {item.isSet ? 'SET' : item.tag}
          </span>
          {locked
            ? <span style={{ background: '#111', color: '#888', border: '1px solid #333', padding: '3px 10px', fontSize: '7px', fontWeight: 700, letterSpacing: '2px' }}>LOCKED</span>
            : <span style={{ background: 'var(--red)', color: '#fff', padding: '3px 10px', fontSize: '7px', fontWeight: 700, letterSpacing: '2px' }}>LIMITED</span>
          }
        </div>

        {/* Lock overlay */}
        {locked && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 9, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(0,0,0,0.55)', cursor: 'pointer' }}
            onClick={() => setShowPassword(true)}>
            <div style={{ fontSize: '32px' }}>🔒</div>
            <p style={{ fontFamily: "'Bebas Neue'", fontSize: '11px', letterSpacing: '4px', color: '#aaa' }}>Members Only</p>
            <p style={{ fontSize: '9px', color: '#666', letterSpacing: '2px', textTransform: 'uppercase' }}>Enter access code</p>
          </div>
        )}

        {/* Hover buy overlay */}
        {!locked && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 'calc(100% - 120px)', background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', zIndex: 8, pointerEvents: 'none' }}>
            <button onClick={e => { e.stopPropagation(); onInquire(item) }} style={{ background: '#fff', color: '#000', padding: '12px 32px', fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}>Inquire</button>
          </div>
        )}

        {/* 3D Viewer */}
        <ProductViewer images={images} name={item.name} placeholder={item.placeholder} locked={locked} />

        {/* Card body */}
        <div style={{ padding: '18px' }}>
          <p style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2px', color: locked ? '#444' : 'var(--red)', textTransform: 'uppercase', marginBottom: '6px' }}>
            {locked ? 'Members Only · Locked' : item.isSet ? 'Ladies Set · S55' : 'Ladies Line · S55'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: locked ? '#555' : '#fff' }}>{item.name}</h3>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: '20px', color: locked ? '#444' : '#fff' }}>{locked ? '—' : `$${item.price}`}</span>
          </div>
          <p style={{ fontSize: '11px', color: '#444', marginBottom: '14px', lineHeight: 1.6 }}>{locked ? 'Access code required.' : item.desc}</p>
          <button onClick={handleBuy}
            style={{ width: '100%', padding: '11px', background: locked ? '#0a0a0a' : 'transparent', border: `1px solid ${locked ? '#222' : '#2a2a2a'}`, color: locked ? '#555' : '#fff', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { if (!locked) { e.target.style.background = '#fff'; e.target.style.color = '#000' } }}
            onMouseLeave={e => { if (!locked) { e.target.style.background = 'transparent'; e.target.style.color = '#fff' } }}
          >{locked ? '🔒 Enter Access Code' : 'Inquire'}</button>
        </div>
      </div>

      {showPassword && (
        <PasswordModal item={item} onUnlock={() => { onUnlock(item.id); setShowPassword(false) }} onClose={() => setShowPassword(false)} />
      )}
    </>
  )
}

export default function LadiesLine({ onInquire }) {
  const [unlockedIds, setUnlockedIds] = useState([])
  const unlock = (id) => setUnlockedIds(prev => [...prev, id])

  return (
    <section id="ladies" className="section-pad" style={{ background: 'var(--black)', padding: '100px 40px', borderTop: '1px solid #111' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '5px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '16px' }}>
            Drop 001 · Women's Collection
          </p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(48px, 8vw, 100px)', letterSpacing: '6px', color: '#fff', lineHeight: 0.9, marginBottom: '24px' }}>LADIES LINE</h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(16px, 2vw, 22px)', fontStyle: 'italic', color: '#888', marginBottom: '32px' }}>Designed for women who move with purpose.</p>
          <div style={{ display: 'inline-block', background: 'var(--black-card)', border: '1px solid #1e1e1e', padding: '16px 36px', maxWidth: '520px' }}>
            <p style={{ fontSize: '12px', color: '#888', lineHeight: 1.9, fontStyle: 'italic' }}>
              "Built for performance. Worn for presence. The S55 Ladies Line moves with you — from the gym to the streets."
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '2px' }}>
          {items.map(item => (
            <LadiesCard key={item.id} item={item} isUnlocked={unlockedIds.includes(item.id)} onInquire={onInquire || (() => {})} onUnlock={unlock} />
          ))}
        </div>

        <div style={{ marginTop: '48px', textAlign: 'center', padding: '24px', border: '1px solid #1a1a1a', background: 'var(--black-card)' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: '#555', textTransform: 'uppercase' }}>
            Ladies Line · Limited pieces · No guaranteed restock
          </p>
        </div>
      </div>
    </section>
  )
}
