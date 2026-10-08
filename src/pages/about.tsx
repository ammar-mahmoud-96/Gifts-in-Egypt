import React from 'react'
import Link from 'next/link'

export default function AboutPage(): JSX.Element {
  return (
    <main className="content-page">
      <div style={{ maxWidth: 1100, margin: '0 auto', padding: 20 }}>
        <h1 className="section-title">About Us</h1>

        <section className="about-hero">
          <div className="about-hero-text">
            <h2>Our mission</h2>
            <p>
              At Gifts in Egypt we make gifting simple and delightful. We curate
              high-quality products, focus on clear prices and fast delivery,
              and design every experience around the customer.
            </p>
            <p>
              Founded by a small team of designers and engineers, we combine
              thoughtful product curation with a streamlined checkout so you can
              shop with confidence.
            </p>
          </div>
          <div className="about-hero-image" aria-hidden>
            <div className="hero-image-placeholder">Image</div>
          </div>
        </section>

        <section className="who-we-are">
          <h3>Who we are</h3>
          <p>
            We are a remote-first team that values transparency, quality, and
            great customer service. Our small, cross-functional teams ship new
            experiences every week and listen closely to customer feedback.
          </p>

          <div className="team-grid">
            <div className="team-card">
              <div className="team-photo" />
              <strong>Ammar</strong>
              <div className="muted">Founder & CEO</div>
            </div>
            <div className="team-card">
              <div className="team-photo" />
              <strong>Design Lead</strong>
              <div className="muted">Product & UX</div>
            </div>
            <div className="team-card">
              <div className="team-photo" />
              <strong>Engineering</strong>
              <div className="muted">Platform & Frontend</div>
            </div>
          </div>
        </section>

        <p style={{ marginTop: 24 }}>
          Want to get in touch? Visit our <Link href="/contact">Contact page</Link>.
        </p>
      </div>
    </main>
  )
}
