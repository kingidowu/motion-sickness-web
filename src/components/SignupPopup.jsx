import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

export default function SignupPopup() {
  const [visible, setVisible] = useState(false)
  const [tab, setTab] = useState('signup') // 'signup' | 'follow'
  const [form, setForm] = useState({ name: '', email: '', phone: '', instagram: '' })
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('ms_popup_dismissed')) return
    const timer = setTimeout(() => setVisible(true), 6000)
    return () => clearTimeout(timer)
  }, [])

  const dismiss = () => {
    localStorage.setItem('ms_popup_dismissed', '1')
    setVisible(false)
  }

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    const source = tab === 'follow' ? 'instagram_follow' : 'popup_signup'
    if (supabase) {
      await supabase.from('ms_signups').insert({
        name: form.name, email: form.email,
        phone: form.phone || null, instagram: form.instagram || null, source,
      })
    }
    await fetch('/api/send-welcome', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: form.name, email: form.email, source }),
    }).catch(() => {})
    setLoading(false)
    setSubmitted(true)
    localStorage.setItem('ms_popup_dismissed', '1')
  }

  if (!visible) return null

  const inputStyle = {
    width: '100%', background: '#0d0d0d', border: '1px solid #222',
    color: '#fff', padding: '11px 14px', fontSize: '13px',
    fontFamily: "'Inter', sans-serif", outline: 'none',
  }

  if (submitted) {
    return (
      <div style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', padding: '48px 40px', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '16px' }}>♥</div>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '4px', color: '#fff', marginBottom: '12px' }}>YOU'RE IN</p>
          <p style={{ fontSize: '12px', color: '#888', lineHeight: 1.8, marginBottom: '8px' }}>
            Early access to Drop 002. We'll reach out when it drops.
          </p>
          <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '28px' }}>
            10% off your first order
          </p>
          <button onClick={dismiss} style={{ background: 'var(--white)', color: 'var(--black)', padding: '12px 32px', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 998, background: 'rgba(0,0,0,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      onClick={e => e.target === e.currentTarget && dismiss()}>
      <div style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', maxWidth: '460px', width: '100%', position: 'relative', overflow: 'hidden' }}>

        {/* Red top bar */}
        <div style={{ background: 'var(--red)', padding: '10px', textAlign: 'center', fontSize: '9px', fontWeight: 700, letterSpacing: '4px', color: '#fff', textTransform: 'uppercase' }}>
          Drop 002 Early Access · Limited Spots
        </div>

        {/* Close */}
        <button onClick={dismiss} style={{ position: 'absolute', top: '36px', right: '20px', background: 'none', border: 'none', color: '#555', fontSize: '20px', cursor: 'pointer', lineHeight: 1 }}>✕</button>

        <div style={{ padding: '32px 32px 28px' }}>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 6vw, 40px)', letterSpacing: '3px', color: '#fff', lineHeight: 1, marginBottom: '8px' }}>
            GET 10% OFF
          </p>
          <p style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: '16px', fontStyle: 'italic', color: '#888', marginBottom: '24px' }}>
            Early access. First to know. First to move.
          </p>

          {/* Tabs */}
          <div style={{ display: 'flex', marginBottom: '24px', borderBottom: '1px solid #1e1e1e' }}>
            {[['signup', 'Sign Up'], ['follow', 'Follow & Post']].map(([key, label]) => (
              <button key={key} onClick={() => setTab(key)} style={{
                flex: 1, padding: '10px', background: 'none', border: 'none',
                borderBottom: `2px solid ${tab === key ? 'var(--red)' : 'transparent'}`,
                color: tab === key ? '#fff' : '#555',
                fontSize: '10px', fontWeight: 700, letterSpacing: '2px',
                textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s',
              }}>{label}</button>
            ))}
          </div>

          {tab === 'follow' && (
            <div style={{ background: '#111', border: '1px solid #1a1a1a', padding: '16px', marginBottom: '20px', fontSize: '12px', color: '#888', lineHeight: 1.8 }}>
              Follow <span style={{ color: 'var(--red)', fontWeight: 700 }}>@motionsickness.s55</span> on Instagram, post about us and tag us — get <span style={{ color: '#fff' }}>10% off</span> your first order. Enter your info below and we'll verify + send your code.
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2px', color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Name *</label>
                <input style={inputStyle} required placeholder="Your name" value={form.name} onChange={e => set('name', e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#CC0000'} onBlur={e => e.target.style.borderColor = '#222'} />
              </div>
              <div>
                <label style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2px', color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Email *</label>
                <input style={inputStyle} type="email" required placeholder="your@email.com" value={form.email} onChange={e => set('email', e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#CC0000'} onBlur={e => e.target.style.borderColor = '#222'} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2px', color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Phone</label>
                <input style={inputStyle} type="tel" placeholder="+1 (000) 000-0000" value={form.phone} onChange={e => set('phone', e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#CC0000'} onBlur={e => e.target.style.borderColor = '#222'} />
              </div>
              <div>
                <label style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2px', color: '#666', textTransform: 'uppercase', display: 'block', marginBottom: '5px' }}>Instagram</label>
                <input style={inputStyle} placeholder="@yourhandle" value={form.instagram} onChange={e => set('instagram', e.target.value)}
                  onFocus={e => e.target.style.borderColor = '#CC0000'} onBlur={e => e.target.style.borderColor = '#222'} />
              </div>
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: '14px', background: 'var(--red)', color: '#fff',
              border: 'none', fontSize: '11px', fontWeight: 700, letterSpacing: '3px',
              textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.7 : 1,
            }}>
              {loading ? 'Saving...' : tab === 'follow' ? 'Submit & Get My Code' : 'Get Early Access + 10% Off'}
            </button>
          </form>

          <p style={{ fontSize: '10px', color: '#444', textAlign: 'center', marginTop: '12px' }}>
            No spam. Drop notifications only. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </div>
  )
}
