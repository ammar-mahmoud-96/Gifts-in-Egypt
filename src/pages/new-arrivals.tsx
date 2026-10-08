import React from 'react'
import { useSelector } from 'react-redux'
import ProductItem from '../components/ProductItem'
import { RootState } from '../store'
import Link from 'next/link'
import { compareHydroJugFirst } from '../utils/productColors'

export default function NewArrivalsPage(): JSX.Element {
  const products = useSelector((s: RootState) => s.products.items
    .filter(p => p.isNew)
    .sort(compareHydroJugFirst))

  return (
    <main className="arrival-section">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h1 className="section-title">New Arrivals</h1>
          <Link href="/" className="btn-view-all">Back to shop</Link>
        </div>

        <div className="arrival-grid">
          {products.map(p => (
            <ProductItem key={p.id} id={p.id} title={p.title} price={p.price} image={p.image} />
          ))}
        </div>

        {products.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: 24 }}>No new arrivals at the moment. Check back soon.</p>
        )}
      </div>
    </main>
  )
}
