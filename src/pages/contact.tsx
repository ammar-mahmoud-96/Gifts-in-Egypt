import React, { useState } from 'react'

export default function ContactPage(): JSX.Element {
  const [status, setStatus] = useState('')
  const [isSending, setIsSending] = useState(false)

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setIsSending(true)
    setStatus('')

    const form = event.currentTarget
    const formData = new FormData(form)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error)

      form.reset()
      setStatus('Message sent to our support team. We will reply to your email.')
      window.setTimeout(() => setStatus(''), 5000)
    } catch (error) {
      setStatus(error instanceof Error ? error.message : 'Unable to send your message.')
    } finally {
      setIsSending(false)
    }
  }

  return (
    <main className="content-page">
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 20 }}>
        <h1 className="section-title">Contact Us</h1>

        <div className="contact-grid">
          <div className="contact-info">
            <h3>We're here to help</h3>
            <p>
              Have a question about an order, returns, or product details? Send
              us a message and our support team will reply within 1 business day.
            </p>

            <div className="contact-meta">
              <div><strong>Email:</strong> ammarlbanna@gmail.com</div>
              <div style={{ marginTop: 8 }}><strong>Phone:</strong> +20 109 395 5914</div>
              <div style={{ marginTop: 8 }}><strong>Address:</strong> New Cairo, Egypt</div>
            </div>
          </div>

          <div className="contact-form">
            <form onSubmit={handleSubmit}>
              <label className="label" htmlFor="contact-name">Your name</label>
              <input className="input" id="contact-name" name="name" placeholder="Full name" required />

              <label className="label" htmlFor="contact-email">Email</label>
              <input className="input" id="contact-email" name="email" type="email" placeholder="you@example.com" required />

              <label className="label" htmlFor="contact-message">Message</label>
              <textarea className="input" id="contact-message" name="message" rows={6} placeholder="How can we help?" required />

              <div style={{ marginTop: 12 }}>
                <button className="btn-primary" type="submit" disabled={isSending}>
                  {isSending ? 'Sending...' : 'Send message'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      {status && (
        <div className="contact-toast" role="status" aria-live="polite">
          <span>{status}</span>
          <button type="button" aria-label="Dismiss notification" onClick={() => setStatus('')}>&times;</button>
        </div>
      )}
    </main>
  )
}
