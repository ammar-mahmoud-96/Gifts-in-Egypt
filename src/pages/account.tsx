import Head from 'next/head'
import Link from 'next/link'
import { onAuthStateChanged, signOut } from 'firebase/auth'
import { useEffect, useState } from 'react'
import type { User } from 'firebase/auth'
import { getFirebaseAuth, getFirebaseDb } from '../lib/firebase'
import { collection, getDocs, query, where } from 'firebase/firestore'

type AccountOrder = {
  id: string
  items: Array<{ title: string; quantity: number; price: number }>
  subtotal: number
  paymentMethod?: string
  delivery?: {
    fullName?: string
    governorate?: string
    address?: string
  }
  createdAt?: { seconds?: number }
}

type SavedAddress = {
  fullName: string
  governorate: string
  address: string
}

const formatPrice = (price: number) => `EGP ${price.toFixed(2)}`
const formatOrderDate = (createdAt?: { seconds?: number }) => createdAt?.seconds
  ? new Date(createdAt.seconds * 1000).toLocaleDateString()
  : 'Recently placed'

export default function AccountPage(): JSX.Element {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [orders, setOrders] = useState<AccountOrder[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const displayName = user?.displayName || 'Shopper'

  const savedAddresses = orders.reduce<SavedAddress[]>((addresses, order) => {
    const delivery = order.delivery
    if (!delivery?.address || !delivery.governorate) return addresses

    const isDuplicate = addresses.some(savedAddress =>
      savedAddress.address === delivery.address && savedAddress.governorate === delivery.governorate
    )
    if (!isDuplicate) {
      addresses.push({
        fullName: delivery.fullName || displayName,
        governorate: delivery.governorate,
        address: delivery.address,
      })
    }
    return addresses
  }, [])

  const loadOrders = async (uid: string) => {
    setOrdersLoading(true)
    try {
      const snapshot = await getDocs(query(collection(getFirebaseDb(), 'orders'), where('userId', '==', uid)))
      const userOrders = snapshot.docs.map(document => ({ id: document.id, ...document.data() } as AccountOrder))
      userOrders.sort((first, second) => (second.createdAt?.seconds || 0) - (first.createdAt?.seconds || 0))
      setOrders(userOrders)
    } catch (error) {
      console.error('Unable to load orders:', error)
    } finally {
      setOrdersLoading(false)
    }
  }

  useEffect(() => {
    try {
      return onAuthStateChanged(getFirebaseAuth(), currentUser => {
        setUser(currentUser)
        setIsLoading(false)
        if (currentUser) void loadOrders(currentUser.uid)
      })
    } catch {
      setIsLoading(false)
      return undefined
    }
  }, [])

  if (isLoading) return <main className="profile-page"><p>Loading your profile...</p></main>

  if (!user) {
    return (
      <main className="profile-page profile-guest-page">
        <div className="profile-card profile-guest-card">
          <span className="profile-eyebrow">My profile</span>
          <h1>Sign in to see your profile</h1>
          <p>Sign in to access your orders, saved addresses, and account preferences.</p>
          <Link href="/sign-in" className="profile-sign-in">Sign in to continue</Link>
        </div>
      </main>
    )
  }

  const email = user.email || 'No email available'

  return (
    <>
      <Head>
        <title>My Profile | Gifts in Egypt</title>
      </Head>
      <main className="profile-page">
        <div className="profile-heading">
          <div>
            <span className="profile-eyebrow">Personal space</span>
            <h1>My Profile</h1>
            <p>Manage your account, orders, and saved delivery details.</p>
          </div>
          <button type="button" className="profile-sign-in profile-sign-out" onClick={() => signOut(getFirebaseAuth())}>Sign out</button>
        </div>

        <div className="profile-layout">
          <aside className="profile-sidebar">
            <div className="profile-avatar">{displayName.charAt(0).toUpperCase()}</div>
            <strong>{displayName}</strong>
            <span>{email}</span>
            <nav className="profile-nav" aria-label="Profile navigation">
              <a className="active" href="#overview">Overview</a>
              <a href="#orders">Orders</a>
              <a href="#addresses">Addresses</a>
              <a href="#settings">Settings</a>
            </nav>
          </aside>

          <div className="profile-content">
            <section className="profile-card profile-welcome" id="overview">
              <div>
                <span className="profile-card-label">Account overview</span>
                <h2>Welcome, {displayName.split(' ')[0]}</h2>
                <p>Your account is ready for faster checkout and easier order tracking.</p>
              </div>
              <span className="profile-card-action">Email account</span>
            </section>

            <section className="profile-stats" id="orders">
              <div className="profile-stat"><span>Orders</span><strong>{orders.length}</strong><small>{orders.length ? 'Orders placed' : 'No orders yet'}</small></div>
              <div className="profile-stat"><span>Saved items</span><strong>0</strong><small>Build your wishlist</small></div>
              <div className="profile-stat"><span>Addresses</span><strong>0</strong><small>Add one at checkout</small></div>
            </section>

            <section className="profile-card profile-list-card">
              <div className="profile-card-heading"><div><span className="profile-card-label">Purchase history</span><h2>Your orders</h2></div></div>
              {ordersLoading ? <p className="profile-empty">Loading your orders...</p> : orders.length === 0 ? <p className="profile-empty">Your completed orders will appear here.</p> : (
                <div className="account-orders">
                  {orders.map(order => <article className="account-order" key={order.id}>
                    <div className="account-order-header"><strong>Order #{order.id.slice(0, 8)}</strong><span>{formatOrderDate(order.createdAt)}</span></div>
                    <div className="account-order-items">{order.items.map((item, index) => <span key={`${order.id}-${index}`}>{item.title} x{item.quantity}</span>)}</div>
                    <div className="account-order-footer"><span>{order.paymentMethod === 'cash' ? 'Cash on Delivery' : order.paymentMethod || 'Payment pending'}</span><strong>{formatPrice(order.subtotal)}</strong></div>
                  </article>)}
                </div>
              )}
            </section>

            <section className="profile-card profile-list-card" id="addresses">
              <div className="profile-card-heading"><div><span className="profile-card-label">Delivery</span><h2>Saved addresses</h2></div><button type="button">+ Add address</button></div>
              {savedAddresses.length === 0 ? <p className="profile-empty">No saved addresses yet. Add one during checkout to use it next time.</p> : (
                <div className="saved-addresses">
                  {savedAddresses.map(savedAddress => <article className="saved-address" key={`${savedAddress.governorate}-${savedAddress.address}`}>
                    <strong>{savedAddress.fullName}</strong>
                    <span>{savedAddress.address}</span>
                    <small>{savedAddress.governorate}</small>
                  </article>)}
                </div>
              )}
            </section>

            <section className="profile-card profile-list-card" id="settings">
              <div className="profile-card-heading"><div><span className="profile-card-label">Preferences</span><h2>Account settings</h2></div></div>
              <div className="profile-setting"><span>Email updates</span><small>Receive news about new arrivals and offers</small><span className="profile-toggle" aria-hidden="true" /></div>
              <div className="profile-setting"><span>Order notifications</span><small>Get updates about your delivery</small><span className="profile-toggle" aria-hidden="true" /></div>
            </section>
          </div>
        </div>
      </main>
    </>
  )
}