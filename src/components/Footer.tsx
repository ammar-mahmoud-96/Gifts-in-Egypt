import Link from 'next/link'

export default function Footer(){
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-top">
          <div className="footer-left">
            <span className="footer-logo-text">Gifts in Egypt</span>
            <p className="footer-desc">Thoughtful drinkware for Egyptian homes, desks, road trips, and every kind of gift.</p>
            <div className="social-icons">
              <a href="https://www.instagram.com/gifts.in.egypt/" target="_blank" rel="noreferrer" aria-label="Instagram" title="Instagram" className="social social-text">
                ig
              </a>

              <a href="https://www.tiktok.com/@gifts.in.egypt" target="_blank" rel="noreferrer" aria-label="TikTok" title="TikTok" className="social social-text">
                tk
              </a>
            </div>
          </div>

          <div className="footer-cols">
            <div className="footer-col">
              <div className="col-title">COMPANY</div>
              <ul>
                <li><Link href="/about">About</Link></li>
                <li><Link href="/contact">Contact</Link></li>
                <li><Link href="/">Home</Link></li>
                <li><Link href="/all-products">All Products</Link></li>
              </ul>
            </div>

            <div className="footer-col">
              <div className="col-title">HELP</div>
              <ul>
                <li><Link href="/contact">Customer Support</Link></li>
                <li><Link href="/terms">Terms &amp; Conditions</Link></li>
                <li><Link href="/privacy">Privacy Policy</Link></li>
              </ul>
            </div>

          </div>
        </div>

        <div className="footer-divider" />

        <div className="footer-bottom">
          <div className="copyright">Gifts in Egypt ©2026, All Rights Reserved</div>
          <a className="powered-by" href="https://egyptcode.online/" target="_blank" rel="noopener noreferrer">
            Powered by <span>EgyptCode</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
