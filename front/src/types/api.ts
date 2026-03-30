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
  stock?: number
  sizes?: ProductSize[]
  colors?: ProductColor[]
  category?: Category | string
}

export interface User {
  id: number
  email: string
  name?: string
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
  brand?: string
  category?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
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
