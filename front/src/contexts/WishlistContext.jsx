import { createContext } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/constants'

export const WishlistContext = createContext(null)

export function WishlistProvider({ children }) {
  const [items, setItems] = useLocalStorage(STORAGE_KEYS.wishlist, [])

  const toggle = (productId) => {
    setItems((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    )
  }

  const isWishlisted = (productId) => items.includes(productId)

  return (
    <WishlistContext.Provider value={{ items, toggle, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  )
}
