import axios from 'axios'
import { STORAGE_KEYS } from '../utils/constants'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem(STORAGE_KEYS.token)
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error: { response?: { status: number } }) => {
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.token)
      window.location.href = '/admin/login'
    }
    return Promise.reject(error)
  }
)

export default api
