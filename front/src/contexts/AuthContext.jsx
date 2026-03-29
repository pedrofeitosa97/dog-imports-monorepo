import { createContext, useState, useEffect, useCallback } from 'react'
import { authService } from '../services/authService'
import { STORAGE_KEYS } from '../utils/constants'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const checkSession = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEYS.token)
    if (!token) {
      setLoading(false)
      return
    }
    try {
      if (token === 'mock-token') {
        setUser({ id: 1, name: 'Admin', email: 'admin@dogimports.com', isAdmin: true })
      } else {
        const userData = await authService.me()
        setUser(userData)
      }
    } catch {
      localStorage.removeItem(STORAGE_KEYS.token)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const login = async (email, password) => {
    setError(null)
    // Mock temporário — remover quando o backend estiver pronto
    if (email === 'admin@dogimports.com' && password === 'admin123') {
      const mockData = { token: 'mock-token', user: { id: 1, name: 'Admin', email, isAdmin: true } }
      localStorage.setItem(STORAGE_KEYS.token, mockData.token)
      setUser(mockData.user)
      return mockData
    }
    const data = await authService.login(email, password)
    localStorage.setItem(STORAGE_KEYS.token, data.token)
    setUser(data.user)
    return data
  }

  const logout = async () => {
    try {
      await authService.logout()
    } finally {
      localStorage.removeItem(STORAGE_KEYS.token)
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
