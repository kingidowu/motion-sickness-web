const policies = {
  '/shipping-policy': {
    title: 'SHIPPING POLICY',
    sections: [
      {
        heading: 'WHERE WE SHIP',
        body: 'We currently ship within the United States. International shipping may be available for select orders — contact us for details.',
      },
      {
        heading: 'PROCESSING TIME',
        body: 'Orders are processed within 3–7 business days after payment is confirmed. During high-demand drops, processing may take up to 10 business days.',
      },
      {
        heading: 'SHIPPING TIME',
        body: 'Standard shipping takes 5–10 business days after processing. Expedited options may be available at checkout. Delivery times are estimates and not guaranteed.',
      },
      {
        heading: 'SHIPPING COSTS',
        body: 'Shipping costs are calculated at checkout based on your location and order weight. Free shipping may be offered during select promotions.',
      },
      {
        heading: 'TRACKING',
        body: 'Once your order ships, you will receive a tracking number via email. We are not responsible for delays caused by carriers or customs.',
      },
      {
        heading: 'ORIGIN',
        body: 'All orders are designed by S55 and ship from the U.S.',
      },
    ],
  },
  '/refund-policy': {
    title: 'REFUND POLICY',
    sections: [
      {
        heading: 'ALL SALES FINAL',
        body: 'Due to the limited drop nature of our products, all sales are final. We do not accept returns or exchanges for change of mind, sizing issues, or any other reason not related to a defect.',
      },
      {
        heading: 'DEFECTIVE OR INCORRECT ITEMS',
        body: 'If your item arrives defective, damaged, or different from what you ordered, contact us within 7 days of delivery at support@motionsickness.shop with your order number and photos of the issue.',
      },
      {
        heading: 'RESOLUTION',
        body: 'For verified defective or incorrect items, we will offer a replacement (subject to availability) or a full refund. Refunds are processed to the original payment method within 5–10 business days.',
      },
      {
        heading: 'CONTACT',
        body: 'For refund inquiries: support@motionsickness.shop',
      },
    ],
  },
  '/privacy-policy': {
    title: 'PRIVACY POLICY',
    sections: [
      {
        heading: 'INFORMATION WE COLLECT',
        body: 'We collect information you provide when placing an order or signing up for drop notifications, including your name, email address, and shipping address.',
      },
      {
        heading: 'HOW WE USE YOUR INFORMATION',
        body: 'We use your information to process orders, send shipping updates, and notify you of upcoming drops if you have opted in. We do not sell your personal information to third parties.',
      },
      {
        heading: 'COOKIES',
        body: 'This website may use cookies to improve your browsing experience and track visitor analytics. By using this site, you consent to our use of cookies.',
      },
      {
        heading: 'DATA SECURITY',
        body: 'We take reasonable measures to protect your personal information. However, no method of transmission over the internet is 100% secure.',
      },
      {
        heading: 'CONTACT',
        body: 'For privacy questions: support@motionsickness.shop',
      },
    ],
  },
  '/size-guide': {
    title: 'SIZE GUIDE',
    sections: [
      {
        heading: 'OUR FIT',
        body: 'Motion Sickness garments are designed with an oversized, relaxed fit. If you prefer a standard fit, we recommend sizing down one size.',
      },
      {
        heading: 'TEES',
        body: 'S: Chest 38–40" · Shoulder 18" · Length 28"\nM: Chest 41–43" · Shoulder 19" · Length 29"\nL: Chest 44–46" · Shoulder 20" · Length 30"\nXL: Chest 47–49" · Shoulder 21" · Length 31"\nXXL: Chest 50–52" · Shoulder 22" · Length 32"',
      },
      {
        heading: 'JERSEYS',
        body: 'S: Chest 38–40"\nM: Chest 41–43"\nL: Chest 44–46"\nXL: Chest 47–49"\nXXL: Chest 50–52"',
      },
      {
        heading: "WOMEN'S LINE",
        body: 'XS: Bust 32–33" · Waist 24–25"\nS: Bust 34–35" · Waist 26–27"\nM: Bust 36–37" · Waist 28–29"\nL: Bust 38–40" · Waist 30–32"',
      },
      {
        heading: 'NEED HELP?',
        body: 'Not sure about your size? Contact us at support@motionsickness.shop and we will help you find the right fit.',
      },
    ],
  },
}

export default function PolicyPage({ path }) {
  const page = policies[path]
  if (!page) return null

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
        }}>{page.title}</h1>
        <p style={{ fontSize: '11px', color: '#444', letterSpacing: '1px', marginBottom: '48px' }}>
          Last updated: May 2026
        </p>

        <div style={{ borderTop: '1px solid var(--black-border)', paddingTop: '48px', display: 'flex', flexDirection: 'column', gap: '40px' }}>
          {page.sections.map((s, i) => (
            <section key={i}>
              <h2 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '20px', letterSpacing: '3px', color: 'var(--white)', marginBottom: '12px',
              }}>{s.heading}</h2>
              <p style={{ fontSize: '14px', color: '#888', lineHeight: 1.9, whiteSpace: 'pre-line' }}>
                {s.body}
              </p>
            </section>
          ))}
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
