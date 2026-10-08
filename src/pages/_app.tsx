import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux'
import { hydrateCart, store } from '../store'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { addToCart } from '../store/slices/cartSlice'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter()
  const isLegacyHome = router.pathname === '/'

  useEffect(() => {
    hydrateCart(window.localStorage.getItem('gifts-in-egypt-cart'))
    return store.subscribe(() => {
      window.localStorage.setItem('gifts-in-egypt-cart', JSON.stringify(store.getState().cart.items))
    })
  }, [])

  useEffect(() => {
    const handleLegacyCartMessage = (event: MessageEvent<{ type?: string; title?: string }>) => {
      if (event.origin !== window.location.origin || event.data?.type !== 'gifts:add-to-cart' || !event.data.title) return
      const product = store.getState().products.items.find(item => item.title === event.data.title)
      if (product) store.dispatch(addToCart({ id: product.id, title: product.title, price: product.price, quantity: 1, image: product.image }))
    }

    window.addEventListener('message', handleLegacyCartMessage)
    return () => window.removeEventListener('message', handleLegacyCartMessage)
  }, [])

  return (
    <Provider store={store}>
      {!isLegacyHome && <Header />}
      <Component {...pageProps} />
      {!isLegacyHome && <Footer />}
    </Provider>
  )
}
