import { useContext } from 'react'
import { ThemeContext } from '../contexts/theme.context'
import type { ThemeContextValue } from '../contexts/theme.context'

export function useThemeContext(): ThemeContextValue | null {
  return useContext(ThemeContext)
}
