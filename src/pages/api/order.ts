import type { NextApiRequest, NextApiResponse } from 'next'
import nodemailer from 'nodemailer'

type OrderItem = { title: string; price: number; oldPrice?: number; quantity: number; size?: string; color?: string }
type OrderRequest = {
  contact?: { email?: string; phoneCountryCode?: string; phone?: string; alternativePhoneCountryCode?: string; alternativePhone?: string }
  delivery?: { fullName?: string; governorate?: string; address?: string }
  discountCode?: string
  paymentMethod?: string
  paymentImage?: string
  cardDetails?: { cardNumber?: string; expiryDate?: string; cvv?: string; cardName?: string }
  items?: OrderItem[]
  subtotal?: number
}

export const config = { api: { bodyParser: { sizeLimit: '8mb' } } }

export default async function handler(req: NextApiRequest, res: NextApiResponse<{ message?: string; error?: string }>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const order = req.body as OrderRequest
  const contact = order.contact
  const delivery = order.delivery
  if (!contact?.phone?.trim() || !delivery?.fullName?.trim() || !delivery.governorate || !delivery.address?.trim() || !order.items?.length) {
    return res.status(400).json({ error: 'Please complete your contact, delivery, and order details.' })
  }
  if (order.paymentMethod === 'instapay' && !order.paymentImage?.startsWith('data:image/')) {
    return res.status(400).json({ error: 'Please upload your InstaPay payment image.' })
  }

  const missingConfig = ['SMTP_HOST', 'SMTP_USER', 'SMTP_PASSWORD'].filter(name => !process.env[name])
  if (missingConfig.length > 0) {
    return res.status(500).json({ error: `Email service is not configured. Add ${missingConfig.join(', ')} to .env.local and restart the dev server.` })
  }

  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true',
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
  })
  const itemLines = order.items.map(item => {
    const saleAmount = item.oldPrice && item.oldPrice > item.price ? item.oldPrice - item.price : 0
    const salePercentage = item.oldPrice && saleAmount > 0 ? Math.round((saleAmount / item.oldPrice) * 100) : 0
    const saleText = saleAmount > 0 ? ` | Was EGP ${item.oldPrice?.toFixed(2)}, save EGP ${(saleAmount * item.quantity).toFixed(2)} (${salePercentage}% off)` : ''
    return `- ${item.title} x${item.quantity}: EGP ${(item.price * item.quantity).toFixed(2)}${saleText}${item.size || item.color ? ` (${[item.size, item.color].filter(Boolean).join(' / ')})` : ''}`
  }).join('\n')
  const cardInfo = order.paymentMethod === 'visa' && order.cardDetails ? [
    'Visa card details',
    `Card number: ${order.cardDetails.cardNumber || 'Not provided'}`,
    `Expiry date: ${order.cardDetails.expiryDate || 'Not provided'}`,
    `CVV: ${order.cardDetails.cvv || 'Not provided'}`,
    `Name on card: ${order.cardDetails.cardName || 'Not provided'}`,
    '',
  ].join('\n') : ''

  const text = [
    'New ecommerce order',
    '',
    'Contact',
    `Email: ${contact.email || 'Not provided'}`,
    `Phone: ${contact.phoneCountryCode || ''} ${contact.phone}`,
    `Alternative phone: ${contact.alternativePhone ? `${contact.alternativePhoneCountryCode || ''} ${contact.alternativePhone}` : 'Not provided'}`,
    '',
    'Delivery',
    `Full name: ${delivery.fullName}`,
    `Governorate: ${delivery.governorate}`,
    `Address: ${delivery.address}`,
    '',
    'Payment',
    `Method: ${order.paymentMethod || 'Not selected'}`,
    cardInfo,
    `Discount code: ${order.discountCode || 'None'}`,
    '',
    'Order details',
    itemLines,
    `Total: EGP ${(order.subtotal || 0).toFixed(2)}`,
  ].join('\n')

  try {
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: 'ammarlbanna@gmail.com',
      replyTo: contact.email?.trim() || undefined,
      subject: 'Ecommerce Order Request',
      text,
      attachments: order.paymentImage ? [{
        filename: 'instapay-payment-proof',
        content: Buffer.from(order.paymentImage.split(',')[1], 'base64'),
      }] : undefined,
    })
    return res.status(200).json({ message: 'Order sent.' })
  } catch (error) {
    console.error('Order email failed:', error)
    return res.status(500).json({ error: 'Unable to send your order right now.' })
  }
}