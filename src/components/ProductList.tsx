import ProductCard from './ProductCard'
import { useSelector } from 'react-redux'
import { RootState } from '../store'

export default function ProductList() {
  const items = useSelector((s: RootState) => s.products.items)

  return (
    <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16, padding: 20}}>
      {items.map(p => (
        <ProductCard key={p.id} id={p.id} title={p.title} price={p.price} />
      ))}
    </div>
  )
}
