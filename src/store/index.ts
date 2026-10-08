import { configureStore } from '@reduxjs/toolkit'
import productsReducer from './slices/productsSlice'
import cartReducer from './slices/cartSlice'

export const store = configureStore({
  reducer: {
    products: productsReducer,
    cart: cartReducer,
  }
})

export const hydrateCart = (serializedCart: string | null) => {
  if (!serializedCart) return

  try {
    const items = JSON.parse(serializedCart)
    if (Array.isArray(items)) store.dispatch({ type: 'cart/restoreCart', payload: items })
  } catch {
    window.localStorage.removeItem('gifts-in-egypt-cart')
  }
}

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
