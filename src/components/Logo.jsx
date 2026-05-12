/* Logo variants:
 * <Logo variant="mark" />       — compass star only (small use)
 * <Logo variant="s55" />        — S55 serif monogram
 * <Logo variant="lockup" />     — full horizontal lockup (hero/footer)
 * <Logo variant="wordmark" />   — MOTION SICKNESS text only
 */

function CompassStar({ size = 32, color = '#ffffff' }) {
  const c = size / 2
  const r = size / 2 - 1

  // 8-pointed star: 4 long cardinal points + 4 short diagonal points
  const points = []
  for (let i = 0; i < 8; i++) {
    const angle = (i * 45 - 90) * (Math.PI / 180)
    const len = i % 2 === 0 ? r : r * 0.38
    points.push({
      x: c + Math.cos(angle) * len,
      y: c + Math.sin(angle) * len,
    })
  }

  // Build thin diamond-petal paths for each cardinal direction
  const tip = (angle, length, width) => {
    const a = angle * (Math.PI / 180)
    const perp = a + Math.PI / 2
    const tipX = c + Math.cos(a) * length
    const tipY = c + Math.sin(a) * length
    const lx = c + Math.cos(perp) * width
    const ly = c + Math.sin(perp) * width
    const rx = c - Math.cos(perp) * width
    const ry = c - Math.sin(perp) * width
    return `M ${c} ${c} L ${lx} ${ly} L ${tipX} ${tipY} L ${rx} ${ry} Z`
  }

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Cardinal long points */}
      <path d={tip(-90, r, size * 0.045)} fill={color} />
      <path d={tip(90, r, size * 0.045)} fill={color} />
      <path d={tip(0, r, size * 0.045)} fill={color} />
      <path d={tip(180, r, size * 0.045)} fill={color} />
      {/* Diagonal short points */}
      <path d={tip(-45, r * 0.42, size * 0.028)} fill={color} opacity="0.85" />
      <path d={tip(45, r * 0.42, size * 0.028)} fill={color} opacity="0.85" />
      <path d={tip(135, r * 0.42, size * 0.028)} fill={color} opacity="0.85" />
      <path d={tip(225, r * 0.42, size * 0.028)} fill={color} opacity="0.85" />
      {/* Center circle */}
      <circle cx={c} cy={c} r={size * 0.06} fill={color} />
      <circle cx={c} cy={c} r={size * 0.12} fill="none" stroke={color} strokeWidth={size * 0.018} opacity="0.5" />
    </svg>
  )
}

function S55Monogram({ size = 48, color = '#ffffff' }) {
  return (
    <svg width={size} height={size * 1.1} viewBox="0 0 60 66" fill="none" xmlns="http://www.w3.org/2000/svg">
      <text
        x="30" y="48"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="58"
        fontWeight="600"
        fontStyle="italic"
        fill={color}
        letterSpacing="-4"
      >S</text>
      <text
        x="42" y="52"
        textAnchor="middle"
        fontFamily="'Cormorant Garamond', Georgia, serif"
        fontSize="28"
        fontWeight="600"
        fill={color}
        opacity="0.9"
      >55</text>
    </svg>
  )
}

export default function Logo({ variant = 'mark', size = 32, color = '#ffffff' }) {
  if (variant === 'mark') {
    return <CompassStar size={size} color={color} />
  }

  if (variant === 's55') {
    return <S55Monogram size={size} color={color} />
  }

  if (variant === 'wordmark') {
    return (
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: size,
        fontWeight: 300,
        letterSpacing: `${size * 0.18}px`,
        color,
        textTransform: 'uppercase',
        lineHeight: 1,
      }}>
        MOTION SICKNESS
      </span>
    )
  }

  if (variant === 'lockup') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: size,
          fontWeight: 300,
          letterSpacing: `${size * 0.22}px`,
          color,
          textTransform: 'uppercase',
          lineHeight: 1,
        }}>
          MOTION SICKNESS
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <S55Monogram size={size * 1.2} color={color} />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: size * 0.28,
              fontWeight: 400,
              letterSpacing: `${size * 0.12}px`,
              color,
              textTransform: 'uppercase',
              opacity: 0.7,
            }}>BY S55</span>
          </div>
          <div style={{ width: '1px', height: `${size * 1.6}px`, background: color, opacity: 0.3 }} />
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
            <CompassStar size={size * 1.1} color={color} />
            <span style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: size * 0.28,
              fontWeight: 400,
              letterSpacing: `${size * 0.12}px`,
              color,
              textTransform: 'uppercase',
              opacity: 0.7,
            }}>MEMBERS ONLY</span>
          </div>
        </div>
      </div>
    )
  }

  return <CompassStar size={size} color={color} />
}
