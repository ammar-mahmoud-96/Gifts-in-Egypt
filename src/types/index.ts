export type Product = {
  id: number
  title: string
  description?: string
  price: number
  category?: string
  colors?: string[]
  sizes?: string[]
  dressStyle?: string
}

export type CartItem = Product & { quantity: number }
