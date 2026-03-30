import { type ReactNode } from 'react'
import { WishlistContext } from './wishlist.context'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/constants'

interface WishlistProviderProps {
  children: ReactNode
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const [items, setItems] = useLocalStorage<number[]>(STORAGE_KEYS.wishlist, [])

  const toggle = (productId: number) => {
    setItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  const isWishlisted = (productId: number) => items.includes(productId)

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}
