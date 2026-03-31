import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingBag, Heart, Search, Menu, X, Sun, Moon } from 'lucide-react'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { useThemeContext } from '../../hooks/useTheme'
import { useSiteSettings } from '../../hooks/useSiteSettings'
import { useAuth } from '../../hooks/useAuth'
import SearchOverlay from '../SearchOverlay/SearchOverlay'
import {
  HeaderWrapper, TopBar, TopBarLink, MainHeader, Logo, Nav, NavItem,
  IconsGroup, IconBtn, ThemeToggle, CountBadge, MobileMenu, MobileOverlay,
  MobileNav, MobileNavItem, Hamburger,
} from './Header.styles'

interface NavLinkDef {
  label: string
  to: string
}

const navLinks: NavLinkDef[] = [
  { label: 'Novidades', to: '/produtos?sortBy=newest' },
  { label: 'Masculino', to: '/produtos?gender=masculino' },
  { label: 'Feminino', to: '/produtos?gender=feminino' },
  { label: 'Marcas', to: '/produtos' },
  { label: 'Promoções', to: '/produtos?discount=true' },
]

function useIsActive() {
  const location = useLocation()
  return (to: string): boolean => {
    const [toPart, toSearch = ''] = to.split('?')
    const currentSearch = location.search.replace(/^\?/, '')
    if (toPart !== location.pathname) return false
    // Link sem query → ativo só se a página também não tiver query
    if (!toSearch) return !currentSearch
    // Link com query → deve bater exatamente
    return currentSearch === toSearch
  }
}

interface HeaderProps {
  transparent?: boolean
}

export default function Header({ transparent = false }: HeaderProps) {
  const scrollY = useScrollPosition()
  const { totalItems, openCart } = useCart()
  const { items: wishItems } = useWishlist()
  const themeCtx = useThemeContext()
  const isDark = themeCtx?.isDark ?? true
  const toggleTheme = themeCtx?.toggleTheme ?? (() => undefined)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const isActive = useIsActive()
  const { settings, loaded: settingsLoaded } = useSiteSettings()
  const headerLogo = settingsLoaded ? (settings.logo_header || '/logo.png') : null
  const { user } = useAuth()

  const scrolled = scrollY > 60
  const isTransparent = transparent && !scrolled && !mobileOpen

  return (
    <>
      <HeaderWrapper $scrolled={scrolled} $transparent={isTransparent}>
        <TopBar>
          <TopBarLink as={Link} to="/guia-de-tamanhos">Guia de tamanhos</TopBarLink>
          <TopBarLink as={Link} to="/produtos">Lançamentos</TopBarLink>
          {user
            ? <TopBarLink as={Link} to="/admin">Dashboard</TopBarLink>
            : <TopBarLink as={Link} to="/admin/login">Admin</TopBarLink>
          }
        </TopBar>

        <MainHeader>
          <Hamburger onClick={() => setMobileOpen(true)} $transparent={isTransparent}>
            <Menu size={22} />
          </Hamburger>

          <Logo as={Link} to="/">
            {headerLogo && <img src={headerLogo} alt="Dog Imports" height="140" />}
          </Logo>

          <Nav>
            {navLinks.map((link) => (
              <NavItem as={Link} to={link.to} key={link.label} $transparent={isTransparent} $active={isActive(link.to)}>
                {link.label}
              </NavItem>
            ))}
          </Nav>

          <IconsGroup>
            <IconBtn $transparent={isTransparent} onClick={() => setSearchOpen(true)} aria-label="Buscar">
              <Search size={20} />
            </IconBtn>

            <IconBtn as={Link} to="/favoritos" $transparent={isTransparent} style={{ position: 'relative' }}>
              <Heart size={20} />
              {wishItems.length > 0 && <CountBadge>{wishItems.length}</CountBadge>}
            </IconBtn>

            <IconBtn $transparent={isTransparent} onClick={openCart} style={{ position: 'relative' }}>
              <ShoppingBag size={20} />
              {totalItems > 0 && <CountBadge>{totalItems}</CountBadge>}
            </IconBtn>

            <ThemeToggle onClick={toggleTheme} $transparent={isTransparent} aria-label="Alternar tema">
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </ThemeToggle>
          </IconsGroup>
        </MainHeader>
      </HeaderWrapper>

      {searchOpen && <SearchOverlay onClose={() => setSearchOpen(false)} />}

      {mobileOpen && <MobileOverlay onClick={() => setMobileOpen(false)} />}
      <MobileMenu $isOpen={mobileOpen}>
        <Hamburger onClick={() => setMobileOpen(false)} style={{ alignSelf: 'flex-end', marginBottom: '24px' }}>
          <X size={22} />
        </Hamburger>
        <MobileNav>
          {navLinks.map((link) => (
            <MobileNavItem as={Link} to={link.to} key={link.label} $active={isActive(link.to)} onClick={() => setMobileOpen(false)}>
              {link.label}
            </MobileNavItem>
          ))}
        </MobileNav>
        <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
          <ThemeToggle onClick={toggleTheme} style={{ gap: '10px', width: '100%', justifyContent: 'flex-start', padding: '12px 0' }}>
            {isDark ? <><Sun size={18} /> Modo claro</> : <><Moon size={18} /> Modo escuro</>}
          </ThemeToggle>
        </div>
      </MobileMenu>
    </>
  )
}
