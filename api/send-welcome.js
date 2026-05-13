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

  const { name, email, source } = req.body
  const isInstagram = source === 'instagram_follow'

  const welcomeHtml = brandedEmail(`
    <!-- Headline -->
    <tr>
      <td style="padding:0 0 32px 0;">
        <h1 style="margin:0 0 12px 0;font-family:Georgia,serif;font-size:36px;font-weight:400;color:#ffffff;line-height:1.15;letter-spacing:1px;">
          ${isInstagram ? 'Thanks for the support.' : "You're early.<br>Stay ready."}
        </h1>
        <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#555;letter-spacing:1px;">
          ${isInstagram ? 'Drop 002 · Early Access' : 'Drop 002 · Early Access Confirmed'}
        </p>
      </td>
    </tr>

    <!-- Body copy -->
    <tr>
      <td style="padding:0 0 32px 0;">
        <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#888;line-height:1.9;">
          Hey ${name} —<br><br>
          ${isInstagram
            ? "Your follow means everything. We'll verify your post and send your <strong style=\"color:#fff;\">10% discount code</strong> within 24 hours. Stay close."
            : "You're now locked in for Drop 002 early access. Use code <strong style=\"color:#ffffff;\">EARLY10</strong> for 10% off your first order the moment Drop 002 goes live. Limited pieces. No restock."
          }
        </p>
      </td>
    </tr>

    <!-- Info block -->
    <tr>
      <td style="padding:0 0 40px 0;">
        <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #1e1e1e;background:#0d0d0d;">
          <tr>
            <td style="padding:24px 28px;">
              <p style="margin:0 0 12px 0;font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:4px;color:#CC0000;text-transform:uppercase;">What's next</p>
              <p style="margin:0 0 16px 0;font-family:Arial,sans-serif;font-size:13px;color:#666;line-height:1.85;">
                Drop 002 launches in 2 months. Every piece is limited. There is no restock. You'll get the link before anyone else — before it hits Instagram.
              </p>
              <p style="margin:0;font-family:Arial,sans-serif;font-size:11px;color:#444;line-height:1.6;">
                Drop 001 is live now at <a href="https://motionsickness.shop" style="color:#CC0000;text-decoration:none;">motionsickness.shop</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>

    <!-- CTA -->
    <tr>
      <td style="padding:0 0 40px 0;" align="center">
        <a href="https://motionsickness.shop" style="display:inline-block;background:#CC0000;color:#ffffff;font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;text-decoration:none;padding:16px 40px;">
          Shop Drop 001
        </a>
      </td>
    </tr>
  `)

  try {
    await resend.emails.send({
      from: 'Motion Sickness <support@motionsickness.shop>',
      to: email,
      subject: isInstagram
        ? 'Thanks for the support — your code is coming.'
        : "You're in. Drop 002 early access confirmed.",
      html: welcomeHtml,
    })

    await resend.emails.send({
      from: 'Motion Sickness <support@motionsickness.shop>',
      to: 'support@motionsickness.shop',
      subject: `New signup: ${name} (${source})`,
      html: `<div style="font-family:sans-serif;padding:24px;background:#111;color:#fff;max-width:480px;">
        <p style="color:#CC0000;font-size:11px;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px;">New Signup</p>
        <p style="margin:0 0 8px;font-size:14px;"><strong>${name}</strong></p>
        <p style="margin:0 0 4px;font-size:13px;color:#888;">Email: <span style="color:#fff;">${email}</span></p>
        <p style="margin:0;font-size:13px;color:#888;">Source: <span style="color:#fff;">${source}</span></p>
      </div>`,
    })

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
