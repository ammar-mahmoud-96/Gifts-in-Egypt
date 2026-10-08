import Link from 'next/link'

type Props = {
  id: number
  title: string
  price: number
}

export default function ProductCard({ id, title, price }: Props) {
  return (
    <div className="card">
      <div className="card-image">Img</div>
      <div className="card-body">
        <h4 className="card-title">{title}</h4>
        <div className="card-price">EGP {price}</div>
        <Link href={`/product/${id}`} className="card-link">View</Link>
      </div>
    </div>
  )
}
