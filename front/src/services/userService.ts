import api from './api'
import type { User } from '../types/api'

export const userService = {
  list(): Promise<User[]> {
    return api.get<User[]>('/users').then((r) => r.data)
  },

  createAdmin(data: { name: string; email: string; password: string }): Promise<User> {
    return api.post<User>('/users/admin', data).then((r) => r.data)
  },

  setAdmin(id: number, isAdmin: boolean): Promise<User> {
    return api.patch<User>(`/users/${id}/admin`, { isAdmin }).then((r) => r.data)
  },

  remove(id: number): Promise<void> {
    return api.delete(`/users/${id}`).then(() => undefined)
  },
}
