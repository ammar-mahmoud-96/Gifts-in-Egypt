import Link from 'next/link'

export default function Hero() {
  return (
    <section className="hero-landing">
      <div className="hero-container">
        <div className="hero-left">
          <span className="hero-kicker">Drinkware, made personal</span>
          <h1 className="hero-title">GIFTS THAT<br/>GO WHERE<br/>YOU GO</h1>
          <p className="hero-sub">Beautiful mugs, tumblers, and bottles for coffee rituals, cold drinks, and the people you love in Egypt.</p>

          <div style={{marginTop: 28}}>
            <Link href="/all-products" className="btn-primary">Shop Now</Link>
          </div>

          <div className="hero-stats">
            <div className="stat">
              <div className="stat-number">09</div>
              <div className="stat-label">Everyday favorites</div>
            </div>
            <div className="stat">
              <div className="stat-number">24h</div>
              <div className="stat-label">Fast Cairo delivery</div>
            </div>
            <div className="stat">
              <div className="stat-number">100%</div>
              <div className="stat-label">Gift-ready joy</div>
            </div>
          </div>
        </div>

        <div className="hero-right">
          <div className="hero-product-pair">
            <div className="hero-product hero-product-stanley"><img src="/assets/brand-cups/product2.webp" alt="Stanley-style insulated tumbler" /></div>
            <div className="hero-product hero-product-owala"><img src="/assets/brand-cups/product7.jpeg" alt="Owala-style insulated bottle" /></div>
          </div>
        </div>
      </div>
    </section>
  )
}
