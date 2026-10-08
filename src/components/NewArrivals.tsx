import { useSelector } from 'react-redux'
import { RootState } from '../store'
import ProductItem from './ProductItem'
import Link from 'next/link'

export default function NewArrivals(){
  const items = useSelector((s: RootState) => s.products.items)
  const newArrivals = items.slice(0, 12)
  return (
    <div className="arrival-section">
      <div className="arrival-grid">
        {newArrivals.map((p, idx) => (
          <ProductItem
            key={p.id}
            id={p.id}
            title={p.title}
            price={Math.round(p.price)}
            oldPrice={idx % 2 === 0 ? Math.round(p.price * 1.2) : undefined}
            rating={4.5}
            image={p.image}
          />
        ))}
      </div>

      <div style={{textAlign: 'center', marginTop: 20}}>
        <Link href="/new-arrivals" className="btn-view-all">View All</Link>
      </div>
    </div>
  )
}
