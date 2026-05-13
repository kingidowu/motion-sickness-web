import { useState } from 'react'
import { supabase } from '../lib/supabase'

const US_TAX_RATES = {
  AL:0.09,AK:0,AZ:0.084,AR:0.095,CA:0.0725,CO:0.029,CT:0.0635,DE:0,FL:0.06,
  GA:0.04,HI:0.04,ID:0.06,IL:0.0625,IN:0.07,IA:0.06,KS:0.065,KY:0.06,LA:0.0445,
  ME:0.055,MD:0.06,MA:0.0625,MI:0.06,MN:0.06875,MS:0.07,MO:0.04225,MT:0,
  NE:0.055,NV:0.0685,NH:0,NJ:0.06625,NM:0.05125,NY:0.04,NC:0.0475,ND:0.05,
  OH:0.0575,OK:0.045,OR:0,PA:0.06,RI:0.07,SC:0.06,SD:0.045,TN:0.07,TX:0.0625,
  UT:0.0485,VT:0.06,VA:0.053,WA:0.065,WV:0.06,WI:0.05,WY:0.04,DC:0.06,
}

const SHIPPING_OPTIONS = [
  { id: 'standard', label: 'Standard Shipping', days: '5–7 business days', price: 8.99 },
  { id: 'express',  label: 'Express Shipping',  days: '2–3 business days', price: 18.99 },
  { id: 'overnight',label: 'Overnight',          days: '1 business day',    price: 34.99 },
  { id: 'intl',     label: 'International',      days: '10–14 business days',price: 45.00 },
]

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]

function formatCard(val) {
  return val.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim()
}
function formatExpiry(val) {
  const d = val.replace(/\D/g,'').slice(0,4)
  return d.length > 2 ? d.slice(0,2)+'/'+d.slice(2) : d
}

export default function Checkout({ item, onClose }) {
  const [step, setStep] = useState(1)
  const [qty, setQty] = useState(1)
  const [size, setSize] = useState('')
  const [addr, setAddr] = useState({ name:'', email:'', phone:'', line1:'', line2:'', city:'', state:'TX', zip:'', country:'US' })
  const [shipping, setShipping] = useState('standard')
  const [card, setCard] = useState({ number:'', expiry:'', cvv:'', name:'' })
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [errors, setErrors] = useState({})

  const shippingOption = SHIPPING_OPTIONS.find(s => s.id === shipping)
  const subtotal = item.price * qty
  const shippingCost = shippingOption.price
  const taxRate = addr.country === 'US' ? (US_TAX_RATES[addr.state] || 0) : 0
  const tax = subtotal * taxRate
  const total = subtotal + shippingCost + tax

  const validateStep1 = () => {
    const e = {}
    if (!addr.name.trim()) e.name = 'Required'
    if (!addr.email.includes('@')) e.email = 'Invalid email'
    if (!addr.line1.trim()) e.line1 = 'Required'
    if (!addr.city.trim()) e.city = 'Required'
    if (!addr.zip.trim()) e.zip = 'Required'
    if (item.sizes && !size) e.size = 'Select a size'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep3 = () => {
    const e = {}
    const num = card.number.replace(/\s/g,'')
    if (num.length < 16) e.number = 'Invalid card number'
    if (!card.expiry.includes('/') || card.expiry.length < 5) e.expiry = 'Invalid'
    if (card.cvv.length < 3) e.cvv = 'Invalid'
    if (!card.name.trim()) e.cardName = 'Required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const placeOrder = async () => {
    if (!validateStep3()) return
    setLoading(true)
    try {
      const orderData = {
        member_email: addr.email,
        items: [{ product_id: item.id || item.name, name: item.name, price: item.price, qty, size }],
        status: 'pending',
        total_cents: Math.round(total * 100),
        shipping_address: { ...addr, shipping_method: shipping },
        notes: `Shipping: ${shippingOption.label} · Tax: ${(taxRate*100).toFixed(2)}%`,
      }
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) orderData.member_id = user.id
        await supabase.from('ms_orders').insert(orderData)
      }
    } catch {}
    setLoading(false)
    setDone(true)
  }

  const field = (label, key, opts={}) => (
    <div style={{ marginBottom: '14px' }}>
      <label style={{ display: 'block', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: errors[key] ? 'var(--red)' : '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
        {label}{errors[key] ? ` — ${errors[key]}` : ''}
      </label>
      <input
        {...opts}
        value={opts.value ?? addr[key] ?? ''}
        onChange={e => {
          if (opts.onChange) opts.onChange(e)
          else setAddr(a => ({ ...a, [key]: e.target.value }))
          setErrors(er => ({ ...er, [key]: undefined }))
        }}
        style={{
          width: '100%', background: '#0d0d0d', border: `1px solid ${errors[key] ? 'var(--red)' : '#222'}`,
          color: '#fff', padding: '11px 14px', fontSize: '13px',
          fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box',
        }}
      />
    </div>
  )

  if (done) return (
    <Overlay onClose={onClose}>
      <div style={{ textAlign: 'center', padding: '16px 0' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>✓</div>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '32px', letterSpacing: '4px', color: '#fff', marginBottom: '8px' }}>ORDER RECEIVED</h2>
        <p style={{ fontSize: '13px', color: '#888', lineHeight: 1.8, marginBottom: '8px' }}>
          Thank you, {addr.name.split(' ')[0]}. Your order for <strong style={{ color: '#fff' }}>{item.name}</strong> has been placed.
        </p>
        <p style={{ fontSize: '11px', color: '#555', lineHeight: 1.8, marginBottom: '32px' }}>
          Order total: <strong style={{ color: '#fff' }}>${total.toFixed(2)}</strong><br />
          Confirmation will be sent to <strong style={{ color: '#fff' }}>{addr.email}</strong><br />
          Our team will follow up within 24 hours.
        </p>
        <button onClick={onClose} style={btnStyle()}>Back to Shop</button>
      </div>
    </Overlay>
  )

  return (
    <Overlay onClose={onClose}>
      {/* Steps */}
      <div style={{ display: 'flex', gap: '2px', marginBottom: '32px' }}>
        {['Shipping', 'Delivery', 'Payment'].map((s,i) => (
          <div key={s} style={{ flex: 1, padding: '8px', textAlign: 'center', background: step === i+1 ? '#fff' : step > i+1 ? '#222' : '#0d0d0d', border: `1px solid ${step === i+1 ? '#fff' : '#1e1e1e'}`, cursor: step > i+1 ? 'pointer' : 'default' }}
            onClick={() => { if (step > i+1) setStep(i+1) }}>
            <p style={{ fontSize: '8px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: step === i+1 ? '#000' : step > i+1 ? '#888' : '#444' }}>{i+1}. {s}</p>
          </div>
        ))}
      </div>

      {/* Order summary bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', background: '#0d0d0d', border: '1px solid #1e1e1e', marginBottom: '24px' }}>
        <div>
          <p style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{item.name}</p>
          <p style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>
            {size ? `Size: ${size} · ` : ''}Qty: {qty}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '4px' }}>
            <button onClick={() => setQty(q => Math.max(1,q-1))} style={qtyBtn()}>−</button>
            <span style={{ width: '28px', textAlign: 'center', color: '#fff', fontSize: '13px', lineHeight: '28px' }}>{qty}</span>
            <button onClick={() => setQty(q => q+1)} style={qtyBtn()}>+</button>
          </div>
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: '22px', color: '#fff' }}>${(item.price * qty).toFixed(0)}</span>
        </div>
      </div>

      {/* STEP 1 — Shipping address */}
      {step === 1 && (
        <div>
          <p style={sectionLabel()}>Contact & Shipping Address</p>
          {item.sizes && (
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: errors.size ? 'var(--red)' : '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                Size{errors.size ? ' — Required' : ''}
              </label>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {item.sizes.map(s => (
                  <button key={s} onClick={() => { setSize(s); setErrors(e => ({...e, size: undefined})) }}
                    style={{ padding: '8px 16px', background: size === s ? '#fff' : 'transparent', border: `1px solid ${size === s ? '#fff' : errors.size ? 'var(--red)' : '#333'}`, color: size === s ? '#000' : '#666', fontSize: '10px', fontWeight: 700, letterSpacing: '1px', cursor: 'pointer' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 12px' }}>
            <div style={{ gridColumn: '1/-1' }}>{field('Full Name', 'name', { placeholder: 'First Last' })}</div>
            <div>{field('Email', 'email', { type: 'email', placeholder: 'you@email.com' })}</div>
            <div>{field('Phone', 'phone', { type: 'tel', placeholder: '+1 (555) 000-0000' })}</div>
            <div style={{ gridColumn: '1/-1' }}>{field('Address', 'line1', { placeholder: '123 Main St' })}</div>
            <div style={{ gridColumn: '1/-1' }}>{field('Apt / Suite (optional)', 'line2', { placeholder: 'Apt 4B' })}</div>
            <div>{field('City', 'city', { placeholder: 'Houston' })}</div>
            <div>
              <label style={{ display: 'block', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>Country</label>
              <select value={addr.country} onChange={e => setAddr(a => ({...a, country: e.target.value, state: e.target.value === 'US' ? 'TX' : ''}))}
                style={{ width: '100%', background: '#0d0d0d', border: '1px solid #222', color: '#fff', padding: '11px 14px', fontSize: '13px', outline: 'none', marginBottom: '14px', boxSizing: 'border-box' }}>
                <option value="US">United States</option>
                <option value="CA">Canada</option>
                <option value="GB">United Kingdom</option>
                <option value="AU">Australia</option>
                <option value="NG">Nigeria</option>
                <option value="GH">Ghana</option>
                <option value="other">Other</option>
              </select>
            </div>
            {addr.country === 'US' ? (
              <div>
                <label style={{ display: 'block', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: '#666', textTransform: 'uppercase', marginBottom: '6px' }}>State</label>
                <select value={addr.state} onChange={e => setAddr(a => ({...a, state: e.target.value}))}
                  style={{ width: '100%', background: '#0d0d0d', border: '1px solid #222', color: '#fff', padding: '11px 14px', fontSize: '13px', outline: 'none', marginBottom: '14px', boxSizing: 'border-box' }}>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            ) : (
              <div>{field('State / Province', 'state', { placeholder: 'State' })}</div>
            )}
            <div style={{ gridColumn: '1/-1' }}>{field('ZIP / Postal Code', 'zip', { placeholder: '77001' })}</div>
          </div>
          <button onClick={() => { if (validateStep1()) setStep(2) }} style={btnStyle()}>Continue to Delivery →</button>
        </div>
      )}

      {/* STEP 2 — Shipping method */}
      {step === 2 && (
        <div>
          <p style={sectionLabel()}>Select Shipping Method</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '28px' }}>
            {SHIPPING_OPTIONS.map(opt => (
              <div key={opt.id} onClick={() => setShipping(opt.id)}
                style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 18px', background: shipping === opt.id ? '#111' : '#080808', border: `1px solid ${shipping === opt.id ? '#fff' : '#1e1e1e'}`, cursor: 'pointer', transition: 'border-color 0.15s' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '14px', height: '14px', borderRadius: '50%', border: `2px solid ${shipping === opt.id ? '#fff' : '#444'}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {shipping === opt.id && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                  </div>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 600, color: '#fff' }}>{opt.label}</p>
                    <p style={{ fontSize: '10px', color: '#555', marginTop: '2px' }}>{opt.days}</p>
                  </div>
                </div>
                <span style={{ fontFamily: "'Bebas Neue'", fontSize: '18px', color: '#fff' }}>${opt.price.toFixed(2)}</span>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div style={{ border: '1px solid #1e1e1e', padding: '18px', marginBottom: '24px', background: '#080808' }}>
            <p style={sectionLabel()}>Order Summary</p>
            <Row label={`${item.name} × ${qty}`} val={`$${subtotal.toFixed(2)}`} />
            <Row label={`Shipping (${shippingOption.label})`} val={`$${shippingCost.toFixed(2)}`} />
            {taxRate > 0 && <Row label={`Tax (${addr.state} ${(taxRate*100).toFixed(2)}%)`} val={`$${tax.toFixed(2)}`} />}
            {taxRate === 0 && <Row label="Tax" val="—" dim />}
            <div style={{ borderTop: '1px solid #1e1e1e', marginTop: '12px', paddingTop: '12px', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', color: '#fff' }}>Total</span>
              <span style={{ fontFamily: "'Bebas Neue'", fontSize: '22px', color: '#fff' }}>${total.toFixed(2)}</span>
            </div>
          </div>

          <button onClick={() => setStep(3)} style={btnStyle()}>Continue to Payment →</button>
        </div>
      )}

      {/* STEP 3 — Payment */}
      {step === 3 && (
        <div>
          <p style={sectionLabel()}>Payment Details</p>
          <div style={{ marginBottom: '14px' }}>
            <label style={{ display: 'block', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: errors.number ? 'var(--red)' : '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
              Card Number{errors.number ? ` — ${errors.number}` : ''}
            </label>
            <input
              value={card.number} placeholder="0000 0000 0000 0000"
              maxLength={19}
              onChange={e => { setCard(c => ({...c, number: formatCard(e.target.value)})); setErrors(er => ({...er, number: undefined})) }}
              style={{ width: '100%', background: '#0d0d0d', border: `1px solid ${errors.number ? 'var(--red)' : '#222'}`, color: '#fff', padding: '11px 14px', fontSize: '16px', letterSpacing: '3px', fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box' }}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '14px' }}>
            <div style={{ gridColumn: '1/3' }}>
              <label style={{ display: 'block', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: errors.expiry ? 'var(--red)' : '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                Expiry{errors.expiry ? ' — Invalid' : ''}
              </label>
              <input value={card.expiry} placeholder="MM/YY" maxLength={5}
                onChange={e => { setCard(c => ({...c, expiry: formatExpiry(e.target.value)})); setErrors(er => ({...er, expiry: undefined})) }}
                style={{ width: '100%', background: '#0d0d0d', border: `1px solid ${errors.expiry ? 'var(--red)' : '#222'}`, color: '#fff', padding: '11px 14px', fontSize: '14px', fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box', letterSpacing: '2px' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: errors.cvv ? 'var(--red)' : '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
                CVV{errors.cvv ? ' — Invalid' : ''}
              </label>
              <input value={card.cvv} placeholder="•••" maxLength={4} type="password"
                onChange={e => { setCard(c => ({...c, cvv: e.target.value.replace(/\D/,'').slice(0,4)})); setErrors(er => ({...er, cvv: undefined})) }}
                style={{ width: '100%', background: '#0d0d0d', border: `1px solid ${errors.cvv ? 'var(--red)' : '#222'}`, color: '#fff', padding: '11px 14px', fontSize: '14px', fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box' }}
              />
            </div>
          </div>
          <div style={{ marginBottom: '28px' }}>
            <label style={{ display: 'block', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: errors.cardName ? 'var(--red)' : '#666', textTransform: 'uppercase', marginBottom: '6px' }}>
              Name on Card{errors.cardName ? ' — Required' : ''}
            </label>
            <input value={card.name} placeholder="As it appears on card"
              onChange={e => { setCard(c => ({...c, name: e.target.value})); setErrors(er => ({...er, cardName: undefined})) }}
              style={{ width: '100%', background: '#0d0d0d', border: `1px solid ${errors.cardName ? 'var(--red)' : '#222'}`, color: '#fff', padding: '11px 14px', fontSize: '13px', fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box' }}
            />
          </div>

          {/* Final total */}
          <div style={{ border: '1px solid #1e1e1e', padding: '16px 18px', marginBottom: '20px', background: '#080808', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontSize: '9px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>Shipping to {addr.city}, {addr.state || addr.country}</p>
              <p style={{ fontSize: '10px', color: '#888' }}>{shippingOption.label} · {shippingOption.days}</p>
            </div>
            <div style={{ textAlign: 'right' }}>
              <p style={{ fontSize: '9px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '2px' }}>Total Due</p>
              <p style={{ fontFamily: "'Bebas Neue'", fontSize: '28px', color: '#fff' }}>${total.toFixed(2)}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <span style={{ fontSize: '11px' }}>🔒</span>
            <p style={{ fontSize: '10px', color: '#444' }}>Your payment information is encrypted and secure.</p>
          </div>

          <button onClick={placeOrder} disabled={loading}
            style={{ ...btnStyle(), opacity: loading ? 0.6 : 1, cursor: loading ? 'wait' : 'pointer' }}>
            {loading ? 'Processing...' : `Place Order — $${total.toFixed(2)}`}
          </button>
        </div>
      )}
    </Overlay>
  )
}

function Overlay({ onClose, children }) {
  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, zIndex: 3000, background: 'rgba(0,0,0,0.96)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', overflowY: 'auto', padding: '40px 16px' }}>
      <div onClick={e => e.stopPropagation()} style={{ width: '100%', maxWidth: '560px', background: '#111', border: '1px solid #1e1e1e', padding: '40px', position: 'relative', marginBottom: '40px' }}>
        <button onClick={onClose} style={{ position: 'absolute', top: '20px', right: '24px', background: 'none', border: 'none', color: '#555', fontSize: '22px', cursor: 'pointer', lineHeight: 1 }}>✕</button>
        <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '9px', letterSpacing: '5px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '6px' }}>Motion Sickness by S55</p>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '3px', color: '#fff', marginBottom: '28px' }}>CHECKOUT</h2>
        {children}
      </div>
    </div>
  )
}

function Row({ label, val, dim }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
      <span style={{ fontSize: '11px', color: dim ? '#444' : '#666' }}>{label}</span>
      <span style={{ fontSize: '11px', color: dim ? '#444' : '#aaa', fontWeight: 500 }}>{val}</span>
    </div>
  )
}

function btnStyle() {
  return {
    width: '100%', padding: '15px', background: '#fff', color: '#000',
    border: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '3px',
    textTransform: 'uppercase', cursor: 'pointer',
  }
}
function qtyBtn() {
  return {
    width: '28px', height: '28px', background: '#111', border: '1px solid #333',
    color: '#fff', fontSize: '14px', cursor: 'pointer', lineHeight: 1,
  }
}
function sectionLabel() {
  return { fontSize: '9px', fontWeight: 700, letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '16px' }
}
