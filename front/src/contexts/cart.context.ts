import { createContext } from 'react'
import type { Product } from '../types/api'

export interface CartItem {
  product: Product
  quantity: number
  selectedSize: string
  selectedColor: string
}

export interface CartContextValue {
  items: CartItem[]
  isOpen: boolean
  totalItems: number
  totalPrice: number
  addItem: (product: Product, quantity?: number, selectedSize?: string, selectedColor?: string) => void
  removeItem: (productId: number, selectedSize: string, selectedColor: string) => void
  updateQuantity: (productId: number, selectedSize: string, selectedColor: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
}

export const CartContext = createContext<CartContextValue | null>(null)
