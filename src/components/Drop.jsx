import { useState } from 'react'
import ProductViewer, { useProductImages } from './ProductViewer'

const UNLOCK_PASSWORD = '007'

const TEE_ANGLES = (img) => [
  { label: 'Front',     image: img },
  { label: 'Back',      image: img },
  { label: 'Packaging', image: '/images/packaging-tee.png' },
]

// Available unlocked items (shown first)
const AVAILABLE = [
  {
    id: 11, name: 'Studio 55 Camp Shirt', tag: 'DROP 001',
    price: 125,
    images: [
      { label: 'Front',     image: '/images/shirt-studio55.jpg' },
      { label: 'Back',      image: '/images/shirt-studio55.jpg' },
      { label: 'Packaging', image: '/images/packaging-tee.png' },
    ],
    desc: 'White camp collar. "Motion Sickness" stamp print back. S55 chest detail. Studio 55.',
    placeholder: { bg: '#f5f5f5', text: '#1a1a1a' },
    locked: false,
    sizes: ['XS','S','M','L','XL','XXL'],
  },
  {
    id: 5, name: 'Property Of MS Tee', tag: 'DROP 001',
    price: 85,
    images: TEE_ANGLES('/images/tee-property.png'),
    desc: 'Property of Motion Sickness. Studio 55.',
    placeholder: { bg: '#2a2a2a', text: '#ffffff' },
    locked: false,
    sizes: ['XS','S','M','L','XL','XXL'],
  },
]

// Cap colorways — all $105
const CAP_COLORWAYS = [
  {
    id: 'all-black', name: 'All Black', number: '#001', swatch: '#111111',
    images: [
      { label: 'Front',     image: '/images/cap-all-black-views.png' },
      { label: 'Sides',     image: '/images/cap-all-black-sides.png' },
      { label: 'Packaging', image: '/images/packaging-cap.png' },
    ],
    placeholder: { bg: '#111111', text: '#ffffff' },
  },
  {
    id: 'cream-red', name: 'Cream / Red', number: '#025', swatch: '#D4C5A0',
    images: [
      { label: 'Front',     image: '/images/cap-cream-red-views.png' },
      { label: 'Sides',     image: '/images/cap-cream-red-sides.png' },
      { label: 'Packaging', image: '/images/packaging-cap.png' },
    ],
    placeholder: { bg: '#D4C5A0', text: '#1a1a1a' },
  },
  {
    id: 'navy-red', name: 'Navy / Red', number: '#050', swatch: '#132B57',
    images: [
      { label: 'Front',     image: '/images/cap-navy-red-views.png' },
      { label: 'Sides',     image: '/images/cap-navy-red-sides.png' },
      { label: 'Packaging', image: '/images/packaging-cap.png' },
    ],
    placeholder: { bg: '#132B57', text: '#ffffff' },
  },
  {
    id: 'olive-black', name: 'Olive / Black', number: '#100', swatch: '#4a5240',
    images: [
      { label: 'Front',     image: '/images/cap-olive-black-views.png' },
      { label: 'Sides',     image: '/images/cap-olive-black-sides.png' },
      { label: 'Packaging', image: '/images/packaging-cap.png' },
    ],
    placeholder: { bg: '#4a5240', text: '#ffffff' },
  },
]

// Locked items (shown last)
const LOCKED = [
  {
    id: 1, name: 'Core Tee', tag: 'DROP 001',
    price: 75, images: TEE_ANGLES('/images/tee-heritage.png'),
    desc: 'Built for movement, presence, and everyday wear.',
    placeholder: { bg: '#f0ebe0', text: '#1a1a1a' }, locked: true,
  },
  {
    id: 2, name: 'World Championship Tee', tag: 'DROP 001',
    price: 80, images: TEE_ANGLES('/images/tee-racing.png'),
    desc: 'Motion Sickness identity. S55 Racing detail.',
    placeholder: { bg: '#1a1a1a', text: '#F2EFE4' }, locked: true,
  },
  {
    id: 3, name: 'Houston Collegiate Tee', tag: 'DROP 001',
    price: 70, images: TEE_ANGLES('/images/tee-houston.png'),
    desc: 'Move With Motion. Designed in Houston.',
    placeholder: { bg: '#c9c9c9', text: '#132B57' }, locked: true,
  },
  {
    id: 4, name: 'Sailing Club Tee', tag: 'DROP 001',
    price: 75, images: TEE_ANGLES('/images/tee-sailing.png'),
    desc: 'Members In Motion. 29.7604° N · 95.3698° W.',
    placeholder: { bg: '#F2EFE4', text: '#142B40' }, locked: true,
  },
  {
    id: 6, name: 'Ringer Tee', tag: 'DROP 001',
    price: 65, images: TEE_ANGLES('/images/tee-ringer.png'),
    desc: 'Clean. Bold. Motion Sickness by S55.',
    placeholder: { bg: '#ffffff', text: '#CC0000' }, locked: true,
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
        <p style={{ fontSize: '12px', color: '#666', marginBottom: '32px', lineHeight: 1.7 }}>This piece is reserved. Enter your access code to unlock it.</p>
        <input autoFocus type="password" value={value} onChange={e => setValue(e.target.value)} onKeyDown={e => e.key === 'Enter' && attempt()} placeholder="Access code"
          style={{ width: '100%', background: '#111', border: `1px solid ${error ? 'var(--red)' : '#222'}`, color: '#fff', padding: '12px 14px', fontSize: '16px', letterSpacing: '6px', textAlign: 'center', fontFamily: "'Inter', sans-serif", outline: 'none', marginBottom: '12px', transition: 'border-color 0.2s' }} />
        {error && <p style={{ fontSize: '10px', color: 'var(--red)', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Invalid code</p>}
        <button onClick={attempt} style={{ width: '100%', padding: '13px', background: 'var(--red)', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer' }}>Unlock</button>
        <button onClick={onClose} style={{ marginTop: '12px', background: 'none', border: 'none', color: '#555', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>Cancel</button>
      </div>
    </div>
  )
}

function DropCard({ item, isUnlocked, onInquire, onUnlock }) {
  const [hovered, setHovered] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const locked = item.locked && !isUnlocked
  const dbImages = useProductImages(item.productId)
  const images = dbImages || item.images

  return (
    <>
      <div onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}
        style={{ background: 'var(--black-card)', border: `1px solid ${hovered ? '#333' : '#161616'}`, transition: 'border-color 0.25s', overflow: 'hidden', position: 'relative' }}>

        {/* Tags */}
        <div style={{ position: 'absolute', top: '12px', left: '12px', right: '12px', zIndex: 10, display: 'flex', justifyContent: 'space-between', pointerEvents: 'none' }}>
          <span style={{ background: 'rgba(8,8,8,0.9)', color: '#fff', padding: '3px 10px', fontSize: '7px', fontWeight: 700, letterSpacing: '2px' }}>{item.tag}</span>
          {locked
            ? <span style={{ background: '#111', color: '#888', border: '1px solid #333', padding: '3px 10px', fontSize: '7px', fontWeight: 700, letterSpacing: '2px' }}>LOCKED</span>
            : <span style={{ background: 'var(--red)', color: '#fff', padding: '3px 10px', fontSize: '7px', fontWeight: 700, letterSpacing: '2px' }}>LIMITED</span>}
        </div>

        {/* Lock overlay */}
        {locked && (
          <div style={{ position: 'absolute', inset: 0, zIndex: 9, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', background: 'rgba(0,0,0,0.55)', cursor: 'pointer' }}
            onClick={() => setShowPassword(true)}>
            <div style={{ fontSize: '32px' }}>🔒</div>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '11px', letterSpacing: '4px', color: '#aaa', textTransform: 'uppercase' }}>Members Only</p>
            <p style={{ fontSize: '9px', color: '#666', letterSpacing: '2px', textTransform: 'uppercase' }}>Enter access code</p>
          </div>
        )}

        <ProductViewer images={images} name={item.name} placeholder={item.placeholder} locked={locked} />

        {/* Hover buy */}
        {!locked && (
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 'calc(100% - 120px)', background: 'rgba(0,0,0,0.45)', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: hovered ? 1 : 0, transition: 'opacity 0.3s', zIndex: 8, pointerEvents: 'none' }}>
            <button onClick={e => { e.stopPropagation(); onInquire(item) }} style={{ background: '#fff', color: '#000', padding: '12px 32px', fontSize: '9px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', border: 'none', cursor: 'pointer', pointerEvents: 'auto' }}>Buy from Drop 001</button>
          </div>
        )}

        {/* Card body */}
        <div style={{ padding: '18px' }}>
          <p style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2px', color: locked ? '#444' : 'var(--red)', textTransform: 'uppercase', marginBottom: '6px' }}>
            {locked ? 'Members Only · Locked' : 'Drop 001 · Core Collection'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: 600, color: locked ? '#555' : '#fff' }}>{item.name}</h3>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: '20px', color: locked ? '#444' : '#fff' }}>{locked ? '—' : `$${item.price}`}</span>
          </div>
          <p style={{ fontSize: '11px', color: '#444', marginBottom: '14px', lineHeight: 1.6 }}>{locked ? 'Access code required to view this piece.' : item.desc}</p>
          <button onClick={() => locked ? setShowPassword(true) : onInquire(item)}
            style={{ width: '100%', padding: '11px', background: locked ? '#0a0a0a' : 'transparent', border: `1px solid ${locked ? '#222' : '#2a2a2a'}`, color: locked ? '#555' : '#fff', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
            onMouseEnter={e => { if (!locked) { e.target.style.background = '#fff'; e.target.style.color = '#000' } }}
            onMouseLeave={e => { if (!locked) { e.target.style.background = 'transparent'; e.target.style.color = '#fff' } }}
          >{locked ? '🔒 Enter Access Code' : 'Buy from Drop 001'}</button>
        </div>
      </div>

      {showPassword && (
        <PasswordModal item={item} onUnlock={() => { onUnlock(item.id); setShowPassword(false) }} onClose={() => setShowPassword(false)} />
      )}
    </>
  )
}

function CapsBlock({ onInquire }) {
  const [selected, setSelected] = useState(0)
  const colorway = CAP_COLORWAYS[selected]

  return (
    <div style={{ gridColumn: '1 / -1', background: 'var(--black-card)', border: '1px solid #161616' }}>
      {/* Header bar */}
      <div style={{ padding: '16px 24px', borderBottom: '1px solid #161616', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ background: 'rgba(8,8,8,0.9)', color: '#fff', padding: '3px 10px', fontSize: '7px', fontWeight: 700, letterSpacing: '2px' }}>DROP 001</span>
          <span style={{ background: 'var(--red)', color: '#fff', padding: '3px 10px', fontSize: '7px', fontWeight: 700, letterSpacing: '2px' }}>4 COLORWAYS</span>
        </div>
        <p style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '3px', color: '#555', textTransform: 'uppercase' }}>S55 CAP COLLECTION · $105</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0' }}>
        {/* Left: viewer */}
        <div style={{ borderRight: '1px solid #161616' }}>
          <ProductViewer images={colorway.images} name={`S55 Cap — ${colorway.name}`} placeholder={colorway.placeholder} locked={false} />
        </div>

        {/* Right: info + colorway selector */}
        <div style={{ padding: '32px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '12px' }}>Drop 001 · Cap Collection</p>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 4vw, 48px)', letterSpacing: '3px', color: '#fff', lineHeight: 1, marginBottom: '4px' }}>S55 CAP</h3>
            <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(20px, 3vw, 32px)', letterSpacing: '3px', color: 'var(--red)', lineHeight: 1, marginBottom: '20px' }}>{colorway.name}</p>
            <p style={{ fontSize: '11px', color: '#666', lineHeight: 1.7, marginBottom: '28px' }}>
              S55 embroidered logo front. Signature script left panel. "Motion Sickness by S55" right panel. Numbered Members Only strap. Drop 001 — limited release.
            </p>

            {/* Colorway selector */}
            <p style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2px', color: '#555', textTransform: 'uppercase', marginBottom: '12px' }}>Select Colorway</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '28px' }}>
              {CAP_COLORWAYS.map((c, i) => (
                <button key={c.id} onClick={() => setSelected(i)}
                  style={{
                    padding: '10px 12px', display: 'flex', alignItems: 'center', gap: '10px',
                    background: selected === i ? '#fff' : '#0d0d0d',
                    border: `1px solid ${selected === i ? '#fff' : '#222'}`,
                    cursor: 'pointer', transition: 'all 0.15s', textAlign: 'left',
                  }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', background: c.swatch, border: '1px solid rgba(255,255,255,0.15)', flexShrink: 0 }} />
                  <div>
                    <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '1px', color: selected === i ? '#000' : '#aaa', textTransform: 'uppercase' }}>{c.name}</p>
                    <p style={{ fontSize: '8px', color: selected === i ? '#555' : '#444', letterSpacing: '1px' }}>{c.number}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '16px' }}>
              <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: '#555', textTransform: 'uppercase' }}>Price per cap</span>
              <span style={{ fontFamily: "'Bebas Neue'", fontSize: '36px', color: '#fff' }}>$105</span>
            </div>
            <button
              onClick={() => onInquire({ id: `cap-${colorway.id}`, name: `S55 Cap — ${colorway.name}`, price: 105, images: colorway.images, placeholder: colorway.placeholder })}
              style={{ width: '100%', padding: '14px', background: '#fff', color: '#000', border: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseEnter={e => { e.target.style.background = 'var(--red)'; e.target.style.color = '#fff' }}
              onMouseLeave={e => { e.target.style.background = '#fff'; e.target.style.color = '#000' }}
            >Buy from Drop 001</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Drop({ onInquire }) {
  const [unlockedIds, setUnlockedIds] = useState([])
  const unlock = (id) => setUnlockedIds(prev => [...prev, id])

  return (
    <section id="drop" className="section-pad" style={{ background: 'var(--black)', padding: '100px 40px', borderTop: '1px solid #111' }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '5px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '16px' }}>Now Available</p>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(56px, 10vw, 120px)', letterSpacing: '6px', color: '#fff', lineHeight: 0.9, marginBottom: '24px' }}>DROP 001</h2>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 'clamp(18px, 2.5vw, 26px)', fontStyle: 'italic', color: '#888', marginBottom: '12px' }}>Motion Sickness Core Collection</p>
          <p style={{ fontSize: '12px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '32px' }}>Limited release · No guaranteed restock</p>
          <div style={{ display: 'inline-block', background: 'var(--black-card)', border: '1px solid #1e1e1e', padding: '20px 40px', maxWidth: '560px' }}>
            <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.9, fontStyle: 'italic' }}>
              "The first Motion Sickness release. Built around the original message: Move with motion. The rest will play out. Once this drop sells out, restock is not guaranteed."
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2px' }}>

          {/* Available unlocked items */}
          {AVAILABLE.map(item => (
            <DropCard key={item.id} item={item} isUnlocked={unlockedIds.includes(item.id)} onInquire={onInquire || (() => {})} onUnlock={unlock} />
          ))}

          {/* Caps block — full width */}
          <CapsBlock onInquire={onInquire || (() => {})} />

          {/* Locked items */}
          {LOCKED.map(item => (
            <DropCard key={item.id} item={item} isUnlocked={unlockedIds.includes(item.id)} onInquire={onInquire || (() => {})} onUnlock={unlock} />
          ))}
        </div>

        <div style={{ marginTop: '48px', textAlign: 'center', padding: '24px', border: '1px solid #1a1a1a', background: 'var(--black-card)' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: '#555', textTransform: 'uppercase' }}>
            Once Drop 001 sells out — the next drop is 2 months away. No exceptions.
          </p>
        </div>

        <div style={{ marginTop: '16px', padding: '20px 24px', border: '1px solid #161616', background: '#080808', display: 'flex', alignItems: 'flex-start', gap: '16px' }}>
          <span style={{ color: 'var(--red)', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', whiteSpace: 'nowrap', paddingTop: '2px' }}>Design Notice</span>
          <p style={{ fontSize: '11px', color: '#444', lineHeight: 1.7 }}>
            This product features original Motion Sickness by S55 artwork and brand identity. Copying, reproducing, manufacturing, reselling, or commercially using this design without written approval is prohibited.
          </p>
        </div>
      </div>
    </section>
  )
}
