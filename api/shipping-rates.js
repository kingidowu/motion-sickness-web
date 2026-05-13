const SHIPPO_BASE = 'https://api.goshippo.com'

const ORIGIN = {
  name: 'S55 LLC',
  street1: '8830 Oak Ivy Ln',
  city: 'Richmond',
  state: 'TX',
  zip: '77407',
  country: 'US',
  phone: '4699226827',
  email: 'support@motionsickness.shop',
}

function getParcel(product, qty = 1) {
  const p = (product || '').toLowerCase()
  let spec
  if (p.includes('pack')) spec = { length: '14', width: '12', height: '6', weight: '1.25' }
  else if (p.includes('cap')) spec = { length: '12', width: '10', height: '6', weight: '0.5' }
  else if (p.includes('set') || p.includes('athletic')) spec = { length: '14', width: '12', height: '3', weight: '1.1' }
  else if (p.includes('jersey')) spec = { length: '14', width: '10', height: '2', weight: '0.75' }
  else spec = { length: '12', width: '9', height: '2', weight: '0.5' }

  return {
    length: spec.length,
    width: spec.width,
    height: String(parseFloat(spec.height) + (qty > 1 ? Math.floor(qty / 2) : 0)),
    weight: String(parseFloat(spec.weight) * qty),
    distance_unit: 'in',
    mass_unit: 'lb',
  }
}

async function shippoRequest(path, body) {
  const key = process.env.SHIPPO_API_KEY
  if (!key) throw new Error('SHIPPO_API_KEY not set')
  const res = await fetch(`${SHIPPO_BASE}${path}`, {
    method: 'POST',
    headers: {
      Authorization: `ShippoToken ${key}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
  const data = await res.json()
  if (data.detail || data.non_field_errors) {
    throw new Error(JSON.stringify(data.detail || data.non_field_errors))
  }
  return data
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { address, product, quantity = 1 } = req.body

  if (!address?.street1 || !address?.city || !address?.country) {
    return res.status(400).json({ error: 'Incomplete address' })
  }

  try {
    const shipment = await shippoRequest('/shipments/', {
      address_from: ORIGIN,
      address_to: {
        name: address.name || 'Customer',
        street1: address.street1,
        street2: address.street2 || '',
        city: address.city,
        state: address.state || '',
        zip: address.zip || '',
        country: address.country,
      },
      parcels: [getParcel(product, parseInt(quantity) || 1)],
      async: false,
    })

    const rates = (shipment.rates || [])
      .map(r => ({
        id: r.object_id,
        carrier: r.provider,
        service: r.servicelevel?.name || r.servicelevel_name || r.service_level_name || '',
        rate: parseFloat(r.amount),
        currency: r.currency || 'USD',
        estimated_delivery_date: r.estimated_days
          ? `${r.estimated_days} business day${r.estimated_days === 1 ? '' : 's'}`
          : null,
        attributes: r.attributes || [],
      }))
      .sort((a, b) => a.rate - b.rate)

    res.status(200).json({ rates })
  } catch (err) {
    console.error('Shippo error:', err)
    res.status(500).json({ error: err.message })
  }
}
