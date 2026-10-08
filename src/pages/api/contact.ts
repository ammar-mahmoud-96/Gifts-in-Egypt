import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

type ResponseData = { message?: string; error?: string }

export default async function handler(req: NextApiRequest, res: NextApiResponse<ResponseData>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const { name, email, message } = req.body as { name?: string; email?: string; message?: string }
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({ error: 'Please complete all fields.' })
  }

  const missingConfig = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD'].filter(name => !process.env[name])
  if (missingConfig.length > 0) {
    return res.status(500).json({ error: `Email service is not configured. Add ${missingConfig.join(', ')} to .env.local and restart the dev server.` })
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  })

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'ammarlbanna@gmail.com',
      replyTo: email.trim(),
      subject: 'Ecommerce Contact Request',
      text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\n${message.trim()}`,
    })

    return res.status(200).json({ message: 'Message sent.' })
  } catch (error) {
    console.error('Contact email failed:', error)
    return res.status(500).json({ error: 'Unable to send your message right now.' })
  }
}