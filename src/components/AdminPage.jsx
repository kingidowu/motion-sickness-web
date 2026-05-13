import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabase'

const ADMIN_PASSWORD = 'S55admin007'

function StatBox({ label, value, sub }) {
  return (
    <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: '24px 28px' }}>
      <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '8px' }}>{label}</p>
      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '48px', color: '#fff', lineHeight: 1 }}>{value}</p>
      {sub && <p style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>{sub}</p>}
    </div>
  )
}

function CampaignSender({ signups }) {
  const [segment, setSegment] = useState('all')
  const [topic, setTopic] = useState('')
  const [sending, setSending] = useState(false)
  const [result, setResult] = useState(null)

  const segments = {
    all: signups.map(s => s.email),
    instagram: signups.filter(s => s.source === 'instagram_follow').map(s => s.email),
    signup: signups.filter(s => s.source === 'popup_signup').map(s => s.email),
  }

  const send = async () => {
    if (!topic || !segments[segment].length) return
    setSending(true)
    setResult(null)
    try {
      const res = await fetch('/api/ai-campaign', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ segment, topic, recipients: segments[segment] }),
      })
      const data = await res.json()
      setResult(data)
    } catch { setResult({ error: 'Failed to send' }) }
    setSending(false)
  }

  return (
    <div style={{ background: '#111', border: '1px solid #1e1e1e', padding: '28px', marginBottom: '32px' }}>
      <p style={{ fontSize: '9px', fontWeight: 700, letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '20px' }}>
        ✦ AI Campaign Sender
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
        <div>
          <p style={{ fontSize: '9px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Segment</p>
          <select value={segment} onChange={e => setSegment(e.target.value)}
            style={{ width: '100%', background: '#0d0d0d', border: '1px solid #222', color: '#fff', padding: '10px 12px', fontSize: '12px', fontFamily: "'Inter', sans-serif", outline: 'none' }}>
            <option value="all">All Signups ({segments.all.length})</option>
            <option value="instagram">Instagram Followers ({segments.instagram.length})</option>
            <option value="signup">Popup Signups ({segments.signup.length})</option>
          </select>
        </div>
        <div>
          <p style={{ fontSize: '9px', color: '#555', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '6px' }}>Message Topic</p>
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="e.g. Drop 002 coming soon, 2 months away"
            style={{ width: '100%', background: '#0d0d0d', border: '1px solid #222', color: '#fff', padding: '10px 12px', fontSize: '12px', fontFamily: "'Inter', sans-serif", outline: 'none' }} />
        </div>
      </div>
      <button onClick={send} disabled={sending || !topic || !segments[segment].length} style={{
        padding: '11px 28px', background: sending ? '#333' : 'var(--red)', color: '#fff', border: 'none',
        fontSize: '10px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: sending ? 'not-allowed' : 'pointer',
      }}>
        {sending ? 'AI Writing + Sending...' : `Send to ${segments[segment].length} recipients`}
      </button>
      {result && !result.error && (
        <p style={{ marginTop: '12px', fontSize: '11px', color: '#00cc44' }}>
          ✓ Sent {result.sent}/{result.total} emails · Subject: "{result.subject}"
        </p>
      )}
      {result?.error && <p style={{ marginTop: '12px', fontSize: '11px', color: 'var(--red)' }}>✕ {result.error}</p>}
    </div>
  )
}

export default function AdminPage() {
  const [authed, setAuthed] = useState(false)
  const [pw, setPw] = useState('')
  const [error, setError] = useState(false)
  const [signups, setSignups] = useState([])
  const [visitors, setVisitors] = useState([])
  const [inquiries, setInquiries] = useState([])
  const [tab, setTab] = useState('signups')
  const [loading, setLoading] = useState(false)

  const login = () => {
    if (pw === ADMIN_PASSWORD) { setAuthed(true) }
    else { setError(true); setPw(''); setTimeout(() => setError(false), 1200) }
  }

  useEffect(() => {
    if (!authed || !supabase) return
    setLoading(true)

    // Initial load
    Promise.all([
      supabase.from('ms_signups').select('*').order('created_at', { ascending: false }),
      supabase.from('ms_visitors').select('*').order('created_at', { ascending: false }).limit(500),
      supabase.from('ms_inquiries').select('*').order('created_at', { ascending: false }),
    ]).then(([s, v, i]) => {
      setSignups(s.data || [])
      setVisitors(v.data || [])
      setInquiries(i.data || [])
      setLoading(false)
    })

    // Real-time subscriptions
    const signupSub = supabase.channel('rt-signups')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ms_signups' },
        payload => setSignups(prev => [payload.new, ...prev]))
      .subscribe()

    const visitorSub = supabase.channel('rt-visitors')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ms_visitors' },
        payload => setVisitors(prev => [payload.new, ...prev]))
      .subscribe()

    const inquirySub = supabase.channel('rt-inquiries')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'ms_inquiries' },
        payload => setInquiries(prev => [payload.new, ...prev]))
      .subscribe()

    return () => {
      supabase.removeChannel(signupSub)
      supabase.removeChannel(visitorSub)
      supabase.removeChannel(inquirySub)
    }
  }, [authed])

  const exportCSV = (data, filename) => {
    if (!data.length) return
    const headers = Object.keys(data[0]).join(',')
    const rows = data.map(r => Object.values(r).map(v => `"${v ?? ''}"`).join(',')).join('\n')
    const blob = new Blob([headers + '\n' + rows], { type: 'text/csv' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = filename; a.click()
  }

  if (!authed) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
        <div style={{ background: '#0d0d0d', border: `1px solid ${error ? '#CC0000' : '#1e1e1e'}`, padding: '48px 40px', maxWidth: '360px', width: '100%', textAlign: 'center', transition: 'border-color 0.2s' }}>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '28px', letterSpacing: '6px', color: '#fff', marginBottom: '8px' }}>ADMIN</p>
          <p style={{ fontSize: '10px', color: '#555', letterSpacing: '3px', textTransform: 'uppercase', marginBottom: '32px' }}>Motion Sickness by S55</p>
          <input
            autoFocus type="password" value={pw}
            onChange={e => setPw(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && login()}
            placeholder="Password"
            style={{ width: '100%', background: '#111', border: `1px solid ${error ? '#CC0000' : '#222'}`, color: '#fff', padding: '12px 14px', fontSize: '14px', letterSpacing: '4px', textAlign: 'center', fontFamily: "'Inter', sans-serif", outline: 'none', marginBottom: '12px' }}
          />
          {error && <p style={{ fontSize: '10px', color: '#CC0000', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>Wrong password</p>}
          <button onClick={login} style={{ width: '100%', padding: '13px', background: '#CC0000', color: '#fff', border: 'none', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', cursor: 'pointer' }}>
            Enter
          </button>
        </div>
      </div>
    )
  }

  const todayVisitors = visitors.filter(v => new Date(v.created_at).toDateString() === new Date().toDateString()).length
  const activeData = tab === 'signups' ? signups : tab === 'visitors' ? visitors : inquiries

  return (
    <div style={{ minHeight: '100vh', background: '#080808', color: '#fff', fontFamily: "'Inter', sans-serif" }}>
      {/* Header */}
      <div style={{ background: '#0d0d0d', borderBottom: '1px solid #1e1e1e', padding: '20px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '20px', letterSpacing: '4px', color: '#fff' }}>MOTION SICKNESS · ADMIN</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00cc44', display: 'inline-block', animation: 'pulse-dot 2s infinite' }} />
            <p style={{ fontSize: '10px', color: '#555', letterSpacing: '2px' }}>S55 LLC · Live Dashboard</p>
          </div>
        </div>
        <style>{`@keyframes pulse-dot { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <button onClick={() => exportCSV(activeData, `ms_${tab}_${Date.now()}.csv`)} style={{ padding: '8px 20px', background: 'transparent', border: '1px solid #333', color: '#888', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>
            Export CSV
          </button>
          <button onClick={() => setAuthed(false)} style={{ padding: '8px 20px', background: '#CC0000', color: '#fff', border: 'none', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }}>
            Logout
          </button>
        </div>
      </div>

      <div style={{ maxWidth: '1300px', margin: '0 auto', padding: '40px' }}>
        {loading ? (
          <p style={{ color: '#555', textAlign: 'center', padding: '80px', letterSpacing: '3px', textTransform: 'uppercase', fontSize: '11px' }}>Loading data...</p>
        ) : (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '2px', marginBottom: '40px' }}>
              <StatBox label="Total Signups" value={signups.length} sub="Email + popup" />
              <StatBox label="Total Visitors" value={visitors.length} sub={`${todayVisitors} today`} />
              <StatBox label="Inquiries" value={inquiries.length} sub="Order inquiries" />
              <StatBox label="Instagram Follows" value={signups.filter(s => s.source === 'instagram_follow').length} sub="Via follow popup" />
            </div>

            <CampaignSender signups={signups} />

            {/* Tabs */}
            <div style={{ display: 'flex', borderBottom: '1px solid #1e1e1e', marginBottom: '24px' }}>
              {[['signups', 'Signups'], ['inquiries', 'Inquiries'], ['visitors', 'Visitors']].map(([key, label]) => (
                <button key={key} onClick={() => setTab(key)} style={{
                  padding: '12px 24px', background: 'none', border: 'none',
                  borderBottom: `2px solid ${tab === key ? '#CC0000' : 'transparent'}`,
                  color: tab === key ? '#fff' : '#555',
                  fontSize: '10px', fontWeight: 700, letterSpacing: '2px',
                  textTransform: 'uppercase', cursor: 'pointer',
                }}>{label} ({key === 'signups' ? signups.length : key === 'visitors' ? visitors.length : inquiries.length})</button>
              ))}
            </div>

            {/* Table */}
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid #1e1e1e' }}>
                    {tab === 'signups' && ['Date', 'Name', 'Email', 'Phone', 'Instagram', 'Source'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: '#555', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                    {tab === 'inquiries' && ['Date', 'Name', 'Email', 'Product', 'Size', 'Qty', 'OG Member'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: '#555', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                    {tab === 'visitors' && ['Date/Time', 'Page', 'Referrer', 'Device'].map(h => (
                      <th key={h} style={{ padding: '10px 16px', textAlign: 'left', fontSize: '9px', fontWeight: 700, letterSpacing: '2px', color: '#555', textTransform: 'uppercase' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tab === 'signups' && signups.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #111' }}>
                      <td style={{ padding: '12px 16px', color: '#555' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 16px', color: '#fff', fontWeight: 500 }}>{r.name}</td>
                      <td style={{ padding: '12px 16px', color: '#888' }}>{r.email}</td>
                      <td style={{ padding: '12px 16px', color: '#888' }}>{r.phone || '—'}</td>
                      <td style={{ padding: '12px 16px', color: '#888' }}>{r.instagram || '—'}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ background: r.source === 'instagram_follow' ? '#1a0a00' : '#0a1a00', color: r.source === 'instagram_follow' ? '#CC0000' : '#00aa44', padding: '2px 8px', fontSize: '9px', fontWeight: 700, letterSpacing: '1px' }}>
                          {r.source}
                        </span>
                      </td>
                    </tr>
                  ))}
                  {tab === 'inquiries' && inquiries.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #111' }}>
                      <td style={{ padding: '12px 16px', color: '#555' }}>{new Date(r.created_at).toLocaleDateString()}</td>
                      <td style={{ padding: '12px 16px', color: '#fff', fontWeight: 500 }}>{r.name}</td>
                      <td style={{ padding: '12px 16px', color: '#888' }}>{r.email}</td>
                      <td style={{ padding: '12px 16px', color: '#888', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.product}</td>
                      <td style={{ padding: '12px 16px', color: '#888' }}>{r.size || '—'}</td>
                      <td style={{ padding: '12px 16px', color: '#888' }}>{r.quantity}</td>
                      <td style={{ padding: '12px 16px' }}>
                        {r.og_member ? <span style={{ color: '#CC0000', fontWeight: 700, fontSize: '10px' }}>OG ✓</span> : <span style={{ color: '#333' }}>—</span>}
                      </td>
                    </tr>
                  ))}
                  {tab === 'visitors' && visitors.map(r => (
                    <tr key={r.id} style={{ borderBottom: '1px solid #111' }}>
                      <td style={{ padding: '12px 16px', color: '#555' }}>{new Date(r.created_at).toLocaleString()}</td>
                      <td style={{ padding: '12px 16px', color: '#888' }}>{r.page || '/'}</td>
                      <td style={{ padding: '12px 16px', color: '#555', maxWidth: '160px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.referrer || 'direct'}</td>
                      <td style={{ padding: '12px 16px', color: '#555', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.user_agent ? (r.user_agent.includes('Mobile') ? '📱 Mobile' : '🖥️ Desktop') : '—'}</td>
                    </tr>
                  ))}
                  {activeData.length === 0 && (
                    <tr><td colSpan={7} style={{ padding: '48px', textAlign: 'center', color: '#333', fontSize: '12px', letterSpacing: '2px' }}>NO DATA YET</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
