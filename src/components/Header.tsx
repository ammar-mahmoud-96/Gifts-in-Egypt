import Link from 'next/link'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { RootState } from '../store'
import { useRouter } from 'next/router'

export default function Header(): JSX.Element {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [isFocused, setIsFocused] = useState(false)
  const cartItems = useSelector((s: RootState) => s.cart.items)
  const cartCount = cartItems.reduce((sum, it) => sum + (it.quantity || 0), 0)

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // navigation happens while typing (debounced). keep submit no-op to avoid duplicate navigation.
  }

  // Debounce navigation on typing — only while input is focused
  useEffect(() => {
    if (!isFocused) return

    const handler = setTimeout(() => {
      const q = searchTerm.trim()
      // only navigate when there is a non-empty search term
      if (!q) return
      router.push(`/all-products?q=${encodeURIComponent(q)}`)
    }, 300)

    return () => clearTimeout(handler)
  }, [searchTerm, router, isFocused])

  // initialize search input from query when page loads
  useEffect(() => {
    if (typeof router.query.q === 'string' && router.query.q !== searchTerm) {
      setSearchTerm(router.query.q)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query.q])

  return (
    <header className="site-header">
      <div className="header-inner">
        <div className="header-left">
          <Link href="/" className="logo-link">
            <span className="site-logo-text">Gifts in Egypt</span>
          </Link>

          <nav className="header-nav" aria-label="main navigation">
            <Link href="/all-products">Shop</Link>
            <Link href="/on-sale">
              On Sale
            </Link>
            <Link href="/new-arrivals">New Arrivals</Link>
            <Link href="/best-selling">Best Selling</Link>
          </nav>
        </div>

        <div className="header-center">
          <form role="search" className="header-search" onSubmit={handleSearch}>
            <svg className="search-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 21l-4.35-4.35" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="11" cy="11" r="6" stroke="#999" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            <input
              className="header-search-input"
              placeholder="Search for products..."
              aria-label="Search products"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
          </form>
        </div>

        <div className="header-right">
          <Link href="/cart" aria-label="Cart" className="icon-link">
            <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 6h15l-1.5 9h-12z" stroke="#111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="10" cy="19" r="1" fill="#111"/>
              <circle cx="18" cy="19" r="1" fill="#111"/>
            </svg>
            {cartCount > 0 && (
              <span className="cart-badge">{cartCount}</span>
            )}
          </Link>

          <Link href="/account" aria-label="Account" className="icon-link">
            <svg className="icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" stroke="#111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
              <circle cx="12" cy="7" r="4" stroke="#111" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Link>
        </div>
      </div>
    </header>
  )
}
