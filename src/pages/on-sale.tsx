import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import ProductItem from '../components/ProductItem'
import { RootState } from '../store'
import Link from 'next/link'
import Pagination from '../components/Pagination'

const PAGE_SIZE = 8

export default function OnSalePage(): JSX.Element {
  const products = useSelector((s: RootState) => s.products.items.filter(p => p.isOnSale))
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = Math.ceil(products.length / PAGE_SIZE)
  const visibleProducts = products.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <main className="arrival-section">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h1 className="section-title">On Sale</h1>
          <Link href="/" className="btn-view-all">Back to shop</Link>
        </div>

        <div className="product-grid">
          {visibleProducts.map(p => (
            <ProductItem key={p.id} id={p.id} title={p.title} price={p.price} oldPrice={Math.round(p.price * 1.25)} image={p.image} />
          ))}
        </div>

        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

        {products.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: 24 }}>No sale items right now.</p>
        )}
      </div>
    </main>
  )
}
