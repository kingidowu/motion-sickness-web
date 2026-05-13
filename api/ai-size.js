import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { height, weight, fit, product } = req.body

  const message = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 300,
    messages: [{
      role: 'user',
      content: `You are a sizing expert for Motion Sickness by S55, a premium streetwear brand based in Houston, TX. The brand runs true to size with a slightly relaxed streetwear cut.

Customer info:
- Height: ${height}
- Weight: ${weight}
- Fit preference: ${fit}
- Product: ${product || 'T-shirt'}

Give a size recommendation (XS/S/M/L/XL/2XL) with one short sentence of reasoning. Be confident and direct. Format: "We recommend SIZE — [reason]." Nothing else.`
    }]
  })

  res.status(200).json({ recommendation: message.content[0].text })
}
