import api from './api'
import type { AuthResponse, User } from '../types/api'

export const authService = {
  login(email: string, password: string): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/login', { email, password }).then((r) => r.data)
  },

  register(name: string, email: string, password: string): Promise<AuthResponse> {
    return api.post<AuthResponse>('/auth/register', { name, email, password }).then((r) => r.data)
  },

  me(): Promise<User> {
    return api.get<User>('/auth/me').then((r) => r.data)
  },

  logout(): Promise<void> {
    return api.post('/auth/logout').then(() => undefined)
  },
}
