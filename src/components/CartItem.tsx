import { useDispatch } from 'react-redux'
import { removeFromCart, updateQuantity } from '../store/slices/cartSlice'

export default function CartItem({ item }: any) {
  const dispatch = useDispatch()
  return (
    <div className="cart-item card">
      <div className="cart-item-inner">
        <div className="cart-thumb">
          <img src={item.image} alt={item.title} />
        </div>

        <div className="cart-details">
          <div className="cart-title">{item.title}</div>
          <div className="cart-meta">Size: {item.size || 'Large'} &nbsp;•&nbsp; Color: {item.color || 'White'}</div>
          <div className="cart-price">EGP {item.price}</div>
        </div>

        <div className="cart-actions">
          <div className="qty-control">
            <button onClick={() => dispatch(updateQuantity({ id: item.id, delta: -1 }))}>-</button>
            <span>{item.quantity}</span>
            <button onClick={() => dispatch(updateQuantity({ id: item.id, delta: 1 }))}>+</button>
          </div>
          <button className="remove" onClick={() => dispatch(removeFromCart(item.id))}>
            🗑
          </button>
        </div>
      </div>
    </div>
  )
}
