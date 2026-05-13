import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, product, size, quantity, ogMember, message } = req.body

  try {
    // Confirmation to customer
    await resend.emails.send({
      from: 'Motion Sickness <support@motionsickness.shop>',
      to: email,
      subject: `Inquiry received — ${product}`,
      html: `
        <div style="background:#080808;color:#fff;font-family:'Inter',sans-serif;padding:48px 32px;max-width:560px;margin:0 auto;">
          <p style="font-size:10px;letter-spacing:4px;color:#CC0000;text-transform:uppercase;margin-bottom:16px;">Motion Sickness by S55</p>
          <h1 style="font-family:Georgia,serif;font-size:28px;font-weight:400;margin-bottom:24px;">Inquiry received.</h1>
          <p style="color:#888;font-size:14px;line-height:1.9;margin-bottom:24px;">
            Hey ${name}, we got your inquiry for <strong style="color:#fff;">${product}</strong>.
            We'll be in touch within 24–48 hours with payment and shipping details.
            ${ogMember ? '<br><br><strong style="color:#CC0000;">OG Member:</strong> Your cap + tank pack is noted. FREE 99.' : ''}
          </p>
          <div style="border:1px solid #1e1e1e;padding:20px 24px;margin-bottom:32px;">
            <p style="font-size:11px;font-weight:700;letter-spacing:3px;color:#CC0000;text-transform:uppercase;margin-bottom:12px;">Your order details</p>
            <p style="color:#666;font-size:13px;line-height:2;">
              Product: <span style="color:#fff;">${product}</span><br>
              Size: <span style="color:#fff;">${size || 'Not specified'}</span><br>
              Quantity: <span style="color:#fff;">${quantity}</span>
              ${message ? `<br>Notes: <span style="color:#fff;">${message}</span>` : ''}
            </p>
          </div>
          <p style="font-size:12px;color:#555;font-style:italic;margin-bottom:8px;">Move with motion. The rest will play out.</p>
          <p style="font-size:10px;color:#333;letter-spacing:2px;text-transform:uppercase;">S55 LLC · Houston, TX</p>
          <hr style="border:none;border-top:1px solid #1e1e1e;margin:32px 0;">
          <p style="font-size:10px;color:#333;">Questions? Reply to this email or DM <a href="https://www.instagram.com/motionsickness.s55" style="color:#CC0000;">@motionsickness.s55</a></p>
        </div>
      `,
    })

    // Notification to admin
    await resend.emails.send({
      from: 'Motion Sickness <support@motionsickness.shop>',
      to: 'support@motionsickness.shop',
      subject: `🛍️ New inquiry: ${product} — ${name}`,
      html: `
        <p><strong>${name}</strong> submitted an inquiry.</p>
        <ul>
          <li>Email: ${email}</li>
          <li>Product: ${product}</li>
          <li>Size: ${size || 'N/A'}</li>
          <li>Qty: ${quantity}</li>
          <li>OG Member: ${ogMember ? 'YES' : 'No'}</li>
          ${message ? `<li>Notes: ${message}</li>` : ''}
        </ul>
      `,
    })

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
