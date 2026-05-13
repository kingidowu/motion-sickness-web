import Anthropic from '@anthropic-ai/sdk'
import { Resend } from 'resend'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
const resend = new Resend(process.env.RESEND_API_KEY)

function brandedEmail(htmlBody) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<title>Motion Sickness by S55</title>
</head>
<body style="margin:0;padding:0;background:#080808;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080808;">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#080808;">

      <!-- Top bar -->
      <tr>
        <td style="padding:0 0 40px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="border-top:3px solid #CC0000;padding-top:24px;">
                <p style="margin:0;font-family:Georgia,serif;font-size:11px;font-weight:700;letter-spacing:5px;color:#CC0000;text-transform:uppercase;">Motion Sickness</p>
                <p style="margin:4px 0 0 0;font-family:Arial,sans-serif;font-size:9px;letter-spacing:3px;color:#444;text-transform:uppercase;">by S55 · Houston, TX</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- AI-generated body -->
      <tr>
        <td style="font-family:Arial,sans-serif;font-size:14px;color:#888;line-height:1.9;padding:0 0 40px 0;">
          ${htmlBody}
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td style="padding:0 0 48px 0;" align="center">
          <a href="https://motionsickness.shop" style="display:inline-block;background:#CC0000;color:#ffffff;font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;text-decoration:none;padding:16px 40px;">
            Shop Now
          </a>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:32px 0 0 0;border-top:1px solid #1a1a1a;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <p style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:10px;font-style:italic;color:#333;letter-spacing:1px;">Move with motion. The rest will play out.</p>
                <p style="margin:0;font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;color:#2a2a2a;text-transform:uppercase;">S55 LLC · Houston, TX · United States</p>
              </td>
            </tr>
            <tr>
              <td style="padding:16px 0 0 0;">
                <a href="https://www.instagram.com/motionsickness.s55" style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;color:#CC0000;text-decoration:none;text-transform:uppercase;margin-right:16px;">Instagram</a>
                <a href="https://motionsickness.shop" style="font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;color:#333;text-decoration:none;text-transform:uppercase;">Shop</a>
              </td>
            </tr>
          </table>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { segment, topic, recipients } = req.body
  if (!topic || !recipients?.length) return res.status(400).json({ error: 'Missing topic or recipients' })
  if (!process.env.ANTHROPIC_API_KEY) return res.status(500).json({ error: 'ANTHROPIC_API_KEY not set in Vercel environment variables' })
  if (!process.env.RESEND_API_KEY) return res.status(500).json({ error: 'RESEND_API_KEY not set in Vercel environment variables' })

  try {
  const copy = await client.messages.create({
    model: 'claude-haiku-4-5-20251001',
    max_tokens: 600,
    messages: [{
      role: 'user',
      content: `You are writing a campaign email for Motion Sickness by S55, a premium streetwear brand from Houston.

Segment: ${segment}
Topic: ${topic}

Write a subject line and an HTML email body snippet (not a full HTML document — just the inner content that will be placed inside a table cell).

Rules:
- Dark luxury streetwear tone. Direct. Confident. Houston energy.
- Max 120 words in the body copy.
- Use inline styles only. Colors: text #888888, headings #ffffff, accent #CC0000.
- Use <h1> for the headline (Georgia serif, font-size 32px, font-weight 400, color #ffffff).
- Use <p> for body copy.
- End with the tagline: <p style="font-family:Arial,sans-serif;font-size:11px;color:#444;font-style:italic;">Move with motion.</p>
- Do NOT include <html>, <body>, <head>, or wrapper divs.

Respond as JSON: { "subject": "...", "html": "..." }`
    }]
  })

  let subject, htmlBody
  try {
    const parsed = JSON.parse(copy.content[0].text)
    subject = parsed.subject
    htmlBody = parsed.html
  } catch {
    subject = `Motion Sickness — ${topic}`
    htmlBody = `<h1 style="font-family:Georgia,serif;font-size:32px;font-weight:400;color:#ffffff;margin:0 0 20px;">${topic}</h1><p style="font-family:Arial,sans-serif;color:#888;">${copy.content[0].text}</p>`
  }

  const branded = brandedEmail(htmlBody)

  const results = await Promise.allSettled(
    recipients.map(email =>
      resend.emails.send({
        from: 'Motion Sickness by S55 <s55@flowsource.cloud>',
        to: email,
        subject,
        html: branded,
      })
    )
  )

  const sent = results.filter(r => r.status === 'fulfilled').length
  res.status(200).json({ sent, total: recipients.length, subject })
  } catch (err) {
    console.error('ai-campaign error:', err)
    res.status(500).json({ error: err.message || 'Internal error' })
  }
}
