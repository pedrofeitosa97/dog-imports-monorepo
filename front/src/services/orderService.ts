import api from './api'
import type { Order, OrderStatus } from '../types/api'
import type { CartItem } from '../contexts/cart.context'

export interface CreateOrderPayload {
  customerName: string
  customerEmail: string
  address: string
  paymentMethod: string
  totalPrice: number
  items: {
    productId: number
    productName: string
    productBrand: string
    productImage?: string
    price: number
    quantity: number
    size?: string
    color?: string
  }[]
}

function cartItemsToPayload(items: CartItem[]) {
  return items.map((i) => ({
    productId: i.product.id,
    productName: i.product.name,
    productBrand: i.product.brand,
    productImage: i.product.images?.[0] ?? undefined,
    price: Number(i.product.price),
    quantity: i.quantity,
    size: i.selectedSize || undefined,
    color: i.selectedColor || undefined,
  }))
}

export const orderService = {
  create(cartItems: CartItem[], data: Omit<CreateOrderPayload, 'items' | 'totalPrice'>, totalPrice: number): Promise<Order> {
    const payload: CreateOrderPayload = {
      ...data,
      totalPrice,
      items: cartItemsToPayload(cartItems),
    }
    return api.post<Order>('/orders', payload).then((r) => r.data)
  },

  myOrders(): Promise<Order[]> {
    return api.get<Order[]>('/orders/my').then((r) => r.data)
  },

  myOrder(id: number): Promise<Order> {
    return api.get<Order>(`/orders/my/${id}`).then((r) => r.data)
  },

  adminList(page = 1, limit = 20): Promise<{ data: Order[]; total: number; totalPages: number }> {
    return api.get(`/orders/admin?page=${page}&limit=${limit}`).then((r) => r.data)
  },

  updateStatus(id: number, status: OrderStatus): Promise<Order> {
    return api.patch<Order>(`/orders/${id}/status`, { status }).then((r) => r.data)
  },
}
