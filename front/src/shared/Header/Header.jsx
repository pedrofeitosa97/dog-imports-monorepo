import { Link, NavLink } from 'react-router-dom'
import { ShoppingBag, Heart, Search, Menu, X, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '../../hooks/useCart'
import { useWishlist } from '../../hooks/useWishlist'
import { useScrollPosition } from '../../hooks/useScrollPosition'
import { useThemeContext } from '../../contexts/ThemeContext'
import {
  HeaderWrapper,
  TopBar,
  TopBarLink,
  MainHeader,
  Logo,
  Nav,
  NavItem,
  IconsGroup,
  IconBtn,
  ThemeToggle,
  CountBadge,
  MobileMenu,
  MobileOverlay,
  MobileNav,
  MobileNavItem,
  Hamburger,
} from './Header.styles'

const navLinks = [
  { label: 'Novidades', to: '/produtos?sortBy=newest' },
  { label: 'Masculino', to: '/categorias/masculino' },
  { label: 'Feminino', to: '/categorias/feminino' },
  { label: 'Marcas', to: '/produtos' },
  { label: 'Promoções', to: '/produtos?discount=true' },
]

export default function Header({ transparent = false }) {
  const scrollY = useScrollPosition()
  const { totalItems, openCart } = useCart()
  const { items: wishItems } = useWishlist()
  const { isDark, toggleTheme } = useThemeContext()
  const [mobileOpen, setMobileOpen] = useState(false)

  const scrolled = scrollY > 60
  const isTransparent = transparent && !scrolled && !mobileOpen

  return (
    <>
      <HeaderWrapper $scrolled={scrolled} $transparent={isTransparent}>
        <TopBar>
          <TopBarLink as={Link} to="/produtos">Guia de tamanhos</TopBarLink>
          <TopBarLink as={Link} to="/produtos">Lançamentos</TopBarLink>
          <TopBarLink as={Link} to="/admin/login">Admin</TopBarLink>
        </TopBar>

        <MainHeader>
          <Hamburger onClick={() => setMobileOpen(true)} $transparent={isTransparent}>
            <Menu size={22} />
          </Hamburger>

          <Logo as={Link} to="/">
            <img src="/logo.png" alt="Dog Imports" height="44" />
          </Logo>

          <Nav>
            {navLinks.map((link) => (
              <NavItem as={NavLink} to={link.to} key={link.label} $transparent={isTransparent}>
                {link.label}
              </NavItem>
            ))}
          </Nav>

          <IconsGroup>
            <IconBtn $transparent={isTransparent}>
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

      {mobileOpen && <MobileOverlay onClick={() => setMobileOpen(false)} />}
      <MobileMenu $isOpen={mobileOpen}>
        <Hamburger onClick={() => setMobileOpen(false)} style={{ alignSelf: 'flex-end', marginBottom: '24px' }}>
          <X size={22} />
        </Hamburger>
        <MobileNav>
          {navLinks.map((link) => (
            <MobileNavItem as={NavLink} to={link.to} key={link.label} onClick={() => setMobileOpen(false)}>
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
