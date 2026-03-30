import { useContext } from 'react'
import { WishlistContext } from '../contexts/wishlist.context'

export function useWishlist() {
  const ctx = useContext(WishlistContext)
  if (!ctx) throw new Error('useWishlist deve ser usado dentro de WishlistProvider')
  return ctx
}
