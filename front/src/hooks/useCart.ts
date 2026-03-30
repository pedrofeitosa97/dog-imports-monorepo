import { useContext } from 'react'
import { CartContext } from '../contexts/cart.context'
import type { CartContextValue } from '../contexts/cart.context'

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext)
  if (!ctx) throw new Error('useCart deve ser usado dentro de CartProvider')
  return ctx
}
