import React from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { addToCart, removeFromCart, updateQuantity } from '../store/slices/cartSlice'
import { RootState } from '../store'

type Props = {
  id: number
  title: string
  price: number
  oldPrice?: number
  rating?: number
  image?: string
}

export default function ProductItem({ id, title, price, oldPrice, rating = 4.5, image }: Props) {
  const discount = oldPrice && oldPrice > price ? Math.round(((oldPrice - price) / oldPrice) * 100) : 0
  const dispatch = useDispatch()
  const inCart = useSelector((s: RootState) => s.cart.items.find(i => i.id === id))
  const qty = inCart ? inCart.quantity : 0

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault()
    if (inCart) dispatch(updateQuantity({ id, delta: 1 }))
    else dispatch(addToCart({ id, title, price, oldPrice, quantity: 1, image }))
  }

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!inCart) return
    if (inCart.quantity <= 1) dispatch(removeFromCart(id))
    else dispatch(updateQuantity({ id, delta: -1 }))
  }

  return (
    <div className="product-item">
      <Link href={`/product/${id}`} className="product-link">
        <div className="product-image">
          {image ? <img src={image} alt={title} /> : <div className="product-image-placeholder" />}
        </div>
      </Link>

      <div className="product-meta">
        <h3 className="product-title">{title}</h3>

        <div className="product-rating">
          <span className="stars">{Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className={i < Math.round(rating) ? 'star filled' : 'star'}>★</span>
          ))}</span>
          <span className="rating-text">{rating}/5</span>
        </div>

        <div className="product-price-row">
          <div className="price-group">
            <div className="price">EGP {price}</div>
            {oldPrice && <div className="old-price">EGP {oldPrice}</div>}
          </div>
          {discount > 0 && <div className="discount-badge">-{discount}%</div>}
        </div>

        <div style={{ marginTop: 12 }}>
          <div className="qty-controls">
            <button onClick={handleDecrement} className="qty-btn decrement" aria-label="decrease">-</button>
            <div className="qty-display">{qty}</div>
            <button onClick={handleIncrement} className="qty-btn increment" aria-label="increase">+</button>
          </div>
        </div>
      </div>
    </div>
  )
}
