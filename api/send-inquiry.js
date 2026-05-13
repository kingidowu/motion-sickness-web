import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

function brandedEmail(content) {
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
        <td style="padding:0 0 32px 0;">
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

      <!-- Body -->
      ${content}

      <!-- Footer -->
      <tr>
        <td style="padding:40px 0 0 0;border-top:1px solid #1a1a1a;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td>
                <p style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:10px;font-style:italic;color:#333;letter-spacing:1px;">Move with motion. The rest will play out.</p>
                <p style="margin:0;font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;color:#2a2a2a;text-transform:uppercase;">S55 LLC · Houston, TX · United States</p>
              </td>
            </tr>
            <tr>
              <td style="padding:20px 0 0 0;">
                <p style="margin:0;font-family:Arial,sans-serif;font-size:9px;color:#333;">Questions? Reply to this email or DM <a href="https://www.instagram.com/motionsickness.s55" style="color:#CC0000;text-decoration:none;">@motionsickness.s55</a></p>
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

  const { name, email, product, size, quantity, ogMember, message } = req.body

  const confirmationHtml = brandedEmail(`
    <!-- Headline -->
    <tr>
      <td style="padding:0 0 32px 0;">
        <h1 style="margin:0 0 12px 0;font-family:Georgia,serif;font-size:36px;font-weight:400;color:#ffffff;line-height:1.15;letter-spacing:1px;">
          Inquiry received.
        </h1>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#555;letter-spacing:1px;">
          We'll be in touch within 24–48 hours.
        </p>
      </td>
    </tr>

    <!-- Body copy -->
    <tr>
      <td style="padding:0 0 32px 0;">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#888;line-height:1.9;">
          Hey ${name} —<br><br>
          We've received your inquiry for <strong style="color:#ffffff;">${product}</strong>. A member of the S55 team will reach out with payment and shipping details.
          ${ogMember ? '<br><br><strong style="color:#CC0000;">OG Member status noted.</strong> Your cap + tank pack is on us. FREE 99.' : ''}
        </p>
      </td>
    </tr>

    <!-- Order summary -->
    <tr>
      <td style="padding:0 0 40px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #1e1e1e;background:#0d0d0d;">
          <tr>
            <td style="padding:24px 28px;">
              <p style="margin:0 0 20px 0;font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:4px;color:#CC0000;text-transform:uppercase;">Order Details</p>
              <table width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:11px;color:#555;letter-spacing:1px;text-transform:uppercase;padding-bottom:12px;width:40%;">Product</td>
                  <td style="font-family:Arial,sans-serif;font-size:13px;color:#ffffff;padding-bottom:12px;">${product}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:11px;color:#555;letter-spacing:1px;text-transform:uppercase;padding-bottom:12px;">Size</td>
                  <td style="font-family:Arial,sans-serif;font-size:13px;color:#ffffff;padding-bottom:12px;">${size || 'Not specified'}</td>
                </tr>
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:11px;color:#555;letter-spacing:1px;text-transform:uppercase;padding-bottom:${message ? '12px' : '0'};">Quantity</td>
                  <td style="font-family:Arial,sans-serif;font-size:13px;color:#ffffff;padding-bottom:${message ? '12px' : '0'};">${quantity}</td>
                </tr>
                ${message ? `
                <tr>
                  <td style="font-family:Arial,sans-serif;font-size:11px;color:#555;letter-spacing:1px;text-transform:uppercase;">Notes</td>
                  <td style="font-family:Arial,sans-serif;font-size:13px;color:#aaa;">${message}</td>
                </tr>` : ''}
              </table>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    ${ogMember ? `
    <!-- OG badge -->
    <tr>
      <td style="padding:0 0 40px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #CC0000;background:#0d0d0d;">
          <tr>
            <td style="padding:20px 28px;">
              <p style="margin:0 0 6px 0;font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:4px;color:#CC0000;text-transform:uppercase;">OG Member Perk</p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#888;line-height:1.7;">
                OG Cap + Tank Top included — FREE 99. No charge. You were there from the beginning.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>` : ''}

    <!-- CTA -->
    <tr>
      <td style="padding:0 0 40px 0;" align="center">
        <a href="https://motionsickness.shop" style="display:inline-block;background:#CC0000;color:#ffffff;font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;text-decoration:none;padding:16px 40px;">
          Explore Drop 001
        </a>
      </td>
    </tr>
  `)

  const adminHtml = `<!DOCTYPE html>
<html><body style="margin:0;padding:24px;background:#111;font-family:sans-serif;color:#fff;">
<p style="color:#CC0000;font-size:10px;letter-spacing:3px;text-transform:uppercase;margin:0 0 20px;">New Inquiry</p>
<p style="margin:0 0 6px;font-size:16px;"><strong>${name}</strong></p>
<p style="margin:0 0 16px;font-size:13px;color:#888;">${email}</p>
<table style="border-collapse:collapse;width:100%;max-width:400px;">
  <tr style="border-bottom:1px solid #222;">
    <td style="padding:10px 0;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:1px;width:120px;">Product</td>
    <td style="padding:10px 0;font-size:13px;">${product}</td>
  </tr>
  <tr style="border-bottom:1px solid #222;">
    <td style="padding:10px 0;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:1px;">Size</td>
    <td style="padding:10px 0;font-size:13px;">${size || 'N/A'}</td>
  </tr>
  <tr style="border-bottom:1px solid #222;">
    <td style="padding:10px 0;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:1px;">Qty</td>
    <td style="padding:10px 0;font-size:13px;">${quantity}</td>
  </tr>
  <tr style="border-bottom:1px solid #222;">
    <td style="padding:10px 0;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:1px;">OG Member</td>
    <td style="padding:10px 0;font-size:13px;color:${ogMember ? '#CC0000' : '#555'}">${ogMember ? 'YES — Free pack' : 'No'}</td>
  </tr>
  ${message ? `<tr><td style="padding:10px 0;font-size:11px;color:#555;text-transform:uppercase;letter-spacing:1px;">Notes</td><td style="padding:10px 0;font-size:13px;color:#aaa;">${message}</td></tr>` : ''}
</table>
</body></html>`

  try {
    await resend.emails.send({
      from: 'Motion Sickness <support@motionsickness.shop>',
      to: email,
      subject: `Inquiry received — ${product}`,
      html: confirmationHtml,
    })

    await resend.emails.send({
      from: 'Motion Sickness <support@motionsickness.shop>',
      to: 'support@motionsickness.shop',
      subject: `New inquiry: ${product} — ${name}`,
      html: adminHtml,
    })

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
