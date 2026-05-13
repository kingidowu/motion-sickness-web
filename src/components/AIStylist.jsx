import { useState, useRef, useEffect } from 'react'

const SUGGESTIONS = [
  'What goes with the Racing Tee?',
  'Best fit for the Houston Collegiate?',
  'Build me a full outfit from Drop 001',
  'What\'s the most exclusive piece?',
]

export default function AIStylist() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: 'S55 Stylist here. Drop 001 is live — what are you building today?'
  }])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = async (text) => {
    const msg = text || input.trim()
    if (!msg || loading) return
    setInput('')
    const updated = [...messages, { role: 'user', content: msg }]
    setMessages(updated)
    setLoading(true)
    try {
      const res = await fetch('/api/ai-stylist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updated }),
      })
      const data = await res.json()
      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Something went wrong. Try again.' }])
    }
    setLoading(false)
  }

  return (
    <>
      {/* Floating button */}
      <button
        onClick={() => setOpen(!open)}
        style={{
          position: 'fixed', bottom: '28px', right: '28px', zIndex: 990,
          width: '56px', height: '56px', borderRadius: '50%',
          background: open ? '#111' : 'var(--red)',
          border: '1px solid #333',
          color: '#fff', fontSize: '22px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 24px rgba(204,0,0,0.3)',
          transition: 'all 0.2s',
        }}
        title="S55 AI Stylist"
      >
        {open ? '✕' : '✦'}
      </button>

      {/* Chat panel */}
      {open && (
        <div style={{
          position: 'fixed', bottom: '96px', right: '28px', zIndex: 990,
          width: '340px', height: '480px',
          background: '#0d0d0d', border: '1px solid #1e1e1e',
          display: 'flex', flexDirection: 'column',
          boxShadow: '0 8px 40px rgba(0,0,0,0.6)',
        }}>
          {/* Header */}
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #1a1a1a', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--red)' }} />
            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2px', color: '#fff', textTransform: 'uppercase' }}>S55 Stylist</p>
              <p style={{ fontSize: '9px', color: '#555', letterSpacing: '1px' }}>AI · Motion Sickness Drop 001</p>
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {messages.map((m, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                <div style={{
                  maxWidth: '80%', padding: '10px 14px',
                  background: m.role === 'user' ? 'var(--red)' : '#161616',
                  border: m.role === 'assistant' ? '1px solid #1e1e1e' : 'none',
                  fontSize: '12px', color: '#fff', lineHeight: 1.7,
                }}>
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <div style={{ padding: '10px 14px', background: '#161616', border: '1px solid #1e1e1e', fontSize: '12px', color: '#555' }}>
                  Styling...
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          {/* Quick suggestions (only at start) */}
          {messages.length === 1 && (
            <div style={{ padding: '0 16px 12px', display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              {SUGGESTIONS.map(s => (
                <button key={s} onClick={() => send(s)} style={{
                  background: 'transparent', border: '1px solid #222', color: '#888',
                  padding: '5px 10px', fontSize: '9px', letterSpacing: '1px', cursor: 'pointer',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.target.style.borderColor = 'var(--red)'; e.target.style.color = '#fff' }}
                onMouseLeave={e => { e.target.style.borderColor = '#222'; e.target.style.color = '#888' }}
                >{s}</button>
              ))}
            </div>
          )}

          {/* Input */}
          <div style={{ padding: '12px 16px', borderTop: '1px solid #1a1a1a', display: 'flex', gap: '8px' }}>
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && send()}
              placeholder="Ask the stylist..."
              style={{
                flex: 1, background: '#111', border: '1px solid #222', color: '#fff',
                padding: '9px 12px', fontSize: '12px', fontFamily: "'Inter', sans-serif", outline: 'none',
              }}
              onFocus={e => e.target.style.borderColor = 'var(--red)'}
              onBlur={e => e.target.style.borderColor = '#222'}
            />
            <button onClick={() => send()} disabled={loading} style={{
              background: 'var(--red)', border: 'none', color: '#fff',
              padding: '9px 14px', fontSize: '14px', cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}>→</button>
          </div>
        </div>
      )}

      <style>{`
        @media (max-width: 480px) {
          /* Chat panel full width on mobile */
        }
      `}</style>
    </>
  )
}
