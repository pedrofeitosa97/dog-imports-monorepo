import { useContext } from 'react'
import { ThemeContext } from '../contexts/theme.context'

export function useThemeContext() {
  return useContext(ThemeContext)
}
