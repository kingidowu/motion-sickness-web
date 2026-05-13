import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Logo from './Logo'

export default function MemberAuth() {
  const [mode, setMode] = useState('signup') // 'signup' | 'login' | 'forgot'
  const [step, setStep] = useState(1) // signup steps 1-2
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({
    email: '', password: '', fullName: '', phone: '',
    instagram: '', sizeTop: '', referral: '',
  })

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const inputStyle = {
    width: '100%', background: '#0d0d0d',
    border: '1px solid #222', color: '#fff',
    padding: '13px 14px', fontSize: '13px',
    fontFamily: "'Inter', sans-serif", outline: 'none',
    transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }

  const labelStyle = {
    fontSize: '9px', fontWeight: 700, letterSpacing: '2px',
    color: '#555', textTransform: 'uppercase', display: 'block', marginBottom: '6px',
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password || !form.fullName) {
      setError('Name, email and password are required.')
      return
    }
    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data, error: authErr } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: { data: { full_name: form.fullName } },
      })
      if (authErr) throw authErr

      if (data.user) {
        await supabase.from('ms_members').upsert({
          id: data.user.id,
          email: form.email,
          full_name: form.fullName,
          phone: form.phone || null,
          instagram: form.instagram || null,
          size_top: form.sizeTop || null,
          referral_code: form.referral || null,
        })
      }
      setSuccess('Account created! Check your email to confirm, then log in.')
    } catch (err) {
      setError(err.message || 'Signup failed. Try again.')
    }
    setLoading(false)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    if (!form.email || !form.password) { setError('Email and password required.'); return }
    setLoading(true)
    setError('')
    try {
      const { error: authErr } = await supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password,
      })
      if (authErr) throw authErr
      window.location.href = '/profile'
    } catch (err) {
      setError(err.message || 'Login failed. Check your credentials.')
    }
    setLoading(false)
  }

  const handleForgot = async (e) => {
    e.preventDefault()
    if (!form.email) { setError('Enter your email address.'); return }
    setLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.auth.resetPasswordForEmail(form.email, {
        redirectTo: `${window.location.origin}/profile`,
      })
      if (err) throw err
      setSuccess('Password reset email sent. Check your inbox.')
    } catch (err) {
      setError(err.message || 'Failed to send reset email.')
    }
    setLoading(false)
  }

  const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
      <div style={{ width: '100%', maxWidth: '480px' }}>

        {/* Logo */}
        <a href="/" style={{ display: 'flex', justifyContent: 'center', marginBottom: '48px', textDecoration: 'none' }}>
          <Logo variant="lockup" size={13} color="#fff" />
        </a>

        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: '2px', marginBottom: '32px' }}>
          {[['signup', 'Create Account'], ['login', 'Sign In']].map(([m, label]) => (
            <button key={m} onClick={() => { setMode(m); setError(''); setSuccess('') }} style={{
              flex: 1, padding: '12px',
              background: mode === m ? 'var(--white)' : '#0d0d0d',
              border: `1px solid ${mode === m ? 'var(--white)' : '#222'}`,
              color: mode === m ? 'var(--black)' : '#555',
              fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.18s',
              fontFamily: "'Inter', sans-serif",
            }}>{label}</button>
          ))}
        </div>

        {/* Messages */}
        {error && (
          <div style={{ background: '#1a0000', border: '1px solid var(--red)', padding: '12px 16px', marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', color: 'var(--red)', lineHeight: 1.6 }}>{error}</p>
          </div>
        )}
        {success && (
          <div style={{ background: '#001a00', border: '1px solid #0a5', padding: '12px 16px', marginBottom: '20px' }}>
            <p style={{ fontSize: '12px', color: '#4d4', lineHeight: 1.6 }}>{success}</p>
          </div>
        )}

        {/* SIGNUP */}
        {mode === 'signup' && !success && (
          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); if (!form.fullName || !form.email || !form.password) { setError('Name, email and password required.'); return } if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return } setError(''); setStep(2) } : handleSignup}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

              {step === 1 && (
                <>
                  <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Step 1 of 2 · Account Details
                  </p>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input value={form.fullName} onChange={e => set('fullName', e.target.value)} placeholder="Your name" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Email *</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Password * (min 8 characters)</label>
                    <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" style={inputStyle} />
                  </div>
                  <button type="submit" style={{ width: '100%', padding: '14px', background: 'var(--red)', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', marginTop: '8px', fontFamily: "'Inter', sans-serif" }}>
                    Continue →
                  </button>
                </>
              )}

              {step === 2 && (
                <>
                  <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '4px' }}>
                    Step 2 of 2 · Your Profile
                  </p>
                  <div>
                    <label style={labelStyle}>Phone (optional)</label>
                    <input value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+1 (555) 000-0000" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Instagram (optional)</label>
                    <input value={form.instagram} onChange={e => set('instagram', e.target.value)} placeholder="@yourhandle" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Your Size (Top)</label>
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {sizes.map(s => (
                        <button key={s} type="button" onClick={() => set('sizeTop', s)} style={{
                          flex: 1, padding: '9px 4px',
                          background: form.sizeTop === s ? 'var(--white)' : '#0d0d0d',
                          border: `1px solid ${form.sizeTop === s ? 'var(--white)' : '#222'}`,
                          color: form.sizeTop === s ? 'var(--black)' : '#555',
                          fontSize: '8px', fontWeight: 700, letterSpacing: '1px',
                          cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                        }}>{s}</button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label style={labelStyle}>How did you hear about us?</label>
                    <input value={form.referral} onChange={e => set('referral', e.target.value)} placeholder="Instagram, friend, event..." style={inputStyle} />
                  </div>

                  <div style={{ background: '#0a0a0a', border: '1px solid #1a1a1a', padding: '16px', marginTop: '4px' }}>
                    <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '8px' }}>Apply for OG Membership</p>
                    <p style={{ fontSize: '11px', color: '#555', lineHeight: 1.7 }}>
                      OG Members receive a free cap + tank top on every drop. Membership is by approval only — based on how early you joined and recommendation from our founding partners.
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', marginTop: '4px' }}>
                    <button type="button" onClick={() => { setStep(1); setError('') }} style={{ flex: 1, padding: '14px', background: 'transparent', color: '#555', border: '1px solid #222', fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                      ← Back
                    </button>
                    <button type="submit" disabled={loading} style={{ flex: 2, padding: '14px', background: loading ? '#333' : 'var(--red)', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif" }}>
                      {loading ? 'Creating Account...' : 'Create Account'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </form>
        )}

        {/* LOGIN */}
        {mode === 'login' && (
          <form onSubmit={mode === 'forgot' ? handleForgot : handleLogin}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {mode !== 'forgot' ? (
                <>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" style={inputStyle} />
                  </div>
                  <div>
                    <label style={labelStyle}>Password</label>
                    <input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" style={inputStyle} />
                  </div>
                  <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#333' : 'var(--red)', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif" }}>
                    {loading ? 'Signing In...' : 'Sign In'}
                  </button>
                  <button type="button" onClick={() => { setMode('forgot'); setError(''); setSuccess('') }} style={{ background: 'none', border: 'none', color: '#444', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                    Forgot password?
                  </button>
                </>
              ) : (
                <>
                  <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.7 }}>Enter your email and we'll send a reset link.</p>
                  <div>
                    <label style={labelStyle}>Email</label>
                    <input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="your@email.com" style={inputStyle} />
                  </div>
                  <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: loading ? '#333' : 'var(--red)', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', cursor: loading ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif" }}>
                    {loading ? 'Sending...' : 'Send Reset Link'}
                  </button>
                  <button type="button" onClick={() => { setMode('login'); setError(''); setSuccess('') }} style={{ background: 'none', border: 'none', color: '#444', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer', fontFamily: "'Inter', sans-serif" }}>
                    ← Back to Login
                  </button>
                </>
              )}
            </div>
          </form>
        )}

        <div style={{ marginTop: '48px', borderTop: '1px solid #111', paddingTop: '24px', textAlign: 'center' }}>
          <p style={{ fontSize: '10px', color: '#333', letterSpacing: '1px' }}>© 2026 Motion Sickness by S55. All rights reserved.</p>
        </div>
      </div>
    </div>
  )
}
