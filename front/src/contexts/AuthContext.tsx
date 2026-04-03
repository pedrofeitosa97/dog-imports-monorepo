import { useState, useEffect, useCallback, type ReactNode } from 'react'
import { AuthContext } from './auth.context'
import { authService } from '../services/authService'
import { STORAGE_KEYS } from '../utils/constants'
import type { User } from '../types/api'

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const checkSession = useCallback(async () => {
    const token = localStorage.getItem(STORAGE_KEYS.token)
    if (!token) {
      setLoading(false)
      return
    }
    try {
      const userData = await authService.me()
      setUser(userData)
    } catch {
      localStorage.removeItem(STORAGE_KEYS.token)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    checkSession()
  }, [checkSession])

  const login = async (email: string, password: string) => {
    setError(null)
    const data = await authService.login(email, password)
    localStorage.setItem(STORAGE_KEYS.token, data.token)
    setUser(data.user)
    return data.user
  }

  const logout = async (): Promise<void> => {
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
