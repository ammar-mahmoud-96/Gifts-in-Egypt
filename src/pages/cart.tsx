import { useSelector } from 'react-redux'
import { RootState } from '../store'
import CartItem from '../components/CartItem'
import Link from 'next/link'

export default function CartPage() {
  const items = useSelector((state: RootState) => state.cart.items)

  const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
  const discount = Math.round(subtotal * 0.2)
  const delivery = 80
  const total = subtotal - discount + delivery
  const itemCount = items.reduce((count, item) => count + item.quantity, 0)

  return (
    <main className="cart-page">
      <div className="cart-header">
        <h1>YOUR CART</h1>
      </div>

      {items.length === 0 ? (
        <p className="empty">Your cart is empty — <Link href="/">go shopping</Link></p>
      ) : (
        <div className="cart-grid">
          <section className="cart-items">
            {items.map(i => <CartItem key={i.id} item={i} />)}
          </section>

          <aside className="order-summary card">
            <div className="summary-heading">
              <div>
                <span className="summary-eyebrow">Your order</span>
                <h3>Order summary</h3>
              </div>
              <span className="summary-item-count">{itemCount} {itemCount === 1 ? 'item' : 'items'}</span>
            </div>
            <div className="summary-breakdown">
              <div className="summary-row"><span>Subtotal</span><span>EGP {subtotal}</span></div>
              <div className="summary-row discount-row"><span>Discount <small>20% off</small></span><span className="neg">− EGP {discount}</span></div>
              <div className="summary-row"><span>Delivery fee</span><span>EGP {delivery}</span></div>
            </div>
            <div className="summary-total"><span>Total</span><span>EGP {total}</span></div>

            {/* <div className="promo">
              <input placeholder="Add promo code" />
              <button className="apply">Apply</button>
            </div> */}

            <Link href="/checkout" className="checkout"><span>Continue to checkout</span><span aria-hidden="true">→</span></Link>
            <p className="summary-secure">Choose your payment method at checkout.</p>
          </aside>
        </div>
      )}
    </main>
  )
}
