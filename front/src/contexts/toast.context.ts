import { createContext } from 'react'

export type ToastVariant = 'success' | 'error' | 'warning' | 'info'

export interface ToastItem {
  id: string
  message: string
  variant: ToastVariant
}

export interface ToastContextValue {
  toasts: ToastItem[]
  toast: (message: string, variant?: ToastVariant) => void
  dismiss: (id: string) => void
}

export const ToastContext = createContext<ToastContextValue | null>(null)
