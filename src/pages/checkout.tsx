import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useRouter } from 'next/router'
import { RootState } from '../store'
import { clearCart } from '../store/slices/cartSlice'
import { addDoc, collection, serverTimestamp } from 'firebase/firestore'
import { getFirebaseAuth, getFirebaseDb } from '../lib/firebase'
import { getDocs, query, where } from 'firebase/firestore'
import { onAuthStateChanged } from 'firebase/auth'

type SavedCheckoutData = {
  email: string
  phoneCountryCode: string
  phone: string
  alternativePhoneCountryCode: string
  alternativePhone: string
  fullName: string
  governorate: string
  address: string
}

type PaymentMethod = 'cash' | 'instapay' | 'visa'

type CardDetails = {
  cardNumber: string
  expiryDate: string
  cvv: string
  cardName: string
}

const DELIVERY_FEE = 80
const formatPrice = (price: number) => `EGP ${price.toFixed(2)}`
const getSaleAmount = (price: number, oldPrice?: number) => oldPrice && oldPrice > price ? oldPrice - price : 0
const getSalePercentage = (price: number, oldPrice?: number) => {
  const saleAmount = getSaleAmount(price, oldPrice)
  return oldPrice && saleAmount > 0 ? Math.round((saleAmount / oldPrice) * 100) : 0
}

export default function Checkout() {
  const dispatch = useDispatch()
  const router = useRouter()
  const cartItems = useSelector((state: RootState) => state.cart.items)
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cash')
  const [isSummaryOpen, setIsSummaryOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [toast, setToast] = useState('')
  const [cardDetails, setCardDetails] = useState<CardDetails>({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: '',
  })
  const [checkoutData, setCheckoutData] = useState<SavedCheckoutData>({
    email: '',
    phoneCountryCode: '+20',
    phone: '',
    alternativePhoneCountryCode: '+20',
    alternativePhone: '',
    fullName: '',
    governorate: '',
    address: '',
  })

  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const totalSavings = cartItems.reduce((sum, item) => sum + getSaleAmount(item.price, item.oldPrice) * item.quantity, 0)
  const total = subtotal + DELIVERY_FEE

  useEffect(() => {
    let active = true

    const loadSavedCheckoutData = async (user: ReturnType<typeof getFirebaseAuth>['currentUser']) => {
      try {
        if (!user) return

        const snapshot = await getDocs(query(collection(getFirebaseDb(), 'orders'), where('userId', '==', user.uid)))
        const orders = snapshot.docs.map(document => document.data())
        orders.sort((first, second) => (second.createdAt?.seconds || 0) - (first.createdAt?.seconds || 0))
        const latestOrder = orders[0]
        if (!active || !latestOrder) return

        const contact = latestOrder.contact || {}
        const delivery = latestOrder.delivery || {}
        setCheckoutData({
          email: contact.email || user.email || '',
          phoneCountryCode: contact.phoneCountryCode || '+20',
          phone: contact.phone || '',
          alternativePhoneCountryCode: contact.alternativePhoneCountryCode || '+20',
          alternativePhone: contact.alternativePhone || '',
          fullName: delivery.fullName || '',
          governorate: delivery.governorate || '',
          address: delivery.address || '',
        })
      } catch (error) {
        console.error('Unable to load saved checkout data:', error)
      }
    }

    let unsubscribe: (() => void) | undefined
    try {
      unsubscribe = onAuthStateChanged(getFirebaseAuth(), user => { void loadSavedCheckoutData(user) })
    } catch (error) {
      console.error('Unable to initialize saved checkout data:', error)
    }

    return () => {
      active = false
      unsubscribe?.()
    }
  }, [])

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (cartItems.length === 0 || isSubmitting) return

    setIsSubmitting(true)
    setToast('')
    const formData = new FormData(event.currentTarget)

    try {
      const paymentImage = formData.get('payment-image')
      if (paymentMethod === 'instapay' && (!(paymentImage instanceof File) || paymentImage.size === 0)) throw new Error('Please upload your InstaPay payment image.')
      if (paymentMethod === 'visa') {
        const requiredCardFields = [
          cardDetails.cardNumber.trim(),
          cardDetails.expiryDate.trim(),
          cardDetails.cvv.trim(),
          cardDetails.cardName.trim(),
        ]
        if (requiredCardFields.some(value => value.length === 0)) {
          throw new Error('Please complete all visa card details.')
        }
      }

      let paymentImageData: string | undefined
      if (paymentMethod === 'instapay' && paymentImage instanceof File) {
        if (!paymentImage.type.startsWith('image/')) throw new Error('Payment proof must be an image file.')
        if (paymentImage.size > 5 * 1024 * 1024) throw new Error('Payment image must be smaller than 5 MB.')
        paymentImageData = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(String(reader.result))
          reader.onerror = () => reject(new Error('Unable to read the payment image.'))
          reader.readAsDataURL(paymentImage)
        })
      }

      const response = await fetch('/api/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contact: {
            email: formData.get('email'),
            phoneCountryCode: formData.get('phone-country-code'),
            phone: formData.get('phone'),
            alternativePhoneCountryCode: formData.get('alternate-phone-country-code'),
            alternativePhone: formData.get('alternate-phone'),
          },
          delivery: {
            fullName: formData.get('full-name'),
            governorate: formData.get('governorate'),
            address: formData.get('address'),
          },
          discountCode: formData.get('discount-code'),
          paymentMethod,
          paymentImage: paymentImageData,
          cardDetails: paymentMethod === 'visa' ? { ...cardDetails } : undefined,
          items: cartItems,
          subtotal: total,
        }),
      })

      const result = await response.json()
      if (!response.ok) throw new Error(result.error)

      const user = getFirebaseAuth().currentUser
      if (user) {
        const firestoreItems = cartItems.map(item => ({
          id: item.id,
          title: item.title,
          price: item.price,
          quantity: item.quantity,
          ...(item.oldPrice !== undefined ? { oldPrice: item.oldPrice } : {}),
          ...(item.image ? { image: item.image } : {}),
          ...(item.size ? { size: item.size } : {}),
          ...(item.color ? { color: item.color } : {}),
        }))

        await addDoc(collection(getFirebaseDb(), 'orders'), {
          userId: user.uid,
          userEmail: user.email || formData.get('email') || null,
          contact: {
            email: formData.get('email') || null,
            phoneCountryCode: formData.get('phone-country-code') || null,
            phone: formData.get('phone') || null,
            alternativePhoneCountryCode: formData.get('alternate-phone-country-code') || null,
            alternativePhone: formData.get('alternate-phone') || null,
          },
          delivery: {
            fullName: formData.get('full-name'),
            governorate: formData.get('governorate'),
            address: formData.get('address'),
          },
          discountCode: formData.get('discount-code') || null,
          paymentMethod,
          cardDetails: paymentMethod === 'visa' ? { ...cardDetails } : null,
          items: firestoreItems,
          subtotal,
          deliveryFee: DELIVERY_FEE,
          total,
          totalSavings,
          createdAt: serverTimestamp(),
        })
      }
      dispatch(clearCart())
      setToast('Your order has been sent successfully.')
      window.setTimeout(() => router.push('/'), 1500)
    } catch (error) {
      setToast(error instanceof Error ? error.message : 'Unable to send your order right now.')
    } finally {
      setIsSubmitting(false)
      window.setTimeout(() => setToast(''), 5000)
    }
  }

  return (
    <main className="checkout-page">
      <header className="checkout-mobile-header">
        <button type="button" aria-label="Go back" onClick={() => window.history.back()}>&larr;</button>
            <strong>Gifts in Egypt</strong>
      </header>
      <section className="checkout-mobile-summary-toggle">
        <button type="button" onClick={() => setIsSummaryOpen(open => !open)} aria-expanded={isSummaryOpen}>
          <span className="summary-toggle-label"><span>{isSummaryOpen ? 'Hide' : 'Show'} order summary</span><b>{itemCount}</b></span>
          <strong>{formatPrice(subtotal)}</strong>
        </button>
        <span>View items in your cart</span>
      </section>
      <section className="checkout-form-panel" aria-label="Checkout details">
        <form id="checkout-form" className="checkout-form" onSubmit={handleSubmit}>
          <section className="checkout-section contact-section">
            <h1>Contact</h1>
            <label htmlFor="email">Email <span>(Optional)</span></label>
            <div className="checkout-input has-icon"><span aria-hidden="true">&#9993;</span><input id="email" name="email" type="email" placeholder="your.email@gmail.com" value={checkoutData.email} onChange={event => setCheckoutData(data => ({ ...data, email: event.target.value }))} /></div>
            <label htmlFor="phone">Phone <b>*</b></label>
            <div className="phone-row"><select name="phone-country-code" aria-label="Phone country code" value={checkoutData.phoneCountryCode} onChange={event => setCheckoutData(data => ({ ...data, phoneCountryCode: event.target.value }))}><option>+20</option></select><div className="checkout-input has-icon"><span aria-hidden="true">&#9742;</span><input id="phone" name="phone" type="tel" placeholder="Phone Number" value={checkoutData.phone} onChange={event => setCheckoutData(data => ({ ...data, phone: event.target.value }))} required /></div></div>
            <label htmlFor="alternate-phone">Alternative Phone <span>(Optional)</span></label>
            <div className="phone-row"><select name="alternate-phone-country-code" aria-label="Alternative phone country code" value={checkoutData.alternativePhoneCountryCode} onChange={event => setCheckoutData(data => ({ ...data, alternativePhoneCountryCode: event.target.value }))}><option>+20</option></select><div className="checkout-input has-icon"><span aria-hidden="true">&#9742;</span><input id="alternate-phone" name="alternate-phone" type="tel" placeholder="Other Phone Number" value={checkoutData.alternativePhone} onChange={event => setCheckoutData(data => ({ ...data, alternativePhone: event.target.value }))} /></div></div>
          </section>
          <section className="checkout-section delivery-section">
            <h2>Delivery</h2>
            <label htmlFor="full-name">Full Name <b>*</b></label>
            <div className="checkout-input"><input id="full-name" name="full-name" placeholder="Your Name" value={checkoutData.fullName} onChange={event => setCheckoutData(data => ({ ...data, fullName: event.target.value }))} required /></div>
            <select className="checkout-select" name="governorate" value={checkoutData.governorate} onChange={event => setCheckoutData(data => ({ ...data, governorate: event.target.value }))} required><option value="">Select Governorate</option><option value="cairo">Cairo</option><option value="giza">Giza</option><option value="alexandria">Alexandria</option></select>
            <textarea className="checkout-textarea" name="address" placeholder="Address" rows={3} value={checkoutData.address} onChange={event => setCheckoutData(data => ({ ...data, address: event.target.value }))} required />
          </section>
          <section className="checkout-section discount-section">
            <label htmlFor="discount-code">Discount Code</label>
            <div className="discount-row"><input id="discount-code" name="discount-code" placeholder="Discount Code" /><button type="button">Apply</button></div>
          </section>
          <section className="checkout-section payment-section">
            <h2>Payment</h2>
            <button type="button" className={`payment-option ${paymentMethod === 'cash' ? 'selected' : ''}`} onClick={() => setPaymentMethod('cash')}><span className="payment-icon">EGP</span><span className="payment-copy"><strong>Cash on Delivery</strong><small>Pay when you receive your order</small></span><span className="payment-radio" aria-hidden="true" /></button>
            <button type="button" className={`payment-option ${paymentMethod === 'instapay' ? 'selected' : ''}`} onClick={() => setPaymentMethod('instapay')}><span className="payment-icon card-icon">IP</span><span className="payment-copy"><strong>Pay with InstaPay</strong><small>Pay securely through InstaPay</small></span><span className="payment-radio" aria-hidden="true" /></button>
            <button type="button" className={`payment-option ${paymentMethod === 'visa' ? 'selected' : ''}`} onClick={() => setPaymentMethod('visa')}><span className="payment-icon card-icon visa-icon">VISA</span><span className="payment-copy"><strong>Pay with Visa</strong><small>Pay securely with your card</small></span><span className="payment-radio" aria-hidden="true" /></button>
            {paymentMethod === 'instapay' && (
              <div className="instapay-payment-box">
                <a className="instapay-link" href="https://ipn.eg/S/ammarbana/instapay/3rNTMl" target="_blank" rel="noreferrer">Open InstaPay payment link</a>
                <p>After payment, upload your payment image.</p>
                <label htmlFor="payment-image">Upload your payment img <b>*</b></label>
                <input id="payment-image" name="payment-image" type="file" accept="image/*" required />
              </div>
            )}
            {paymentMethod === 'visa' && (
              <div className="visa-payment-box">
                <h3>Pay with card</h3>
                <div className="card-details-heading">
                  <strong>Card details</strong>
                  <div className="card-brand-list" aria-label="Accepted payment cards">
                    <span className="card-brand-logo visa-brand">VISA</span>
                    <span className="card-brand-logo mastercard-brand" aria-label="Mastercard"><i /><i /></span>
                    <span className="card-brand-logo aman-brand">AMAN</span>
                  </div>
                </div>
                <label htmlFor="card-number">Card number</label>
                <input
                  id="card-number"
                  type="text"
                  inputMode="numeric"
                  maxLength={19}
                  placeholder="1234 1234 1234 1234"
                  value={cardDetails.cardNumber}
                  onChange={(event) => {
                    const digits = event.target.value.replace(/\D/g, '').slice(0, 16)
                    const masked = digits.replace(/(.{4})/g, '$1 ').trim()
                    setCardDetails(current => ({ ...current, cardNumber: masked }))
                  }}
                />

                <div className="card-row">
                  <div className="card-field">
                    <label htmlFor="expiry-date">Expiry date</label>
                    <input
                      id="expiry-date"
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      placeholder="MM/YY"
                      value={cardDetails.expiryDate}
                      onChange={(event) => {
                        let value = event.target.value.replace(/\D/g, '').slice(0, 4)
                        if (value.length >= 3) value = `${value.slice(0, 2)}/${value.slice(2)}`
                        setCardDetails(current => ({ ...current, expiryDate: value }))
                      }}
                    />
                  </div>
                  <div className="card-field">
                    <label htmlFor="cvv">CVV <span className="cvv-info" title="The 3- or 4-digit security code on your card">ⓘ</span></label>
                    <input
                      id="cvv"
                      type="password"
                      inputMode="numeric"
                      maxLength={4}
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(event) => setCardDetails(current => ({ ...current, cvv: event.target.value.replace(/\D/g, '').slice(0, 4) }))}
                    />
                    <span className="cvv-card-icon" aria-hidden="true"><i>123</i></span>
                  </div>
                </div>

                <label htmlFor="card-name">Name on card</label>
                <input
                  id="card-name"
                  type="text"
                  placeholder="Name on card"
                  value={cardDetails.cardName}
                  onChange={(event) => setCardDetails(current => ({ ...current, cardName: event.target.value }))}
                />
              </div>
            )}
          </section>
        </form>
      </section>
      <aside className={`checkout-summary ${isSummaryOpen ? 'summary-open' : ''}`}>
        <h2>Order Details</h2>
        {cartItems.length === 0 ? (
          <p className="empty-order">Your cart is empty.</p>
        ) : (
          <>
            <div className="order-items">
              {cartItems.map(item => (
                <div className="order-item" key={item.id}>
                  <div className="order-image-wrap"><img src={item.image || '/assets/Products/product1.png'} alt="" /><span>{item.quantity}</span></div>
                  <div className="order-item-copy">
                    <strong>{item.title}</strong>
                    {(item.size || item.color) && <small>{[item.size, item.color].filter(Boolean).join(' / ')}</small>}
                    {getSaleAmount(item.price, item.oldPrice) > 0 && <small className="order-sale-info">Was {formatPrice(item.oldPrice || item.price)} | Save {formatPrice(getSaleAmount(item.price, item.oldPrice))} ({getSalePercentage(item.price, item.oldPrice)}% off)</small>}
                  </div>
                  <strong className="order-item-price">{formatPrice(item.price * item.quantity)}</strong>
                </div>
              ))}
            </div>
            <div className="order-total-row"><span>Subtotal</span><strong>{formatPrice(subtotal)}</strong></div>
            {totalSavings > 0 && <div className="order-total-row savings"><span>You save</span><strong>-{formatPrice(totalSavings)}</strong></div>}
            <div className="order-total-row"><span>Delivery Fee</span><strong>{formatPrice(DELIVERY_FEE)}</strong></div>
            <div className="order-total-row total"><span>Total</span><strong>{formatPrice(total)}</strong></div>
          </>
        )}
        <button className="place-order summary-place-order" type="submit" form="checkout-form" disabled={cartItems.length === 0 || isSubmitting}>{isSubmitting ? 'Sending...' : 'Place Order'}</button>
      </aside>
      <div className="checkout-mobile-footer">
        <div><span>Total</span><strong>{formatPrice(total)}</strong></div>
        <button className="place-order" type="submit" form="checkout-form" disabled={cartItems.length === 0 || isSubmitting}>{isSubmitting ? 'Sending...' : 'Place Order'}</button>
      </div>
      {toast && <div className="checkout-toast" role="status" aria-live="polite"><span>{toast}</span><button type="button" aria-label="Dismiss notification" onClick={() => setToast('')}>&times;</button></div>}
    </main>
  )
}
