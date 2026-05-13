export default function TermsOfService() {
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
          letterSpacing: '3px', color: 'var(--white)', lineHeight: 1, marginBottom: '8px',
        }}>TERMS OF SERVICE</h1>
        <p style={{ fontSize: '11px', color: '#444', letterSpacing: '1px', marginBottom: '48px' }}>
          Last updated: May 2026
        </p>

        <div style={{ borderTop: '1px solid var(--black-border)', paddingTop: '48px', display: 'flex', flexDirection: 'column', gap: '48px' }}>

          <section>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '24px', letterSpacing: '3px', color: 'var(--white)', marginBottom: '16px',
            }}>USE OF THIS WEBSITE</h2>
            <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.9 }}>
              By accessing or using this website, you agree to these terms. This site is operated
              by Motion Sickness by S55 and is intended for customers interested in purchasing
              limited drop clothing and accessories.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '24px', letterSpacing: '3px', color: 'var(--white)', marginBottom: '16px',
            }}>ORDERS AND AVAILABILITY</h2>
            <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.9 }}>
              All products are sold in limited quantities. Orders are fulfilled on a first-come,
              first-served basis. We reserve the right to cancel orders at our discretion.
              Prices are listed in USD and are subject to change without notice.
            </p>
          </section>

          <section style={{ border: '1px solid var(--black-border)', padding: '32px' }}>
            <p style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '3px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '16px' }}>
              Brand Ownership and Intellectual Property
            </p>
            <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.9, marginBottom: '20px' }}>
              All content on this website, including the Motion Sickness name, S55 branding, logos,
              artwork, product images, graphics, text, slogans, videos, product names, and design
              elements, belongs to Motion Sickness by S55 or its authorized creators.
            </p>
            <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.9, marginBottom: '20px' }}>
              Visitors and customers may not copy, reproduce, resell, reverse engineer, imitate,
              modify, distribute, manufacture, or commercially exploit any brand assets or website
              content without written permission.
            </p>
            <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.9 }}>
              Any unauthorized use of our intellectual property may result in account restriction,
              order cancellation, takedown notices, or legal action.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '24px', letterSpacing: '3px', color: 'var(--white)', marginBottom: '16px',
            }}>SHIPPING</h2>
            <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.9 }}>
              All orders ship from the United States. Estimated delivery times are provided
              at checkout and are not guaranteed. We are not responsible for delays caused
              by carriers or customs. See our{' '}
              <a href="/shipping-policy" style={{ color: 'var(--red)', textDecoration: 'none' }}>Shipping Policy</a>
              {' '}for full details.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '24px', letterSpacing: '3px', color: 'var(--white)', marginBottom: '16px',
            }}>RETURNS AND REFUNDS</h2>
            <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.9 }}>
              Due to the limited nature of our drops, all sales are final unless an item
              arrives defective or incorrect. See our{' '}
              <a href="/refund-policy" style={{ color: 'var(--red)', textDecoration: 'none' }}>Refund Policy</a>
              {' '}for full details.
            </p>
          </section>

          <section>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '24px', letterSpacing: '3px', color: 'var(--white)', marginBottom: '16px',
            }}>CONTACT</h2>
            <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.9, marginBottom: '8px' }}>
              General inquiries: <a href="mailto:support@motionsickness.shop" style={{ color: 'var(--red)', textDecoration: 'none' }}>support@motionsickness.shop</a>
            </p>
            <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.9 }}>
              Legal and IP issues: <a href="mailto:legal@motionsickness.shop" style={{ color: 'var(--red)', textDecoration: 'none' }}>legal@motionsickness.shop</a>
            </p>
          </section>

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
