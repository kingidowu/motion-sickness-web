import { useState } from 'react'
import Logo from './Logo'
import { supabase } from '../lib/supabase'

const products = [
  'Heritage Crest Tee (Off-White)',
  'World Championship Tee (Vintage Black)',
  'Studio 55 Houston Tee (Heather Grey)',
  'Sailing Club Tee (Cream)',
  'Property Of MS Tee (Charcoal)',
  'Ringer Tee (White/Red)',
  'Studio 55 Jersey — Navy',
  'Studio 55 Jersey — Black',
  'Studio 55 Jersey — Cream',
  "Ladies Tank Top",
  "Women's Athletic Set",
  'OG Members Cap',
  'OG Member Pack (Cap + Tank Top)',
]

export default function Inquiry({ prefilled, onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    instagram: '',
    product: prefilled?.name || '',
    size: '',
    quantity: '1',
    ogMember: false,
    message: '',
  })
  const [submitted, setSubmitted] = useState(false)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    await supabase.from('ms_inquiries').insert({
      name: form.name,
      email: form.email,
      instagram: form.instagram || null,
      product: form.product,
      size: form.size || null,
      quantity: parseInt(form.quantity) || 1,
      og_member: form.ogMember,
      message: form.message || null,
    })
    setSubmitted(true)
  }

  const inputStyle = {
    width: '100%',
    background: '#111',
    border: '1px solid #222',
    color: '#fff',
    padding: '12px 14px',
    fontSize: '13px',
    fontFamily: "'Inter', sans-serif",
    outline: 'none',
    transition: 'border-color 0.2s',
  }

  const labelStyle = {
    fontSize: '9px', fontWeight: 700, letterSpacing: '2px',
    textTransform: 'uppercase', color: '#888',
    display: 'block', marginBottom: '6px',
  }

  if (submitted) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(0,0,0,0.96)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '24px',
      }}>
        <div style={{
          background: 'var(--black-card)', border: '1px solid #1e1e1e',
          padding: '64px 48px', maxWidth: '480px', width: '100%', textAlign: 'center',
        }}>
          <Logo variant="mark" size={48} color="#CC0000" />
          <h3 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '36px', letterSpacing: '3px', color: 'var(--white)', marginTop: '24px', marginBottom: '12px',
          }}>INQUIRY RECEIVED</h3>
          <p style={{ color: '#888', fontSize: '13px', lineHeight: 1.8, marginBottom: '32px' }}>
            We'll be in touch soon. Stay ready — joy is coming.
          </p>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '32px' }}>
            MOVE WITH MOTION
          </p>
          <button onClick={onClose} style={{
            background: 'var(--white)', color: 'var(--black)',
            padding: '12px 32px', fontSize: '10px', fontWeight: 700, letterSpacing: '2px',
            textTransform: 'uppercase', border: 'none', cursor: 'pointer',
          }}>Close</button>
        </div>
      </div>
    )
  }

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px',
      overflowY: 'auto',
    }}
    onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--black-card)', border: '1px solid #1e1e1e',
        maxWidth: '560px', width: '100%',
        maxHeight: '90vh', overflowY: 'auto',
      }}>
        {/* Header */}
        <div style={{
          padding: '28px 32px', borderBottom: '1px solid #1a1a1a',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Logo variant="mark" size={24} color="#CC0000" />
            <div>
              <p style={{ fontSize: '14px', fontWeight: 600, color: 'var(--white)', letterSpacing: '1px' }}>
                {prefilled?.name || 'Order Inquiry'}
              </p>
              {prefilled?.tag && (
                <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: 'var(--red)', textTransform: 'uppercase' }}>
                  {prefilled.tag}
                </p>
              )}
            </div>
          </div>
          <button onClick={onClose} style={{
            background: 'none', border: 'none', color: '#666', fontSize: '20px',
            cursor: 'pointer', lineHeight: 1,
          }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input style={inputStyle} required placeholder="Your name"
                value={form.name} onChange={e => set('name', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#CC0000'}
                onBlur={e => e.target.style.borderColor = '#222'}
              />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input style={inputStyle} type="email" required placeholder="your@email.com"
                value={form.email} onChange={e => set('email', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#CC0000'}
                onBlur={e => e.target.style.borderColor = '#222'}
              />
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Instagram (optional)</label>
            <input style={inputStyle} placeholder="@yourhandle"
              value={form.instagram} onChange={e => set('instagram', e.target.value)}
              onFocus={e => e.target.style.borderColor = '#CC0000'}
              onBlur={e => e.target.style.borderColor = '#222'}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Item of Interest *</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} required
              value={form.product} onChange={e => set('product', e.target.value)}
              onFocus={e => e.target.style.borderColor = '#CC0000'}
              onBlur={e => e.target.style.borderColor = '#222'}
            >
              <option value="">Select a product...</option>
              {products.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Size</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.size} onChange={e => set('size', e.target.value)}
              >
                <option value="">Select size...</option>
                {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Quantity</label>
              <input style={inputStyle} type="number" min="1" max="99"
                value={form.quantity} onChange={e => set('quantity', e.target.value)}
                onFocus={e => e.target.style.borderColor = '#CC0000'}
                onBlur={e => e.target.style.borderColor = '#222'}
              />
            </div>
          </div>

          {/* OG Member checkbox */}
          <div style={{
            marginBottom: '16px',
            border: `1px solid ${form.ogMember ? 'var(--red)' : '#1e1e1e'}`,
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: '12px',
            cursor: 'pointer', transition: 'border-color 0.2s',
          }} onClick={() => set('ogMember', !form.ogMember)}>
            <div style={{
              width: '18px', height: '18px',
              border: `1px solid ${form.ogMember ? 'var(--red)' : '#444'}`,
              background: form.ogMember ? 'var(--red)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              {form.ogMember && <span style={{ color: 'white', fontSize: '11px' }}>✓</span>}
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--white)', letterSpacing: '1px' }}>I am an OG Member</p>
              <p style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>Original members receive their cap + tank top free</p>
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Message / Notes</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
              placeholder="Custom requests, colorway preferences, delivery notes..."
              value={form.message} onChange={e => set('message', e.target.value)}
              onFocus={e => e.target.style.borderColor = '#CC0000'}
              onBlur={e => e.target.style.borderColor = '#222'}
            />
          </div>

          {/* Payment notice */}
          <div style={{
            background: '#0d0d0d', border: '1px solid #1e1e1e',
            padding: '14px 16px', marginBottom: '24px',
            display: 'flex', gap: '12px', alignItems: 'flex-start',
          }}>
            <Logo variant="mark" size={16} color="#CC0000" />
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--white)', marginBottom: '2px' }}>
                Payment Coming Soon
              </p>
              <p style={{ fontSize: '10px', color: '#666', lineHeight: 1.6 }}>
                Secure payment will be available shortly. Submit your inquiry now and we'll reach out with payment details. OG members — your pack is FREE 99.
              </p>
            </div>
          </div>

          <button type="submit" style={{
            width: '100%', padding: '16px',
            background: 'var(--red)', color: 'var(--white)',
            border: 'none', cursor: 'pointer',
            fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
            textTransform: 'uppercase',
            transition: 'background 0.2s',
          }}
          onMouseEnter={e => e.target.style.background = 'var(--red-dark)'}
          onMouseLeave={e => e.target.style.background = 'var(--red)'}
          >
            Submit Inquiry
          </button>
        </form>
      </div>
    </div>
  )
}
