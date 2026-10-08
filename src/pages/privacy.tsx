import Link from 'next/link'

export default function Privacy() {
  return (
    <main className="content-page">
      <div className="content-inner">
        <h1>Privacy Policy</h1>

        <section>
          <p>Your privacy is important to us. This privacy policy explains what personal data we collect, how we use it, and the choices you have regarding your information.</p>
        </section>

        <section>
          <h2>Information We Collect</h2>
          <ul>
            <li>Account information (name, email, address)</li>
            <li>Order and payment details</li>
            <li>Device and usage information (cookies, IP address)</li>
          </ul>
        </section>

        <section>
          <h2>How We Use Your Information</h2>
          <p>We use information to process orders, communicate with you, personalize your experience, and improve our services. We do not share personal data with third parties for their direct marketing without your consent.</p>
        </section>

        <section>
          <h2>Cookies</h2>
          <p>We use cookies and similar tracking technologies to provide site functionality and analyze traffic. You can control cookies via your browser settings.</p>
        </section>

        <section>
          <h2>Third-Party Services</h2>
          <p>We may use third-party services for payment processing, analytics and hosting. Those providers have their own privacy policies and we encourage you to review them.</p>
        </section>

        <section>
          <h2>Security</h2>
          <p>We take reasonable measures to protect personal data from loss, misuse and unauthorized access, disclosure, alteration or destruction.</p>
        </section>

        <section>
          <h2>Your Rights</h2>
          <p>You may review, update, or delete your account information by contacting us at the address below or via your account settings. Where applicable you have rights to access, correct or request deletion of your personal data.</p>
        </section>

        <section>
          <h2>Contact</h2>
          <p>If you have questions about this policy, contact us via the <Link href="/contact">Contact</Link> page.</p>
        </section>

        <div className="content-actions">
          <Link href="/">Back to Home</Link>
        </div>
      </div>
    </main>
  )
}
