import nodemailer from 'nodemailer'

export async function POST(req){
  const { name, email, msg } = await req.json()

  // Minimal example using SMTP. Configure env: SMTP_HOST, SMTP_USER, SMTP_PASS, TO_EMAIL
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT||587),
    secure: false,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
  })

  await transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.TO_EMAIL,
    subject: `Website contact from ${name} <${email}>`,
    text: msg
  })

  return new Response(JSON.stringify({ ok: true }), { status: 200 })
}
