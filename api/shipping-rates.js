// EasyPost REST API — no package needed
const EASYPOST_BASE = 'https://api.easypost.com/v2'

const ORIGIN = {
  name: 'S55 LLC',
  street1: '2700 Post Oak Blvd',
  city: 'Houston',
  state: 'TX',
  zip: '77056',
  country: 'US',
  phone: '7135550001',
}

// Approximate parcel dimensions (inches) and weight (oz) per product type
function getParcel(product, qty = 1) {
  const p = (product || '').toLowerCase()
  let spec
  if (p.includes('pack')) spec = { length: 14, width: 12, height: 6, weight: 20 }
  else if (p.includes('cap')) spec = { length: 12, width: 10, height: 6, weight: 8 }
  else if (p.includes('set') || p.includes('athletic')) spec = { length: 14, width: 12, height: 3, weight: 18 }
  else if (p.includes('jersey')) spec = { length: 14, width: 10, height: 2, weight: 12 }
  else spec = { length: 12, width: 9, height: 2, weight: 8 }

  return {
    length: spec.length,
    width: spec.width,
    height: spec.height + (qty > 1 ? Math.floor(qty / 2) : 0),
    weight: spec.weight * qty,
  }
}

async function easypost(path, body) {
  const key = process.env.EASYPOST_API_KEY
  if (!key) throw new Error('EASYPOST_API_KEY not set')
  const auth = Buffer.from(key + ':').toString('base64')
  const res = await fetch(`${EASYPOST_BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${auth}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data?.error?.message || 'EasyPost error')
  return data
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { address, product, quantity = 1 } = req.body

  if (!address?.street1 || !address?.city || !address?.country) {
    return res.status(400).json({ error: 'Incomplete address' })
  }

  try {
    const shipment = await easypost('/shipments', {
      shipment: {
        from_address: ORIGIN,
        to_address: {
          street1: address.street1,
          street2: address.street2 || undefined,
          city: address.city,
          state: address.state || undefined,
          zip: address.zip || undefined,
          country: address.country,
          name: address.name || 'Customer',
        },
        parcel: getParcel(product, parseInt(quantity) || 1),
      },
    })

    const rates = (shipment.rates || [])
      .map(r => ({
        id: r.id,
        carrier: r.carrier,
        service: r.service,
        rate: parseFloat(r.rate),
        currency: r.currency || 'USD',
        delivery_days: r.delivery_days,
        estimated_delivery_date: r.est_delivery_days
          ? `${r.est_delivery_days} business days`
          : r.delivery_date
            ? new Date(r.delivery_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
            : null,
      }))
      .sort((a, b) => a.rate - b.rate)

    res.status(200).json({ rates })
  } catch (err) {
    console.error('Shipping rates error:', err)
    res.status(500).json({ error: err.message })
  }
}
