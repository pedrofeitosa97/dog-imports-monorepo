import api from './api'
import type { Category, CategoryFormData } from '../types/api'

export const categoryService = {
  getAll(): Promise<Category[]> {
    return api.get<Category[]>('/categories').then((r) => r.data)
  },

  create(data: CategoryFormData): Promise<Category> {
    return api.post<Category>('/categories', data).then((r) => r.data)
  },

  update(id: number, data: CategoryFormData): Promise<Category> {
    return api.put<Category>(`/categories/${id}`, data).then((r) => r.data)
  },

  remove(id: number): Promise<void> {
    return api.delete(`/categories/${id}`).then(() => undefined)
  },
}
