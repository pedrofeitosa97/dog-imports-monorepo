import { createContext, useReducer, useEffect, useState } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { STORAGE_KEYS } from '../utils/constants'

export const CartContext = createContext(null)

function cartReducer(state, action) {
  switch (action.type) {
    case 'INIT':
      return action.payload

    case 'ADD': {
      const { product, quantity, selectedSize, selectedColor } = action.payload
      const key = `${product.id}-${selectedSize}-${selectedColor}`
      const existing = state.find((i) => `${i.product.id}-${i.selectedSize}-${i.selectedColor}` === key)
      if (existing) {
        return state.map((i) =>
          `${i.product.id}-${i.selectedSize}-${i.selectedColor}` === key
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      }
      return [...state, { product, quantity, selectedSize, selectedColor }]
    }

    case 'REMOVE': {
      const { productId, selectedSize, selectedColor } = action.payload
      return state.filter(
        (i) => !(i.product.id === productId && i.selectedSize === selectedSize && i.selectedColor === selectedColor)
      )
    }

    case 'UPDATE_QTY': {
      const { productId, selectedSize, selectedColor, quantity } = action.payload
      if (quantity <= 0) {
        return state.filter(
          (i) => !(i.product.id === productId && i.selectedSize === selectedSize && i.selectedColor === selectedColor)
        )
      }
      return state.map((i) =>
        i.product.id === productId && i.selectedSize === selectedSize && i.selectedColor === selectedColor
          ? { ...i, quantity }
          : i
      )
    }

    case 'CLEAR':
      return []

    default:
      return state
  }
}

export function CartProvider({ children }) {
  const [saved, setSaved] = useLocalStorage(STORAGE_KEYS.cart, [])
  const [items, dispatch] = useReducer(cartReducer, saved)
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    setSaved(items)
  }, [items])

  const addItem = (product, quantity = 1, selectedSize = '', selectedColor = '') => {
    dispatch({ type: 'ADD', payload: { product, quantity, selectedSize, selectedColor } })
  }

  const removeItem = (productId, selectedSize, selectedColor) => {
    dispatch({ type: 'REMOVE', payload: { productId, selectedSize, selectedColor } })
  }

  const updateQuantity = (productId, selectedSize, selectedColor, quantity) => {
    dispatch({ type: 'UPDATE_QTY', payload: { productId, selectedSize, selectedColor, quantity } })
  }

  const clearCart = () => dispatch({ type: 'CLEAR' })

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.product.price * i.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        items,
        isOpen,
        totalItems,
        totalPrice,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
      }}
    >
      {children}
    </CartContext.Provider>
  )
}
