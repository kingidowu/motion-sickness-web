import { useState } from 'react'

export default function SizeRecommender({ product, onSelect }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)
  const [form, setForm] = useState({ height: '', weight: '', fit: '' })
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const fits = ['Slim / Fitted', 'True to size', 'Oversized / Relaxed']

  const submit = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/ai-size', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, product }),
      })
      const data = await res.json()
      setResult(data.recommendation)
      setStep(3)
    } catch {
      setResult('We recommend checking our size guide or sizing up for a relaxed fit.')
      setStep(3)
    }
    setLoading(false)
  }

  const extractSize = (text) => {
    const match = text?.match(/\b(XS|S|M|L|XL|2XL|3XL)\b/)
    return match ? match[1] : null
  }

  const inputStyle = {
    width: '100%', background: '#111', border: '1px solid #222',
    color: '#fff', padding: '11px 14px', fontSize: '14px',
    fontFamily: "'Inter', sans-serif", outline: 'none',
  }

  if (!open) return (
    <button onClick={() => setOpen(true)} style={{
      background: 'none', border: 'none', color: '#555', fontSize: '10px',
      letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer',
      textDecoration: 'underline', padding: 0,
    }}>
      Not sure of your size? Ask AI
    </button>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1001, background: 'rgba(0,0,0,0.92)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}
      onClick={e => e.target === e.currentTarget && setOpen(false)}>
      <div style={{ background: '#0d0d0d', border: '1px solid #1e1e1e', maxWidth: '400px', width: '100%', padding: '40px 36px', textAlign: 'center' }}>

        <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '4px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '12px' }}>
          AI Size Guide
        </p>
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '3px', color: '#fff', marginBottom: '32px' }}>
          FIND YOUR SIZE
        </p>

        {step === 0 && (
          <>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>What's your height?</p>
            <input style={inputStyle} placeholder="e.g. 5'10\" or 178cm" value={form.height}
              onChange={e => setForm(f => ({ ...f, height: e.target.value }))}
              onFocus={e => e.target.style.borderColor = '#CC0000'}
              onBlur={e => e.target.style.borderColor = '#222'} />
            <button onClick={() => form.height && setStep(1)} style={{ marginTop: '16px', width: '100%', padding: '13px', background: form.height ? 'var(--red)' : '#222', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', cursor: form.height ? 'pointer' : 'not-allowed' }}>
              Next →
            </button>
          </>
        )}

        {step === 1 && (
          <>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>What's your weight?</p>
            <input style={inputStyle} placeholder="e.g. 170lbs or 77kg" value={form.weight}
              onChange={e => setForm(f => ({ ...f, weight: e.target.value }))}
              onFocus={e => e.target.style.borderColor = '#CC0000'}
              onBlur={e => e.target.style.borderColor = '#222'} />
            <button onClick={() => form.weight && setStep(2)} style={{ marginTop: '16px', width: '100%', padding: '13px', background: form.weight ? 'var(--red)' : '#222', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', cursor: form.weight ? 'pointer' : 'not-allowed' }}>
              Next →
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <p style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>How do you like your fit?</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
              {fits.map(f => (
                <button key={f} onClick={() => setForm(prev => ({ ...prev, fit: f }))} style={{
                  padding: '12px', background: form.fit === f ? 'var(--red)' : '#111',
                  border: `1px solid ${form.fit === f ? 'var(--red)' : '#222'}`,
                  color: '#fff', fontSize: '12px', cursor: 'pointer', transition: 'all 0.2s',
                }}>{f}</button>
              ))}
            </div>
            <button onClick={submit} disabled={!form.fit || loading} style={{ width: '100%', padding: '13px', background: form.fit ? 'var(--red)' : '#222', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', cursor: form.fit ? 'pointer' : 'not-allowed' }}>
              {loading ? 'Analyzing...' : 'Get My Size'}
            </button>
          </>
        )}

        {step === 3 && result && (
          <>
            <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: '24px', marginBottom: '24px' }}>
              <p style={{ fontSize: '13px', color: '#fff', lineHeight: 1.8 }}>{result}</p>
            </div>
            {extractSize(result) && onSelect && (
              <button onClick={() => { onSelect(extractSize(result)); setOpen(false) }} style={{ width: '100%', padding: '13px', background: 'var(--red)', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer', marginBottom: '12px' }}>
                Use {extractSize(result)} — Apply to Order
              </button>
            )}
            <button onClick={() => setOpen(false)} style={{ background: 'none', border: 'none', color: '#555', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>
              Close
            </button>
          </>
        )}

        {/* Step dots */}
        {step < 3 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '6px', marginTop: '24px' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width: '6px', height: '6px', borderRadius: '50%', background: i <= step ? 'var(--red)' : '#222' }} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
