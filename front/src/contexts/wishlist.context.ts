import { createContext } from 'react'

export interface WishlistContextValue {
  items: number[]
  toggle: (productId: number) => void
  isWishlisted: (productId: number) => boolean
}

export const WishlistContext = createContext<WishlistContextValue | null>(null)
