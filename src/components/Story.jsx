import Logo from './Logo'

const timeline = [
  {
    step: '01',
    label: 'The Idea',
    text: "Motion Sickness started as a feeling — the blur between grinding and living. Born in Houston, 29.7604° N 95.3698° W, by people who refuse to sit still.",
  },
  {
    step: '02',
    label: 'S55 Ventures',
    text: "S55 Ventures built SourceFlow — a sourcing platform that connects ideas to factories. Motion Sickness is the brand that proves the system works. We wear what we build.",
  },
  {
    step: '03',
    label: 'Sourced by SourceFlow',
    text: "Every piece you see was designed, sourced, and produced through SourceFlow. From artwork to factory, we control the full pipeline — which is why the quality hits different.",
  },
  {
    step: '04',
    label: 'The Drop',
    text: "Core Collection. Six tees. Three jerseys. Women's athletic line. Caps and tanks for the OG members first. Limited numbered. Packaged in matte black with tissue and a thank you card.",
  },
  {
    step: '05',
    label: 'Move With Motion',
    text: "This isn't just merch. It's a lifestyle — discipline fuels freedom, and motion creates energy. Wear it. Live it. Move with it.",
  },
]

export default function Story() {
  return (
    <section id="story" style={{ background: 'var(--black)', padding: '100px 40px', borderTop: '1px solid var(--black-border)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', marginBottom: '80px', alignItems: 'end' }} className="story-header">
          <div>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '4px', color: 'var(--red)', textTransform: 'uppercase', marginBottom: '16px' }}>
              Houston, TX · Studio 55
            </p>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(48px, 7vw, 88px)',
              letterSpacing: '2px', color: 'var(--white)', lineHeight: 0.95,
            }}>HOW IT<br />GETS MADE</h2>
          </div>
          <div>
            <p style={{ color: '#888', fontSize: '14px', lineHeight: 1.9, marginBottom: '20px' }}>
              Most brands design and hope for the best. We built the infrastructure first —
              then made the clothes. SourceFlow handles the entire pipeline from artwork
              to your hands.
            </p>
            <div style={{ display: 'flex', gap: '24px' }}>
              {['Design', 'Source', 'Produce', 'Deliver'].map((s, i) => (
                <div key={s} style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <span style={{ fontFamily: "'Bebas Neue'", fontSize: '28px', color: i === 0 ? 'var(--red)' : 'var(--white)' }}>0{i + 1}</span>
                  <span style={{ fontSize: '9px', fontWeight: 600, letterSpacing: '2px', color: 'var(--grey)', textTransform: 'uppercase' }}>{s}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Timeline */}
        <div style={{ position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: '28px', top: 0, bottom: 0,
            width: '1px', background: 'var(--black-border)',
          }} />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {timeline.map((item, i) => (
              <div key={item.step} style={{
                display: 'grid',
                gridTemplateColumns: '56px 1fr',
                gap: '32px',
                paddingBottom: i < timeline.length - 1 ? '48px' : 0,
              }}>
                {/* Step indicator */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    width: '56px', height: '56px',
                    border: `1px solid ${i === 0 ? 'var(--red)' : 'var(--black-border)'}`,
                    background: i === 0 ? 'var(--red)' : 'var(--black)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1,
                  }}>
                    <span style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: '18px', letterSpacing: '2px',
                      color: 'var(--white)',
                    }}>{item.step}</span>
                  </div>
                </div>

                {/* Content */}
                <div style={{ paddingTop: '12px' }}>
                  <p style={{
                    fontSize: '10px', fontWeight: 700, letterSpacing: '3px',
                    color: i === 0 ? 'var(--red)' : 'var(--grey)',
                    textTransform: 'uppercase', marginBottom: '8px',
                  }}>{item.label}</p>
                  <p style={{ fontSize: '14px', color: '#999', lineHeight: 1.8, maxWidth: '560px' }}>
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sourced by S55 banner */}
        <div style={{
          marginTop: '80px',
          border: '1px solid var(--black-border)',
          padding: '40px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: '24px',
        }}>
          <div>
            <p style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '3px', color: 'var(--grey)', textTransform: 'uppercase', marginBottom: '8px' }}>
              Powered by
            </p>
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '32px', letterSpacing: '4px', color: 'var(--white)',
            }}>SOURCEFLOW by S55</p>
            <p style={{ fontSize: '12px', color: 'var(--grey)', marginTop: '4px' }}>
              Full-stack product sourcing — from idea to factory to your door.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '32px' }}>
            {['300 DPI Artwork', 'Premium Packaging', 'Factory Direct', 'QC Controlled'].map(tag => (
              <div key={tag} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                <Logo variant="mark" size={20} color="#CC0000" />
                <span style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '1.5px', color: 'var(--grey)', textTransform: 'uppercase', textAlign: 'center' }}>{tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .story-header { grid-template-columns: 1fr !important; gap: 32px !important; }
        }
      `}</style>
    </section>
  )
}
