import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabase'
import Logo from './Logo'

const MEMBERSHIP_LABELS = {
  standard: { label: 'Standard Member', color: '#555', badge: 'MEMBER' },
  og_pending: { label: 'OG Pending Approval', color: '#b8860b', badge: 'OG PENDING' },
  og_member: { label: 'OG Member', color: 'var(--red)', badge: 'OG MEMBER' },
}

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']

export default function MemberProfile() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [wishlist, setWishlist] = useState([])
  const [orders, setOrders] = useState([])
  const [tab, setTab] = useState('profile') // profile | wishlist | orders | ai
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [ogRequesting, setOgRequesting] = useState(false)
  const [editForm, setEditForm] = useState({})

  // AI chat state
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'Hey — your S55 Stylist here. I can see your size and style profile. What are you looking for from Drop 001?'
  }])
  const [aiInput, setAiInput] = useState('')
  const [aiLoading, setAiLoading] = useState(false)
  const chatRef = useRef(null)

  useEffect(() => {
    loadData()
  }, [])

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const loadData = async () => {
    const { data: { user: u } } = await supabase.auth.getUser()
    if (!u) { window.location.href = '/login'; return }
    setUser(u)

    const [{ data: prof }, { data: wish }, { data: ords }] = await Promise.all([
      supabase.from('ms_members').select('*').eq('id', u.id).single(),
      supabase.from('ms_wishlist').select('*').eq('member_id', u.id).order('created_at', { ascending: false }),
      supabase.from('ms_orders').select('*').eq('member_id', u.id).order('created_at', { ascending: false }),
    ])

    setProfile(prof || { id: u.id, email: u.email, membership: 'standard' })
    setEditForm(prof || { full_name: '', phone: '', instagram: '', size_top: '', style_notes: '' })
    setWishlist(wish || [])
    setOrders(ords || [])
    setLoading(false)
  }

  const saveProfile = async () => {
    setSaving(true)
    await supabase.from('ms_members').upsert({ ...editForm, id: user.id, email: user.email })
    setProfile(p => ({ ...p, ...editForm }))
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
    setSaving(false)
  }

  const requestOG = async () => {
    if (profile.membership !== 'standard') return
    setOgRequesting(true)
    await supabase.from('ms_members').update({ membership: 'og_pending' }).eq('id', user.id)
    setProfile(p => ({ ...p, membership: 'og_pending' }))
    setOgRequesting(false)
  }

  const removeWishlist = async (id) => {
    await supabase.from('ms_wishlist').delete().eq('id', id)
    setWishlist(w => w.filter(i => i.id !== id))
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    window.location.href = '/'
  }

  const sendAI = async (text) => {
    const msg = text || aiInput.trim()
    if (!msg || aiLoading) return
    setAiInput('')
    const context = `Member: ${profile?.full_name || 'Unknown'}. Size: ${profile?.size_top || 'not set'}. Membership: ${profile?.membership || 'standard'}. Style notes: ${profile?.style_notes || 'none'}.`
    const updated = [...messages, { role: 'user', content: msg }]
    setMessages(updated)
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai-stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated, context }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Try again.' }])
    }
    setAiLoading(false)
  }

  if (loading) return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '4px', color: '#333', textTransform: 'uppercase' }}>Loading...</p>
    </div>
  )

  const mem = MEMBERSHIP_LABELS[profile?.membership || 'standard']

  const inputStyle = {
    width: '100%', background: '#0d0d0d', border: '1px solid #1e1e1e',
    color: '#fff', padding: '12px 14px', fontSize: '13px',
    fontFamily: "'Inter', sans-serif", outline: 'none', boxSizing: 'border-box',
    transition: 'border-color 0.2s',
  }
  const labelStyle = { fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: '#555', textTransform: 'uppercase', display: 'block', marginBottom: '6px' }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #111', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <a href="/" style={{ textDecoration: 'none' }}>
          <Logo variant="mark" size={20} color="#fff" />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ background: mem.color, color: '#fff', padding: '4px 12px', fontSize: '8px', fontWeight: 700, letterSpacing: '2px' }}>
            {mem.badge}
          </div>
          <p style={{ fontSize: '12px', color: '#555' }}>{profile?.email}</p>
          <button onClick={signOut} style={{ background: 'none', border: '1px solid #222', color: '#555', padding: '8px 18px', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>
            Sign Out
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '48px 40px' }}>

        {/* Welcome */}
        <div style={{ marginBottom: '40px' }}>
          <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '4px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '8px' }}>
            Welcome Back
          </p>
          <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 56px)', letterSpacing: '3px', color: '#fff', lineHeight: 1 }}>
            {profile?.full_name ? profile.full_name.toUpperCase() : 'YOUR PROFILE'}
          </h1>
          {profile?.membership === 'og_member' && profile?.og_number && (
            <p style={{ fontSize: '12px', color: '#666', marginTop: '8px', letterSpacing: '1px' }}>OG Member #{String(profile.og_number).padStart(3, '0')}</p>
          )}
        </div>

        {/* OG Banner */}
        {profile?.membership === 'standard' && (
          <div style={{ background: '#0a0a0a', border: '1px solid #1e1e1e', padding: '24px', marginBottom: '32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '6px' }}>Upgrade to OG Member</p>
              <p style={{ fontSize: '12px', color: '#666', lineHeight: 1.7 }}>
                OG Members receive a free cap + tank top every drop. By approval from our founding partners only.
              </p>
            </div>
            <button onClick={requestOG} disabled={ogRequesting} style={{ padding: '12px 28px', background: 'var(--red)', color: '#fff', border: 'none', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: ogRequesting ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap' }}>
              {ogRequesting ? 'Submitting...' : 'Apply for OG'}
            </button>
          </div>
        )}
        {profile?.membership === 'og_pending' && (
          <div style={{ background: '#0a0800', border: '1px solid #b8860b', padding: '20px 24px', marginBottom: '32px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: '#b8860b', textTransform: 'uppercase', marginBottom: '4px' }}>OG Application Pending</p>
            <p style={{ fontSize: '12px', color: '#666' }}>Your request is under review by our founding partners. You'll be notified when approved.</p>
          </div>
        )}
        {profile?.membership === 'og_member' && (
          <div style={{ background: '#0a0000', border: '1px solid var(--red)', padding: '20px 24px', marginBottom: '32px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '4px' }}>OG Member — Active</p>
            <p style={{ fontSize: '12px', color: '#666' }}>You receive a free cap + tank top on every drop. Your items will be reserved automatically.</p>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '2px', marginBottom: '40px', flexWrap: 'wrap' }}>
          {[['profile', 'Profile'], ['wishlist', `Wishlist (${wishlist.length})`], ['orders', `Orders (${orders.length})`], ['ai', 'AI Stylist']].map(([t, label]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '10px 20px',
              background: tab === t ? 'var(--white)' : '#0d0d0d',
              border: `1px solid ${tab === t ? 'var(--white)' : '#1e1e1e'}`,
              color: tab === t ? 'var(--black)' : '#555',
              fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase',
              cursor: 'pointer', transition: 'all 0.18s', fontFamily: "'Inter', sans-serif",
            }}>{label}</button>
          ))}
        </div>

        {/* Profile Tab */}
        {tab === 'profile' && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="profile-grid">
            <div>
              <label style={labelStyle}>Full Name</label>
              <input value={editForm.full_name || ''} onChange={e => setEditForm(f => ({ ...f, full_name: e.target.value }))} style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Email</label>
              <input value={profile?.email || ''} disabled style={{ ...inputStyle, opacity: 0.4, cursor: 'not-allowed' }} />
            </div>
            <div>
              <label style={labelStyle}>Phone</label>
              <input value={editForm.phone || ''} onChange={e => setEditForm(f => ({ ...f, phone: e.target.value }))} placeholder="+1 (555) 000-0000" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Instagram</label>
              <input value={editForm.instagram || ''} onChange={e => setEditForm(f => ({ ...f, instagram: e.target.value }))} placeholder="@yourhandle" style={inputStyle} />
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Top Size</label>
              <div style={{ display: 'flex', gap: '4px' }}>
                {sizes.map(s => (
                  <button key={s} type="button" onClick={() => setEditForm(f => ({ ...f, size_top: s }))} style={{
                    flex: 1, padding: '10px 4px',
                    background: editForm.size_top === s ? 'var(--white)' : '#0d0d0d',
                    border: `1px solid ${editForm.size_top === s ? 'var(--white)' : '#222'}`,
                    color: editForm.size_top === s ? 'var(--black)' : '#555',
                    fontSize: '8px', fontWeight: 700, letterSpacing: '1px',
                    cursor: 'pointer', fontFamily: "'Inter', sans-serif",
                  }}>{s}</button>
                ))}
              </div>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <label style={labelStyle}>Style Notes (helps your AI stylist)</label>
              <textarea value={editForm.style_notes || ''} onChange={e => setEditForm(f => ({ ...f, style_notes: e.target.value }))}
                placeholder="e.g. I like oversized fits, mostly wear black, gym to street style..."
                style={{ ...inputStyle, height: '80px', resize: 'vertical' }} />
            </div>
            <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={saveProfile} disabled={saving} style={{ padding: '13px 36px', background: saved ? '#0a5' : 'var(--red)', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.3s', fontFamily: "'Inter', sans-serif" }}>
                {saving ? 'Saving...' : saved ? '✓ Saved' : 'Save Profile'}
              </button>
            </div>
          </div>
        )}

        {/* Wishlist Tab */}
        {tab === 'wishlist' && (
          <div>
            {wishlist.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '4px', color: '#333', textTransform: 'uppercase', marginBottom: '16px' }}>No saved items</p>
                <a href="/#shop" style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2px', color: 'var(--red)', textTransform: 'uppercase', textDecoration: 'none' }}>Browse the Drop →</a>
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '2px' }}>
                {wishlist.map(item => (
                  <div key={item.id} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', padding: '16px' }}>
                    {item.product_image && <img src={item.product_image} alt={item.product_name} style={{ width: '100%', aspectRatio: '4/5', objectFit: 'cover', marginBottom: '12px' }} />}
                    <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '4px' }}>{item.product_tag}</p>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#fff', marginBottom: '4px' }}>{item.product_name}</p>
                    <p style={{ fontSize: '14px', fontFamily: "'Bebas Neue'", color: '#fff', marginBottom: '12px' }}>${item.product_price}</p>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <a href="/#drop" style={{ flex: 1, padding: '9px', background: 'var(--red)', color: '#fff', fontSize: '8px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', textAlign: 'center', textDecoration: 'none' }}>Buy</a>
                      <button onClick={() => removeWishlist(item.id)} style={{ padding: '9px 12px', background: 'transparent', border: '1px solid #222', color: '#555', fontSize: '8px', cursor: 'pointer' }}>✕</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div>
            {orders.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '4px', color: '#333', textTransform: 'uppercase' }}>No orders yet</p>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                {orders.map(o => (
                  <div key={o.id} style={{ background: '#0d0d0d', border: '1px solid #1a1a1a', padding: '20px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                    <div>
                      <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: '#444', textTransform: 'uppercase', marginBottom: '4px' }}>
                        {new Date(o.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                      </p>
                      <p style={{ fontSize: '13px', color: '#fff', marginBottom: '2px' }}>
                        {Array.isArray(o.items) ? o.items.map(i => i.name).join(', ') : 'Order'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                      {o.total_cents && <p style={{ fontFamily: "'Bebas Neue'", fontSize: '20px', color: '#fff' }}>${(o.total_cents / 100).toFixed(2)}</p>}
                      <span style={{ background: o.status === 'delivered' ? '#0a5' : o.status === 'shipped' ? '#0066cc' : '#333', color: '#fff', padding: '4px 10px', fontSize: '8px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* AI Stylist Tab */}
        {tab === 'ai' && (
          <div style={{ display: 'flex', flexDirection: 'column', height: '520px', border: '1px solid #1a1a1a' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ width: '8px', height: '8px', background: 'var(--red)', borderRadius: '50%' }} />
              <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3px', color: '#888', textTransform: 'uppercase' }}>S55 Personal Stylist</p>
              {profile?.size_top && (
                <span style={{ marginLeft: 'auto', fontSize: '8px', fontWeight: 700, letterSpacing: '1px', color: '#333', background: '#111', padding: '3px 8px' }}>
                  SIZE {profile.size_top}
                </span>
              )}
            </div>

            <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: '78%', padding: '12px 14px',
                    background: m.role === 'user' ? 'var(--red)' : '#111',
                    border: m.role === 'user' ? 'none' : '1px solid #1e1e1e',
                    fontSize: '13px', color: '#fff', lineHeight: 1.6,
                  }}>
                    {m.content}
                  </div>
                </div>
              ))}
              {aiLoading && (
                <div style={{ display: 'flex', gap: '6px', padding: '12px 14px', background: '#111', border: '1px solid #1e1e1e', width: '60px' }}>
                  {[0, 1, 2].map(i => <span key={i} style={{ width: '6px', height: '6px', background: '#444', borderRadius: '50%', animation: `pulse 1.2s ease-in-out ${i * 0.2}s infinite` }} />)}
                </div>
              )}
              <div ref={chatRef} />
            </div>

            <div style={{ padding: '16px 20px', borderTop: '1px solid #1a1a1a', display: 'flex', gap: '8px' }}>
              <input
                value={aiInput}
                onChange={e => setAiInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendAI()}
                placeholder="Ask about sizing, outfits, the drop..."
                style={{ flex: 1, background: '#0d0d0d', border: '1px solid #1e1e1e', color: '#fff', padding: '11px 14px', fontSize: '13px', fontFamily: "'Inter', sans-serif", outline: 'none' }}
              />
              <button onClick={() => sendAI()} disabled={aiLoading} style={{ padding: '11px 20px', background: aiLoading ? '#1a1a1a' : 'var(--red)', color: '#fff', border: 'none', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: aiLoading ? 'not-allowed' : 'pointer', fontFamily: "'Inter', sans-serif" }}>
                Send
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .profile-grid { grid-template-columns: 1fr 1fr; }
        @media (max-width: 600px) {
          .profile-grid { grid-template-columns: 1fr !important; }
        }
        @keyframes pulse {
          0%, 80%, 100% { opacity: 0.2; transform: scale(0.8); }
          40% { opacity: 1; transform: scale(1); }
        }
      `}</style>
    </div>
  )
}
