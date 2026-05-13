export default function IntellectualProperty() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--black)', padding: '100px 40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <a href="/" style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          fontSize: '10px', fontWeight: 700, letterSpacing: '3px',
          color: '#555', textTransform: 'uppercase', marginBottom: '48px',
          textDecoration: 'none',
        }}
        onMouseEnter={e => e.currentTarget.style.color = '#fff'}
        onMouseLeave={e => e.currentTarget.style.color = '#555'}
        >← Back to Store</a>

        <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '4px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '16px' }}>
          Legal
        </p>
        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(40px, 7vw, 72px)',
          letterSpacing: '3px', color: 'var(--white)', lineHeight: 1, marginBottom: '48px',
        }}>INTELLECTUAL PROPERTY</h1>

        <div style={{ borderTop: '1px solid var(--black-border)', paddingTop: '48px' }}>

          <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.9, marginBottom: '40px' }}>
            Motion Sickness by S55 owns the brand name, logos, product graphics, website content,
            product photography, campaign visuals, slogans, and original design assets displayed
            on this website.
          </p>

          <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.9, marginBottom: '40px' }}>
            You may not copy, reproduce, modify, sell, distribute, upload, repost, imitate,
            manufacture, or use any Motion Sickness by S55 content without written permission.
          </p>

          <div style={{ border: '1px solid var(--black-border)', padding: '32px', marginBottom: '40px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '20px' }}>
              This includes
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px 40px' }}>
              {[
                'Product images',
                'Product designs',
                'Logos',
                'Website graphics',
                'Campaign photos',
                'Slogans',
                'Product names',
                'Packaging designs',
                'Social media content',
              ].map(item => (
                <p key={item} style={{ fontSize: '13px', color: '#666', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ color: 'var(--red)', fontSize: '8px' }}>✦</span>
                  {item}
                </p>
              ))}
            </div>
          </div>

          <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.9, marginBottom: '48px' }}>
            Unauthorized use may result in takedown requests, legal action, or other enforcement steps.
          </p>

          <div style={{ borderTop: '1px solid var(--black-border)', paddingTop: '40px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: '#555', textTransform: 'uppercase', marginBottom: '16px' }}>
              Permission Requests
            </p>
            <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.9, marginBottom: '16px' }}>
              For permission requests, contact:
            </p>
            <a href="mailto:legal@motionsickness.shop" style={{
              fontSize: '16px', fontWeight: 600, color: 'var(--white)',
              textDecoration: 'none', letterSpacing: '1px',
            }}>legal@motionsickness.shop</a>
          </div>
        </div>

        <div style={{ marginTop: '80px', borderTop: '1px solid #111', paddingTop: '24px' }}>
          <p style={{ fontSize: '10px', color: '#333', letterSpacing: '1px' }}>
            © 2026 Motion Sickness by S55. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  )
}
