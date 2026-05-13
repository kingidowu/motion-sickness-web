import { useState, useRef, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export function useProductImages(productId) {
  const [images, setImages] = useState(null)

  useEffect(() => {
    if (!supabase || !productId) return
    supabase
      .from('ms_product_images')
      .select('angle, url, storage_path, sort_order')
      .eq('product_id', productId)
      .order('sort_order')
      .then(({ data }) => {
        if (data && data.length > 0) {
          setImages(data.map(r => ({
            label: r.angle.charAt(0).toUpperCase() + r.angle.slice(1).replace('-', ' '),
            image: r.url || supabase.storage.from('product-images').getPublicUrl(r.storage_path).data.publicUrl,
          })))
        }
      })
  }, [productId])

  return images
}

export default function ProductViewer({ images, name, placeholder, locked }) {
  const [activeIdx, setActiveIdx] = useState(0)
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const [expanded, setExpanded] = useState(false)
  const [expandedIdx, setExpandedIdx] = useState(0)
  const containerRef = useRef(null)

  const handleMouseMove = (e) => {
    if (locked) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * 16, y: -x * 16 })
  }

  const handleMouseLeave = () => {
    setHovering(false)
    setTilt({ x: 0, y: 0 })
  }

  const openExpanded = (idx) => {
    if (locked) return
    setExpandedIdx(idx)
    setExpanded(true)
  }

  const current = images[activeIdx]
  const glossX = 50 + tilt.y * 2.5
  const glossY = 50 - tilt.x * 2.5

  return (
    <>
      <div style={{ position: 'relative', userSelect: 'none' }}>
        {/* Main 3D image */}
        <div
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setHovering(true)}
          onMouseLeave={handleMouseLeave}
          onClick={() => openExpanded(activeIdx)}
          style={{
            aspectRatio: '4/5',
            background: placeholder.bg,
            cursor: locked ? 'pointer' : 'zoom-in',
            overflow: 'hidden',
            position: 'relative',
            perspective: '1200px',
          }}
        >
          {/* 3D tilt wrapper */}
          <div style={{
            width: '100%', height: '100%', position: 'relative',
            transform: locked
              ? 'none'
              : `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovering ? 1.03 : 1})`,
            transition: hovering ? 'transform 0.08s linear' : 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)',
            transformStyle: 'preserve-3d',
          }}>
            {/* Placeholder bg */}
            <div style={{
              position: 'absolute', inset: 0,
              background: placeholder.bg,
              display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 0,
            }}>
              <p style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '11px', letterSpacing: '4px',
                color: placeholder.text, opacity: 0.25,
              }}>MOTION SICKNESS</p>
            </div>

            {/* Product image */}
            <img
              src={current.image}
              alt={`${name} — ${current.label}`}
              onError={e => { e.target.style.display = 'none' }}
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                objectFit: 'cover', zIndex: 1,
                filter: locked ? 'blur(6px) brightness(0.35)' : 'none',
              }}
            />

            {/* Gloss / specular highlight — moves with tilt */}
            {!locked && (
              <div style={{
                position: 'absolute', inset: 0, zIndex: 2, pointerEvents: 'none',
                background: `radial-gradient(circle at ${glossX}% ${glossY}%, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 35%, transparent 65%)`,
                transition: hovering ? 'background 0.08s linear' : 'background 0.55s ease',
                mixBlendMode: 'screen',
              }} />
            )}

            {/* Edge vignette */}
            <div style={{
              position: 'absolute', inset: 0, zIndex: 3, pointerEvents: 'none',
              boxShadow: 'inset 0 0 40px rgba(0,0,0,0.35)',
            }} />
          </div>
        </div>

        {/* Angle selector — only shown when multiple angles */}
        {images.length > 1 && !locked && (
          <div style={{ display: 'flex', gap: '2px', marginTop: '2px' }}>
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveIdx(i)}
                style={{
                  flex: 1, padding: '7px 4px',
                  background: activeIdx === i ? 'var(--white)' : '#0d0d0d',
                  border: `1px solid ${activeIdx === i ? 'var(--white)' : '#1e1e1e'}`,
                  color: activeIdx === i ? 'var(--black)' : '#555',
                  fontSize: '7px', fontWeight: 700, letterSpacing: '1.5px',
                  textTransform: 'uppercase', cursor: 'pointer',
                  transition: 'all 0.18s',
                  fontFamily: "'Inter', sans-serif",
                }}
                onMouseEnter={e => { if (activeIdx !== i) { e.target.style.borderColor = '#444'; e.target.style.color = '#aaa' } }}
                onMouseLeave={e => { if (activeIdx !== i) { e.target.style.borderColor = '#1e1e1e'; e.target.style.color = '#555' } }}
              >{img.label}</button>
            ))}
          </div>
        )}
      </div>

      {/* Expanded lightbox */}
      {expanded && (
        <div
          onClick={() => setExpanded(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 2000,
            background: 'rgba(0,0,0,0.97)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            cursor: 'zoom-out', padding: '24px',
          }}
        >
          <button
            onClick={() => setExpanded(false)}
            style={{
              position: 'absolute', top: '24px', right: '32px',
              background: 'none', border: 'none', color: '#fff',
              fontSize: '28px', cursor: 'pointer', lineHeight: 1, zIndex: 2,
            }}
          >✕</button>

          {/* Big 3D image in lightbox */}
          <LightboxTilt
            src={images[expandedIdx].image}
            alt={`${name} — ${images[expandedIdx].label}`}
          />

          {/* Angle tabs in lightbox */}
          {images.length > 1 && (
            <div
              onClick={e => e.stopPropagation()}
              style={{ display: 'flex', gap: '8px', marginTop: '28px', flexWrap: 'wrap', justifyContent: 'center' }}
            >
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setExpandedIdx(i)}
                  style={{
                    padding: '9px 24px',
                    background: expandedIdx === i ? 'var(--white)' : 'transparent',
                    border: `1px solid ${expandedIdx === i ? 'var(--white)' : '#333'}`,
                    color: expandedIdx === i ? 'var(--black)' : '#666',
                    fontSize: '8px', fontWeight: 700, letterSpacing: '2px',
                    textTransform: 'uppercase', cursor: 'pointer',
                    transition: 'all 0.18s',
                    fontFamily: "'Inter', sans-serif",
                  }}
                >{img.label}</button>
              ))}
            </div>
          )}

          <p style={{ marginTop: '16px', fontSize: '10px', color: '#333', letterSpacing: '2px', textTransform: 'uppercase' }}>
            {name} · {images[expandedIdx].label}
          </p>
        </div>
      )}
    </>
  )
}

function LightboxTilt({ src, alt }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 })
  const [hovering, setHovering] = useState(false)
  const ref = useRef(null)

  const handleMouseMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setTilt({ x: y * 10, y: -x * 10 })
  }

  return (
    <div
      ref={ref}
      onClick={e => e.stopPropagation()}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => { setHovering(false); setTilt({ x: 0, y: 0 }) }}
      style={{
        position: 'relative', cursor: 'grab',
        maxWidth: '520px', width: '100%',
      }}
    >
      <div style={{
        transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovering ? 1.02 : 1})`,
        transition: hovering ? 'transform 0.08s linear' : 'transform 0.55s cubic-bezier(0.23, 1, 0.32, 1)',
        transformStyle: 'preserve-3d',
        position: 'relative',
      }}>
        <img
          src={src} alt={alt}
          style={{ width: '100%', maxHeight: '65vh', objectFit: 'contain', display: 'block' }}
        />
        <div style={{
          position: 'absolute', inset: 0, pointerEvents: 'none',
          background: `radial-gradient(circle at ${50 + tilt.y * 3}% ${50 - tilt.x * 3}%, rgba(255,255,255,0.1) 0%, transparent 60%)`,
          mixBlendMode: 'screen',
        }} />
      </div>
    </div>
  )
}
