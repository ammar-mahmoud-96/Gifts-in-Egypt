import type { NextApiRequest, NextApiResponse } from 'next'

type PaymentItem = { title: string; price: number; quantity: number }
type PaymentRequest = {
  contact?: { email?: string; phone?: string }
  delivery?: { fullName?: string; governorate?: string; address?: string }
  items?: PaymentItem[]
  total?: number
}

type PaymentResponse = { redirectUrl?: string; error?: string }

const paymobRequest = async (path: string, body: Record<string, unknown>) => {
  const response = await fetch(`https://accept.paymob.com/api/${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.detail || data.message || 'Paymob request failed.')
  return data
}

export default async function handler(req: NextApiRequest, res: NextApiResponse<PaymentResponse>) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed.' })
  }

  const apiKey = process.env.PAYMOB_API_KEY
  const integrationId = Number(process.env.PAYMOB_INTEGRATION_ID)
  const iframeId = process.env.PAYMOB_IFRAME_ID
  if (!apiKey || !integrationId || !iframeId) {
    return res.status(500).json({ error: 'Paymob is not configured. Add PAYMOB_API_KEY, PAYMOB_INTEGRATION_ID, and PAYMOB_IFRAME_ID to .env.local.' })
  }

  const order = req.body as PaymentRequest
  if (!order.items?.length || !order.total || order.total <= 0) {
    return res.status(400).json({ error: 'A valid order is required before starting payment.' })
  }

  try {
    const auth = await paymobRequest('auth/tokens', { api_key: apiKey })
    const amountCents = Math.round(order.total * 100)
    const paymobOrder = await paymobRequest('ecommerce/orders', {
      auth_token: auth.token,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: 'EGP',
      merchant_order_id: `gifts-${Date.now()}`,
      items: order.items.map(item => ({
        name: item.title,
        amount_cents: Math.round(item.price * 100),
        quantity: item.quantity,
        description: item.title,
      })),
    })

    const paymentKey = await paymobRequest('acceptance/payment_keys', {
      auth_token: auth.token,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: paymobOrder.id,
      billing_data: {
        apartment: 'NA',
        email: order.contact?.email || 'customer@example.com',
        floor: 'NA',
        first_name: order.delivery?.fullName?.split(' ')[0] || 'Customer',
        last_name: order.delivery?.fullName?.split(' ').slice(1).join(' ') || 'Customer',
        street: order.delivery?.address || 'NA',
        building: 'NA',
        phone_number: order.contact?.phone || 'NA',
        postal_code: 'NA',
        city: order.delivery?.governorate || 'Cairo',
        country: 'EG',
        state: order.delivery?.governorate || 'Cairo',
      },
      currency: 'EGP',
      integration_id: integrationId,
    })

    return res.status(200).json({ redirectUrl: `https://accept.paymob.com/api/acceptance/iframes/${iframeId}?payment_token=${paymentKey.token}` })
  } catch (error) {
    console.error('Paymob payment initialization failed:', error)
    return res.status(502).json({ error: error instanceof Error ? error.message : 'Unable to start Paymob payment.' })
  }
}
