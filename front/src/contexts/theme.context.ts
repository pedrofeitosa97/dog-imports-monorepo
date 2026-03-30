import { createContext } from 'react'
import type { Theme } from '../styles/theme'

export type AppTheme = Theme

export interface ThemeContextValue {
  isDark: boolean
  toggleTheme: () => void
  activeTheme: AppTheme
}

export const ThemeContext = createContext<ThemeContextValue | null>(null)
