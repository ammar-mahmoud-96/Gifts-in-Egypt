import Link from 'next/link'

export default function Terms() {
  return (
    <main className="content-page">
      <div className="content-inner">
        <h1>Terms &amp; Conditions</h1>

        <section>
          <p>Welcome to Gifts in Egypt. These terms and conditions outline the rules and regulations for the use of our website and services. By accessing this site you accept these terms in full. If you disagree with any part of these terms, please do not use our website.</p>
        </section>

        <section>
          <h2>1. Use of the Site</h2>
          <p>You agree to use the site only for lawful purposes and in a way that does not infringe the rights of others or restrict or inhibit anyone else's use and enjoyment of the site.</p>
        </section>

        <section>
          <h2>2. Accounts and Registration</h2>
          <p>To place orders and access certain features you may need to create an account. You are responsible for maintaining the confidentiality of your account credentials and for all activity under your account.</p>
        </section>

        <section>
          <h2>3. Orders and Payments</h2>
          <p>All orders are subject to availability and confirmation of the order price. We reserve the right to refuse any order placed with us.</p>
        </section>

        <section>
          <h2>4. Intellectual Property</h2>
          <p>All content on this site, including text, graphics, logos and images, is our property or licensed to us and is protected by copyright laws.</p>
        </section>

        <section>
          <h2>5. User Conduct</h2>
          <p>Users must not use the site to upload or transmit any content that is unlawful, harmful, defamatory, obscene or otherwise objectionable.</p>
        </section>

        <section>
          <h2>6. Disclaimers &amp; Limitation of Liability</h2>
          <p>The site is provided "as is" and to the fullest extent permitted by law we exclude all representations and warranties. Gifts in Egypt will not be liable for any indirect or consequential loss arising from use of the site.</p>
        </section>

        <section>
          <h2>7. Changes to Terms</h2>
          <p>We may modify these terms at any time. Updated terms will be posted on this page with an updated effective date.</p>
        </section>

        <section>
          <h2>8. Governing Law</h2>
          <p>These terms are governed by and construed in accordance with the laws of the jurisdiction in which Gifts in Egypt operates.</p>
        </section>

        <div className="content-actions">
          <Link href="/">Back to Home</Link>
        </div>
      </div>
    </main>
  )
}
