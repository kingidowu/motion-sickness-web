import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end()

  const { name, email, source } = req.body

  try {
    // Welcome email to subscriber
    await resend.emails.send({
      from: 'Motion Sickness <support@motionsickness.shop>',
      to: email,
      subject: 'You\'re in. Drop 002 early access confirmed.',
      html: `
        <div style="background:#080808;color:#fff;font-family:'Inter',sans-serif;padding:48px 32px;max-width:560px;margin:0 auto;">
          <p style="font-size:10px;letter-spacing:4px;color:#CC0000;text-transform:uppercase;margin-bottom:16px;">Motion Sickness by S55</p>
          <h1 style="font-family:Georgia,serif;font-size:32px;font-weight:400;margin-bottom:24px;line-height:1.2;">
            ${source === 'instagram_follow' ? 'Thanks for the support.' : 'You\'re early. Stay ready.'}
          </h1>
          <p style="color:#888;font-size:14px;line-height:1.9;margin-bottom:24px;">
            Hey ${name}, you're now on the early access list for Drop 002.
            ${source === 'instagram_follow'
              ? ' We\'ll verify your post and send your 10% discount code within 24 hours.'
              : ' Use code <strong style="color:#fff;">EARLY10</strong> for 10% off your first order when Drop 002 goes live.'
            }
          </p>
          <div style="border:1px solid #1e1e1e;padding:20px 24px;margin-bottom:32px;">
            <p style="font-size:11px;font-weight:700;letter-spacing:3px;color:#CC0000;text-transform:uppercase;margin-bottom:8px;">What's next</p>
            <p style="color:#666;font-size:13px;line-height:1.8;">
              Drop 002 launches in 2 months. Limited pieces. No restock. You'll get the link before anyone else.
            </p>
          </div>
          <p style="font-size:12px;color:#555;font-style:italic;margin-bottom:8px;">Move with motion. The rest will play out.</p>
          <p style="font-size:10px;color:#333;letter-spacing:2px;text-transform:uppercase;">S55 LLC · Houston, TX</p>
          <hr style="border:none;border-top:1px solid #1e1e1e;margin:32px 0;">
          <p style="font-size:10px;color:#333;">
            <a href="https://www.instagram.com/motionsickness.s55" style="color:#CC0000;">@motionsickness.s55</a> ·
            <a href="https://motionsickness.shop" style="color:#555;">motionsickness.shop</a>
          </p>
        </div>
      `,
    })

    // Notification to admin
    await resend.emails.send({
      from: 'Motion Sickness <support@motionsickness.shop>',
      to: 'support@motionsickness.shop',
      subject: `New signup: ${name} (${source})`,
      html: `<p><strong>${name}</strong> just signed up via <strong>${source}</strong>.<br>Email: ${email}</p>`,
    })

    res.status(200).json({ ok: true })
  } catch (err) {
    console.error(err)
    res.status(500).json({ error: err.message })
  }
}
