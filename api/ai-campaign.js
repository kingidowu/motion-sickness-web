import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { segment, topic, recipients } = req.body

  // Generate email copy with Claude
  const copy = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `Write a short, premium email for Motion Sickness by S55 streetwear brand.
Segment: ${segment}
Topic/message: ${topic}

Write a subject line and HTML email body. Dark luxury streetwear tone. Houston energy. "Move with motion." vibe.
Max 150 words in the body. Include the slogan at the end.

Format your response as JSON: { "subject": "...", "html": "..." }`
    }]
  })

  let subject, html
  try {
    const parsed = JSON.parse(copy.content[0].text)
    subject = parsed.subject
    html = parsed.html
  } catch {
    subject = `Motion Sickness — ${topic}`
    html = copy.content[0].text
  }

  // Wrap in brand template
  const branded = `
    <div style="background:#080808;color:#fff;font-family:'Inter',sans-serif;padding:48px 32px;max-width:560px;margin:0 auto;">
      <p style="font-size:10px;letter-spacing:4px;color:#CC0000;text-transform:uppercase;margin-bottom:24px;">Motion Sickness by S55</p>
      ${html}
      <hr style="border:none;border-top:1px solid #1e1e1e;margin:32px 0;">
      <p style="font-size:10px;color:#333;">
        <a href="https://www.instagram.com/motionsickness.s55" style="color:#CC0000;">@motionsickness.s55</a> ·
        <a href="https://motionsickness.shop" style="color:#555;">motionsickness.shop</a>
      </p>
    </div>
  `

  // Send to all recipients in batches
  const results = await Promise.allSettled(
    recipients.map(email =>
      resend.emails.send({
        from: 'Motion Sickness <support@motionsickness.shop>',
        to: email,
        subject,
        html: branded,
      })
    )
  )

  const sent = results.filter(r => r.status === 'fulfilled').length
  res.status(200).json({ sent, total: recipients.length, subject })
}
