import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import ProductItem from '../components/ProductItem'
import { RootState } from '../store'
import Link from 'next/link'
import Pagination from '../components/Pagination'
import { GetServerSideProps } from 'next'
import { compareHydroJugFirst } from '../utils/productColors'

const PAGE_SIZE = 8

type BestSellersPageProps = {
  initialPage: number
}

export const getServerSideProps: GetServerSideProps<BestSellersPageProps> = async ({ query }) => {
  const requestedPage = typeof query.page === 'string' ? Number(query.page) : 1
  return {
    props: {
      initialPage: Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1
    }
  }
}

export default function BestSellersPage({ initialPage }: BestSellersPageProps): JSX.Element {
  const products = useSelector((s: RootState) => s.products.items
    .filter(p => p.isBestSeller)
    .sort(compareHydroJugFirst))
  const [currentPage, setCurrentPage] = useState(initialPage)
  const totalPages = Math.ceil(products.length / PAGE_SIZE)
  const safeCurrentPage = Math.min(currentPage, Math.max(totalPages, 1))
  const visibleProducts = products.slice((safeCurrentPage - 1) * PAGE_SIZE, safeCurrentPage * PAGE_SIZE)

  return (
    <main className="arrival-section">
      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
          <h1 className="section-title">Best Selling</h1>
          <Link href="/" className="btn-view-all">Back to shop</Link>
        </div>

        <div className="products-results" id="products">
          <div className="product-grid">
          {visibleProducts.map(p => (
            <ProductItem key={p.id} id={p.id} title={p.title} price={p.price} image={p.image} />
          ))}
          </div>

          <Pagination
            currentPage={safeCurrentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            hrefForPage={page => `/best-selling?page=${page}#products`}
          />
        </div>

        {products.length === 0 && (
          <p style={{ textAlign: 'center', color: '#666', marginTop: 24 }}>No best selling items found.</p>
        )}
      </div>
    </main>
  )
}
