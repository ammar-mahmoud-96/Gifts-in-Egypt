export default function Newsletter(){
  return (
    <section className="newsletter-hero">
      <div className="newsletter-box">
        <div className="newsletter-left">
          <h3 className="newsletter-title">STAY UPTO DATE ABOUT<br/>OUR LATEST OFFERS</h3>
        </div>

        <div className="newsletter-right">
          <input className="newsletter-input" placeholder="Enter your email address" aria-label="Email address" />
          <button className="newsletter-cta">Subscribe to Newsletter</button>
        </div>
      </div>
    </section>
  )
}
