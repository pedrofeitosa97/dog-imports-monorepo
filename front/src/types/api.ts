export interface Category {
  id: number
  name: string
  slug: string
  description?: string
}

export interface ProductSize {
  id?: number
  name?: string
  label: string
  stock?: number
  available?: boolean
}

export interface ProductColor {
  id?: number
  name: string
  hex: string
  available?: boolean
}

export interface Product {
  id: number
  slug: string
  name: string
  brand: string
  gender?: string | null
  price: number
  originalPrice?: number | null
  discountPct?: number
  description?: string
  rating?: number
  reviewCount?: number
  images: string[]
  badge?: string | null
  isActive?: boolean
  isFeatured?: boolean
  isPromotion?: boolean
  stock?: number
  sizes?: ProductSize[]
  colors?: ProductColor[]
  category?: Category | string
}

export interface User {
  id: number
  email: string
  name?: string
  isAdmin?: boolean
  createdAt?: string
}

export interface AuthResponse {
  token: string
  user: User
}

export interface ProductFilters {
  search?: string
  categoryId?: number
  brands?: string[]
  sizes?: string[]
  colors?: string[]
  gender?: string[]
  categories?: string[]
  priceMin?: number
  priceMax?: number
  sortBy?: string
  page?: number
  limit?: number
  showAll?: boolean
  discount?: boolean
  brand?: string
  category?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
}

export type OrderStatus = 'pendente' | 'confirmado' | 'em_preparo' | 'enviado' | 'entregue' | 'cancelado'

export interface OrderItem {
  id: number
  productId: number
  productName: string
  productBrand: string
  productImage?: string
  price: number
  quantity: number
  size?: string
  color?: string
}

export interface Order {
  id: number
  customerName: string
  customerEmail: string
  address: string
  paymentMethod: string
  status: OrderStatus
  totalPrice: number
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export interface ProductStats {
  totalProducts: number
  totalCategories: number
  activeProducts: number
  outOfStock: number
  lowStock: number
}

export interface CategoryFormData {
  name: string
  description?: string
}

export interface Banner {
  id: number
  imageUrl: string
  eyebrow?: string
  title: string
  subtitle?: string
  cta: string
  ctaUrl: string
  order: number
  isActive: boolean
}

export interface SiteSettings {
  logo_header?: string | null
  logo_footer?: string | null
  favicon?: string | null
  [key: string]: string | null | undefined
}

export interface BannerFormData {
  imageUrl: string
  eyebrow?: string
  title: string
  subtitle?: string
  cta?: string
  ctaUrl?: string
  order?: number
  isActive?: boolean
  imageFile?: File
}

export interface Popup {
  id: number
  imageUrl?: string
  title: string
  subtitle?: string
  cta?: string
  ctaUrl?: string
  isActive: boolean
  delaySeconds: number
  cooldownHours: number
}

export interface PopupFormData {
  title: string
  imageUrl?: string
  subtitle?: string
  cta?: string
  ctaUrl?: string
  isActive?: boolean
  delaySeconds?: number
  cooldownHours?: number
  imageFile?: File
}
