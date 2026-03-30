import { ThemeProvider } from 'styled-components'
import { GlobalStyles } from './styles/GlobalStyles'
import { ThemeContextProvider } from './contexts/ThemeContext'
import { useThemeContext } from './hooks/useTheme'
import { AuthProvider } from './contexts/AuthContext'
import { CartProvider } from './contexts/CartContext'
import { WishlistProvider } from './contexts/WishlistContext'
import AppRoutes from './routes/index'
import { darkTheme } from './styles/theme'

function ThemedApp() {
  const ctx = useThemeContext()
  const activeTheme = ctx?.activeTheme ?? darkTheme
  return (
    <ThemeProvider theme={activeTheme}>
      <GlobalStyles />
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <AppRoutes />
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <ThemeContextProvider>
      <ThemedApp />
    </ThemeContextProvider>
  )
}
