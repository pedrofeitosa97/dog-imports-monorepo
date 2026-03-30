import api from './api'
import type { Product, ProductFilters, PaginatedResponse, ProductStats } from '../types/api'

export const productService = {
  getAll(params: ProductFilters): Promise<PaginatedResponse<Product>> {
    return api.get<PaginatedResponse<Product>>('/products', { params }).then((r) => r.data)
  },

  getBySlug(slug: string): Promise<Product> {
    return api.get<Product>(`/products/${slug}`).then((r) => r.data)
  },

  getById(id: number): Promise<Product> {
    return api.get<Product>(`/products/${id}`).then((r) => r.data)
  },

  create(formData: FormData): Promise<Product> {
    return api.post<Product>('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },

  update(id: number, formData: FormData): Promise<Product> {
    return api.put<Product>(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then((r) => r.data)
  },

  remove(id: number): Promise<void> {
    return api.delete(`/products/${id}`).then(() => undefined)
  },

  getFeatured(): Promise<Product[]> {
    return api.get<Product[]>('/products/featured').then((r) => r.data)
  },

  getStats(): Promise<ProductStats> {
    return api.get<ProductStats>('/products/stats').then((r) => r.data)
  },
}
