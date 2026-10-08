import Head from 'next/head'
import Link from 'next/link'
import { FormEvent, useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { getFirebaseAuth } from '../lib/firebase'

export default function SignInPage(): JSX.Element {
  const [mode, setMode] = useState<'signIn' | 'create'>('signIn')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [notice, setNotice] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  useEffect(() => {
    try {
      return onAuthStateChanged(getFirebaseAuth(), user => {
        if (user) router.replace('/account')
      })
    } catch (error) {
      setNotice(error instanceof Error ? error.message : 'Firebase authentication is not configured.')
      return undefined
    }
  }, [router])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setNotice('')
    setIsSubmitting(true)

    try {
      const auth = getFirebaseAuth()
      if (mode === 'create') {
        const credential = await createUserWithEmailAndPassword(auth, email, password)
        if (name.trim()) await updateProfile(credential.user, { displayName: name.trim() })
      } else {
        await signInWithEmailAndPassword(auth, email, password)
      }
      await router.push('/account')
    } catch (error) {
      const code = error && typeof error === 'object' && 'code' in error ? String(error.code) : ''
      const messages: Record<string, string> = {
        'auth/invalid-credential': 'The email or password is incorrect.',
        'auth/email-already-in-use': 'An account already exists with this email.',
        'auth/weak-password': 'Use a password with at least 6 characters.',
        'auth/invalid-email': 'Enter a valid email address.',
      }
      setNotice(messages[code] || 'Unable to complete authentication. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Head>
        <title>Sign in | Gifts in Egypt</title>
      </Head>
      <main className="auth-page">
        <section className="auth-panel" aria-labelledby="sign-in-title">
          <Link href="/" className="auth-logo">Gifts in Egypt</Link>
          <div className="auth-copy">
            <span className="auth-eyebrow">{mode === 'signIn' ? 'Welcome back' : 'Join Gifts in Egypt'}</span>
            <h1 id="sign-in-title">{mode === 'signIn' ? 'Sign in to your account' : 'Create your account'}</h1>
            <p>Save your details, track orders, and keep your favorite mugs and cups close.</p>
          </div>
          <form className="auth-form" onSubmit={handleSubmit}>
            {mode === 'create' && <input className="auth-input" value={name} onChange={event => setName(event.target.value)} placeholder="Full name" autoComplete="name" />}
            <input className="auth-input" value={email} onChange={event => setEmail(event.target.value)} type="email" placeholder="Email address" autoComplete="email" required />
            <input className="auth-input" value={password} onChange={event => setPassword(event.target.value)} type="password" placeholder="Password" autoComplete={mode === 'signIn' ? 'current-password' : 'new-password'} minLength={6} required />
            <button type="submit" className="google-button" disabled={isSubmitting}>{isSubmitting ? 'Please wait...' : mode === 'signIn' ? 'Sign in' : 'Create account'}</button>
          </form>
          {notice && <p className="auth-notice auth-error" role="alert">{notice}</p>}
          <button type="button" className="auth-mode-switch" onClick={() => { setMode(mode === 'signIn' ? 'create' : 'signIn'); setNotice('') }}>{mode === 'signIn' ? 'Create a new account' : 'Already have an account? Sign in'}</button>
          <div className="auth-divider"><span>or</span></div>
          <Link href="/" className="auth-secondary-button">Continue as guest</Link>
          <p className="auth-footer">By continuing, you agree to our <Link href="/terms">Terms</Link> and <Link href="/privacy">Privacy Policy</Link>.</p>
        </section>
        <aside className="auth-visual" aria-label="Shop highlights">
          <div className="auth-visual-content">
            <span>GIFTS IN EGYPT</span>
            <h2>Find a cup worth carrying.</h2>
            <p>Thoughtful drinkware, expressive colors, and everyday pieces made to be gifted.</p>
          </div>
        </aside>
      </main>
    </>
  )
}