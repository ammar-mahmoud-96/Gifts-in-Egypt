import { createSlice } from '@reduxjs/toolkit'

type CartItem = {
  id: number
  title: string
  price: number
  oldPrice?: number
  quantity: number
  image?: string
  size?: string
  color?: string
}

const initialState: { items: CartItem[] } = {
  items: []
}

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart(state, action) {
      const item = action.payload as CartItem
      const existing = state.items.find(i => i.id === item.id)
      if (existing) existing.quantity += item.quantity
      else state.items.push(item)
    },
    removeFromCart(state, action) {
      const id = action.payload
      state.items = state.items.filter(i => i.id !== id)
    },
    updateQuantity(state, action) {
      const { id, delta } = action.payload as { id: number, delta: number }
      const it = state.items.find(i => i.id === id)
      if (it) {
        it.quantity = Math.max(1, it.quantity + delta)
      }
    },
    clearCart(state) {
      state.items = []
    },
    restoreCart(state, action) {
      state.items = Array.isArray(action.payload) ? action.payload : []
    }
  }
})

export const { addToCart, removeFromCart, clearCart, updateQuantity } = cartSlice.actions
export default cartSlice.reducer
