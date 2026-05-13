import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const CARRIER_NAMES = {
  USPS: 'USPS',
  UPS: 'UPS',
  FedEx: 'FedEx',
  DHL: 'DHL',
  DHLExpress: 'DHL Express',
  FEDEX: 'FedEx',
  UPS_SUREPOST: 'UPS SurePost',
}

// Register tracking number with 17track API
async function register17track(trackingNumber, carrier) {
  const key = process.env.TRACK17_API_KEY
  if (!key) return // optional 鈥?tracking link still works without registration
  try {
    await fetch('https://api.17track.net/track/v2.2/register', {
      method: 'POST',
      headers: {
        '17token': key,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify([{ number: trackingNumber }]),
    })
  } catch (err) {
    console.error('17track register error:', err)
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, product, trackingNumber, carrier, estimatedDelivery } = req.body

  if (!email || !trackingNumber) {
    return res.status(400).json({ error: 'email and trackingNumber required' })
  }

  const trackingUrl = `https://t.17track.net/en#nums=${encodeURIComponent(trackingNumber)}`
  const carrierLabel = CARRIER_NAMES[carrier] || carrier || 'Carrier'

  // Register with 17track in background
  await register17track(trackingNumber, carrier)

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Your order shipped</title>
</head>
<body style="margin:0;padding:0;background:#080808;">
<table width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#080808;">
  <tr><td align="center" style="padding:40px 16px;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;background:#080808;">

      <!-- Top bar -->
      <tr>
        <td style="padding:0 0 32px 0;border-top:3px solid #CC0000;padding-top:24px;">
          <p style="margin:0;font-family:Georgia,serif;font-size:11px;font-weight:700;letter-spacing:5px;color:#CC0000;text-transform:uppercase;">Motion Sickness</p>
          <p style="margin:4px 0 0 0;font-family:Arial,sans-serif;font-size:9px;letter-spacing:3px;color:#444;text-transform:uppercase;">by S55 路 Houston, TX</p>
        </td>
      </tr>

      <!-- Headline -->
      <tr>
        <td style="padding:0 0 32px 0;">
          <h1 style="margin:0 0 12px 0;font-family:Georgia,serif;font-size:36px;font-weight:400;color:#ffffff;line-height:1.15;">
            Your order is on the way.
          </h1>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:13px;color:#555;letter-spacing:1px;">
            ${product || 'Your Motion Sickness order'} 路 Shipped via ${carrierLabel}
          </p>
        </td>
      </tr>

      <!-- Body copy -->
      <tr>
        <td style="padding:0 0 32px 0;">
          <p style="margin:0;font-family:Arial,sans-serif;font-size:14px;color:#888;line-height:1.9;">
            Hey ${name} 鈥?br><br>
            Your order has shipped. Track it live with the button below.${estimatedDelivery ? ` Estimated delivery: <strong style="color:#fff;">${estimatedDelivery}</strong>.` : ''} Stay close.
          </p>
        </td>
      </tr>

      <!-- Tracking box -->
      <tr>
        <td style="padding:0 0 40px 0;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border:1px solid #1e1e1e;background:#0d0d0d;">
            <tr>
              <td style="padding:24px 28px;">
                <p style="margin:0 0 12px 0;font-family:Arial,sans-serif;font-size:9px;font-weight:700;letter-spacing:4px;color:#CC0000;text-transform:uppercase;">Tracking Info</p>
                <table width="100%" cellpadding="0" cellspacing="0" border="0">
                  <tr>
                    <td style="font-family:Arial,sans-serif;font-size:11px;color:#555;letter-spacing:1px;text-transform:uppercase;padding-bottom:10px;width:40%;">Carrier</td>
                    <td style="font-family:Arial,sans-serif;font-size:13px;color:#ffffff;padding-bottom:10px;">${carrierLabel}</td>
                  </tr>
                  <tr>
                    <td style="font-family:Arial,sans-serif;font-size:11px;color:#555;letter-spacing:1px;text-transform:uppercase;">Tracking #</td>
                    <td style="font-family:Arial,sans-serif;font-size:13px;color:#ffffff;font-family:monospace;letter-spacing:1px;">${trackingNumber}</td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </td>
      </tr>

      <!-- CTA -->
      <tr>
        <td style="padding:0 0 48px 0;" align="center">
          <a href="${trackingUrl}" style="display:inline-block;background:#CC0000;color:#ffffff;font-family:Arial,sans-serif;font-size:10px;font-weight:700;letter-spacing:4px;text-transform:uppercase;text-decoration:none;padding:16px 40px;">
            Track Your Package
          </a>
        </td>
      </tr>

      <!-- Footer -->
      <tr>
        <td style="padding:32px 0 0 0;border-top:1px solid #1a1a1a;">
          <p style="margin:0 0 8px 0;font-family:Georgia,serif;font-size:10px;font-style:italic;color:#333;letter-spacing:1px;">Move with motion. The rest will play out.</p>
          <p style="margin:0 0 16px 0;font-family:Arial,sans-serif;font-size:9px;letter-spacing:2px;color:#2a2a2a;text-transform:uppercase;">S55 LLC 路 Houston, TX 路 United States</p>
          <p style="margin:0;font-family:Arial,sans-serif;font-size:9px;color:#333;">Questions? Reply to this email or DM <a href="https://www.instagram.com/motionsickness.s55" style="color:#CC0000;text-decoration:none;">@motionsickness.s55</a></p>
        </td>
      </tr>

    </table>
  </td></tr>
</table>
</body>
</html>`

  try {
    await resend.emails.send({
      from: 'Motion Sickness by S55 <s55@flowsource.cloud>',
      to: email,
      subject: `Your order shipped 鈥?Track it now`,
      html,
    })

    res.status(200).json({ ok: true, trackingUrl })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
