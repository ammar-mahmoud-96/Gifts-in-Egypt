import { createSlice } from '@reduxjs/toolkit'
import productsList from '../../data/products.json'
import hydroJugProductsList from '../../data/hydrojug-products.json'

type Product = {
    id: number
    title: string
    description?: string
    price: number
    image?: string
    category: string
    colors: string[]
    sizes: string[]
    dressStyle: string
    isNew?: boolean
    isBestSeller?: boolean
    isOnSale?: boolean
    originalPriceUsd?: number
    priceExchangeRate?: number
    sourceUrl?: string
}

const products: Product[] = [...productsList, ...hydroJugProductsList]

const initialState: { items: Product[] } = {
    items: products
}

const productsSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        setProducts(state, action) {
            state.items = action.payload
        }
    }
})

export const { setProducts } = productsSlice.actions
export default productsSlice.reducer
