import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const CATALOG = `
Motion Sickness by S55 — Drop 001 catalog:
- Core Tee ($75): Off-white, classic fit, S55 heritage crest graphic
- World Championship Tee ($80): Vintage black, Studio 55 Racing detail, bold 55 graphic
- Houston Collegiate Tee ($70): Heather grey, "Motion Sickness Studio 55 Houston" collegiate arch
- Sailing Club Tee ($75): Cream, Members In Motion, coordinates 29.7604° N 95.3698° W
- Property Of MS Tee ($85): Charcoal, Property of Motion Sickness Studio 55
- Ringer Tee ($65): White/Red, clean and bold
- S55 Polo Tank ($85): Black, structured, S55 embroidery
- Sky Blue Athletic Set ($150): Sports bra + leggings, "Move With Motion" print
- S55 Crop Track Jacket ($110): Blush pink, full zip, silver S55 logo [LOCKED - members only]
- Motion Runner Shorts ($70): Butter yellow, S55 mark, white piping
- OG Cap + Tank Top: Free for original members only (FREE 99)
`

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { messages } = req.body

  const response = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 400,
    system: `You are the Motion Sickness by S55 AI stylist — a sharp, confident, luxury streetwear advisor with a Houston edge. You know every piece in the Drop 001 catalog. You give outfit suggestions, styling tips, and product recommendations. Keep responses short (2-4 sentences max), confident, and on-brand. Never be generic. Reference specific pieces by name. The brand vibe: premium, limited, exclusive, Houston-bred, "Move with motion."

Catalog:
${CATALOG}`,
    messages: messages.map(m => ({ role: m.role, content: m.content }))
  })

  res.status(200).json({ reply: response.content[0].text })
}
