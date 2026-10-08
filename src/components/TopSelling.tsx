import { useSelector } from 'react-redux'
import { RootState } from '../store'
import ProductItem from './ProductItem'
import Link from 'next/link'

export default function TopSelling(){
  const items = useSelector((s: RootState) => s.products.items)
  // Use price as the current proxy for sales ranking.
  const topSelling = items.slice().sort((a,b) => b.price - a.price).slice(0,7)

  return (
    <div className="arrival-section">
      <div className="arrival-grid">
        {topSelling.map((p, idx) => (
          <ProductItem
            key={p.id}
            id={p.id}
            title={p.title}
            price={Math.round(p.price)}
            oldPrice={idx % 2 === 0 ? Math.round(p.price * 1.15) : undefined}
            rating={4.8}
            image={p.image}
          />
        ))}
      </div>

      <div style={{textAlign: 'center', marginTop: 20}}>
        <Link href="/best-selling" className="btn-view-all">View All</Link>
      </div>
    </div>
  )
}
