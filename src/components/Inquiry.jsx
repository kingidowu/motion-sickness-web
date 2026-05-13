import { useState, useEffect, useRef } from 'react'
import Logo from './Logo'
import { supabase } from '../lib/supabase'
import SizeRecommender from './SizeRecommender'

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

const COUNTRIES = [
  { code: 'US', name: 'United States' },
  { code: 'CA', name: 'Canada' },
  { code: 'GB', name: 'United Kingdom' },
  { code: 'AU', name: 'Australia' },
  { code: 'NG', name: 'Nigeria' },
  { code: 'GH', name: 'Ghana' },
  { code: 'ZA', name: 'South Africa' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'NL', name: 'Netherlands' },
  { code: 'ES', name: 'Spain' },
  { code: 'IT', name: 'Italy' },
  { code: 'JP', name: 'Japan' },
  { code: 'KR', name: 'South Korea' },
  { code: 'SG', name: 'Singapore' },
  { code: 'AE', name: 'UAE' },
  { code: 'MX', name: 'Mexico' },
  { code: 'BR', name: 'Brazil' },
  { code: 'TT', name: 'Trinidad & Tobago' },
  { code: 'JM', name: 'Jamaica' },
  { code: 'OTHER', name: 'Other' },
]

const CARRIER_LABELS = {
  USPS: 'USPS',
  UPS: 'UPS',
  FedEx: 'FedEx',
  DHL: 'DHL',
  DHLExpress: 'DHL Express',
}

function carrierColor(carrier) {
  if (carrier === 'USPS') return '#004B87'
  if (carrier === 'UPS') return '#7B3F00'
  if (carrier?.includes('FedEx')) return '#4D148C'
  if (carrier?.includes('DHL')) return '#D40511'
  return '#444'
}

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
  const [address, setAddress] = useState({
    line1: '',
    line2: '',
    city: '',
    state: '',
    zip: '',
    country: 'US',
  })
  const [shippingRates, setShippingRates] = useState([])
  const [selectedRate, setSelectedRate] = useState(null)
  const [shippingLoading, setShippingLoading] = useState(false)
  const [shippingError, setShippingError] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const addressRef = useRef(null)
  const autocompleteRef = useRef(null)

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }))
  const setAddr = (key, val) => {
    setAddress(a => ({ ...a, [key]: val }))
    setShippingRates([])
    setSelectedRate(null)
  }

  // Load Google Places Autocomplete
  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey) return

    const initAutocomplete = () => {
      if (!window.google?.maps?.places || !addressRef.current) return
      autocompleteRef.current = new window.google.maps.places.Autocomplete(addressRef.current, {
        types: ['address'],
      })
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace()
        if (!place.address_components) return
        const get = type => place.address_components.find(c => c.types.includes(type))?.long_name || ''
        const getShort = type => place.address_components.find(c => c.types.includes(type))?.short_name || ''
        const streetNum = get('street_number')
        const route = get('route')
        setAddress({
          line1: [streetNum, route].filter(Boolean).join(' '),
          line2: '',
          city: get('locality') || get('sublocality') || get('postal_town'),
          state: getShort('administrative_area_level_1'),
          zip: get('postal_code'),
          country: getShort('country') || 'US',
        })
        setShippingRates([])
        setSelectedRate(null)
      })
    }

    if (window.google?.maps?.places) {
      initAutocomplete()
    } else if (!document.getElementById('gplaces-script')) {
      const script = document.createElement('script')
      script.id = 'gplaces-script'
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
      script.async = true
      script.onload = initAutocomplete
      document.head.appendChild(script)
    }
  }, [])

  const calculateShipping = async () => {
    if (!address.line1 || !address.city || !address.country) {
      setShippingError('Please enter your full address first.')
      return
    }
    setShippingLoading(true)
    setShippingError(null)
    setShippingRates([])
    setSelectedRate(null)
    try {
      const res = await fetch('/api/shipping-rates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: {
            name: form.name || 'Customer',
            street1: address.line1,
            street2: address.line2 || undefined,
            city: address.city,
            state: address.state || undefined,
            zip: address.zip || undefined,
            country: address.country,
          },
          product: form.product,
          quantity: form.quantity,
        }),
      })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setShippingRates(data.rates || [])
      if (data.rates?.length === 0) setShippingError('No shipping options found for this address.')
    } catch (err) {
      setShippingError('Could not calculate shipping. Check your address and try again.')
    }
    setShippingLoading(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const shippingNote = selectedRate
      ? `Shipping: ${selectedRate.carrier} ${selectedRate.service} — $${selectedRate.rate.toFixed(2)}`
      : address.line1
        ? `Ship to: ${address.line1}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`
        : ''

    const fullMessage = [form.message, shippingNote].filter(Boolean).join('\n')
    const shippingAddress = address.line1
      ? `${address.line1}${address.line2 ? ', ' + address.line2 : ''}, ${address.city}, ${address.state} ${address.zip}, ${address.country}`
      : null

    if (supabase) await supabase.from('ms_inquiries').insert({
      name: form.name,
      email: form.email,
      instagram: form.instagram || null,
      product: form.product,
      size: form.size || null,
      quantity: parseInt(form.quantity) || 1,
      og_member: form.ogMember,
      message: fullMessage || null,
    }).then(() => {})

    await fetch('/api/send-inquiry', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.name, email: form.email, product: form.product,
        size: form.size, quantity: form.quantity, ogMember: form.ogMember,
        message: form.message,
        shippingAddress,
        shippingOption: selectedRate
          ? `${selectedRate.carrier} ${selectedRate.service} — $${selectedRate.rate.toFixed(2)} (${selectedRate.estimated_delivery_date || ''})`
          : null,
      }),
    }).catch(() => {})

    setSubmitted(true)
  }

  const inputStyle = {
    width: '100%', background: '#111', border: '1px solid #222',
    color: '#fff', padding: '12px 14px', fontSize: '13px',
    fontFamily: "'Inter', sans-serif", outline: 'none', transition: 'border-color 0.2s',
    boxSizing: 'border-box',
  }
  const labelStyle = {
    fontSize: '9px', fontWeight: 700, letterSpacing: '2px',
    textTransform: 'uppercase', color: '#888', display: 'block', marginBottom: '6px',
  }
  const focus = e => { e.target.style.borderColor = '#CC0000' }
  const blur = e => { e.target.style.borderColor = '#222' }

  if (submitted) {
    return (
      <div style={{
        position: 'fixed', inset: 0, zIndex: 999,
        background: 'rgba(0,0,0,0.96)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px',
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

  const addressComplete = address.line1 && address.city && address.country

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 999,
      background: 'rgba(0,0,0,0.92)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      padding: '24px', overflowY: 'auto',
    }}
    onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div style={{
        background: 'var(--black-card)', border: '1px solid #1e1e1e',
        maxWidth: '560px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
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
            background: 'none', border: 'none', color: '#666', fontSize: '20px', cursor: 'pointer', lineHeight: 1,
          }}>✕</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '32px' }}>

          {/* Name + Email */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>Full Name *</label>
              <input style={inputStyle} required placeholder="Your name"
                value={form.name} onChange={e => set('name', e.target.value)}
                onFocus={focus} onBlur={blur} />
            </div>
            <div>
              <label style={labelStyle}>Email *</label>
              <input style={inputStyle} type="email" required placeholder="your@email.com"
                value={form.email} onChange={e => set('email', e.target.value)}
                onFocus={focus} onBlur={blur} />
            </div>
          </div>

          {/* Instagram */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Instagram (optional)</label>
            <input style={inputStyle} placeholder="@yourhandle"
              value={form.instagram} onChange={e => set('instagram', e.target.value)}
              onFocus={focus} onBlur={blur} />
          </div>

          {/* Product */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Item of Interest *</label>
            <select style={{ ...inputStyle, cursor: 'pointer' }} required
              value={form.product} onChange={e => { set('product', e.target.value); setShippingRates([]); setSelectedRate(null) }}
              onFocus={focus} onBlur={blur}>
              <option value="">Select a product...</option>
              {products.map(p => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>

          {/* Size + Quantity */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <label style={labelStyle}>Size</label>
                <SizeRecommender product={form.product} onSelect={s => set('size', s)} />
              </div>
              <select style={{ ...inputStyle, cursor: 'pointer' }}
                value={form.size} onChange={e => set('size', e.target.value)}>
                <option value="">Select size...</option>
                {['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'].map(s => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Quantity</label>
              <input style={inputStyle} type="number" min="1" max="99"
                value={form.quantity} onChange={e => { set('quantity', e.target.value); setShippingRates([]); setSelectedRate(null) }}
                onFocus={focus} onBlur={blur} />
            </div>
          </div>

          {/* OG Member */}
          <div style={{
            marginBottom: '16px',
            border: `1px solid ${form.ogMember ? 'var(--red)' : '#1e1e1e'}`,
            padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px',
            cursor: 'pointer', transition: 'border-color 0.2s',
          }} onClick={() => set('ogMember', !form.ogMember)}>
            <div style={{
              width: '18px', height: '18px', flexShrink: 0,
              border: `1px solid ${form.ogMember ? 'var(--red)' : '#444'}`,
              background: form.ogMember ? 'var(--red)' : 'transparent',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              {form.ogMember && <span style={{ color: 'white', fontSize: '11px' }}>✓</span>}
            </div>
            <div>
              <p style={{ fontSize: '11px', fontWeight: 600, color: 'var(--white)', letterSpacing: '1px' }}>I am an OG Member</p>
              <p style={{ fontSize: '10px', color: '#666', marginTop: '2px' }}>Original members receive their cap + tank top free</p>
            </div>
          </div>

          {/* Message */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Message / Notes</label>
            <textarea style={{ ...inputStyle, resize: 'vertical', minHeight: '80px' }}
              placeholder="Custom requests, colorway preferences, delivery notes..."
              value={form.message} onChange={e => set('message', e.target.value)}
              onFocus={focus} onBlur={blur} />
          </div>

          {/* ── Shipping Address ── */}
          <div style={{ borderTop: '1px solid #1a1a1a', paddingTop: '24px', marginBottom: '8px' }}>
            <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '4px', color: '#CC0000', textTransform: 'uppercase', marginBottom: '20px' }}>
              Shipping Address
            </p>

            {/* Country */}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Country *</label>
              <select style={{ ...inputStyle, cursor: 'pointer' }}
                value={address.country} onChange={e => setAddr('country', e.target.value)}
                onFocus={focus} onBlur={blur}>
                {COUNTRIES.map(c => <option key={c.code} value={c.code}>{c.name}</option>)}
              </select>
            </div>

            {/* Street */}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Street Address *</label>
              <input
                ref={addressRef}
                style={inputStyle}
                placeholder="Start typing your address..."
                value={address.line1}
                onChange={e => setAddr('line1', e.target.value)}
                onFocus={focus} onBlur={blur}
                autoComplete="off"
              />
            </div>

            {/* Apt */}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Apt / Suite / Unit</label>
              <input style={inputStyle} placeholder="Optional"
                value={address.line2} onChange={e => setAddr('line2', e.target.value)}
                onFocus={focus} onBlur={blur} />
            </div>

            {/* City + State + ZIP */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
              <div>
                <label style={labelStyle}>City *</label>
                <input style={inputStyle} placeholder="City"
                  value={address.city} onChange={e => setAddr('city', e.target.value)}
                  onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelStyle}>State / Province</label>
                <input style={inputStyle} placeholder="State"
                  value={address.state} onChange={e => setAddr('state', e.target.value)}
                  onFocus={focus} onBlur={blur} />
              </div>
              <div>
                <label style={labelStyle}>ZIP / Postal</label>
                <input style={inputStyle} placeholder="ZIP"
                  value={address.zip} onChange={e => setAddr('zip', e.target.value)}
                  onFocus={focus} onBlur={blur} />
              </div>
            </div>

            {/* Calculate button */}
            <button type="button" onClick={calculateShipping}
              disabled={shippingLoading || !addressComplete}
              style={{
                width: '100%', padding: '13px',
                background: addressComplete ? '#0d0d0d' : '#080808',
                border: `1px solid ${addressComplete ? '#CC0000' : '#1e1e1e'}`,
                color: addressComplete ? '#CC0000' : '#333',
                fontSize: '10px', fontWeight: 700, letterSpacing: '3px',
                textTransform: 'uppercase', cursor: addressComplete ? 'pointer' : 'not-allowed',
                transition: 'all 0.2s',
              }}>
              {shippingLoading ? 'Calculating...' : '⟳ Calculate Shipping Rates'}
            </button>

            {shippingError && (
              <p style={{ fontSize: '11px', color: '#CC0000', marginTop: '10px', textAlign: 'center' }}>
                {shippingError}
              </p>
            )}
          </div>

          {/* ── Shipping Options ── */}
          {shippingRates.length > 0 && (
            <div style={{ marginBottom: '24px', marginTop: '16px' }}>
              <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '4px', color: '#888', textTransform: 'uppercase', marginBottom: '12px' }}>
                Select Shipping Option
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {shippingRates.map(rate => {
                  const selected = selectedRate?.id === rate.id
                  return (
                    <div key={rate.id}
                      onClick={() => setSelectedRate(rate)}
                      style={{
                        border: `1px solid ${selected ? '#CC0000' : '#1e1e1e'}`,
                        background: selected ? '#0d0d0d' : '#080808',
                        padding: '14px 16px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        transition: 'all 0.15s',
                      }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{
                          width: '16px', height: '16px', borderRadius: '50%', flexShrink: 0,
                          border: `2px solid ${selected ? '#CC0000' : '#333'}`,
                          background: selected ? '#CC0000' : 'transparent',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                          {selected && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#fff' }} />}
                        </div>
                        <div>
                          <p style={{ fontSize: '12px', color: '#fff', fontWeight: 600, marginBottom: '2px' }}>
                            <span style={{
                              display: 'inline-block', background: carrierColor(rate.carrier),
                              color: '#fff', fontSize: '8px', fontWeight: 700, letterSpacing: '1px',
                              padding: '2px 5px', marginRight: '6px', textTransform: 'uppercase',
                            }}>{CARRIER_LABELS[rate.carrier] || rate.carrier}</span>
                            {rate.service}
                          </p>
                          {rate.estimated_delivery_date && (
                            <p style={{ fontSize: '10px', color: '#555' }}>{rate.estimated_delivery_date}</p>
                          )}
                        </div>
                      </div>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: selected ? '#CC0000' : '#fff' }}>
                        ${rate.rate.toFixed(2)}
                      </p>
                    </div>
                  )
                })}
              </div>
              {!selectedRate && (
                <p style={{ fontSize: '10px', color: '#444', marginTop: '8px', textAlign: 'center' }}>
                  Select a shipping option to continue
                </p>
              )}
            </div>
          )}

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
            textTransform: 'uppercase', transition: 'background 0.2s',
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
