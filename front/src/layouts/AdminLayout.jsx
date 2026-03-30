import { Outlet, NavLink, useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, Package, Tag, LogOut, Menu, X, ChevronLeft } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import styled from 'styled-components'

/* ─── tokens ─────────────────────────────────────────────── */
const BG       = '#0d0d0f'
const SURFACE  = '#141416'
const BORDER   = 'rgba(255,255,255,0.07)'
const TEXT     = '#f5f5f7'
const MUTED    = 'rgba(255,255,255,0.45)'

/* ─── shell ──────────────────────────────────────────────── */
const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${BG};
  font-family: 'Manrope', sans-serif;
`

/* ─── overlay (mobile) ───────────────────────────────────── */
const Overlay = styled.div`
  display: none;
  @media (max-width: 1023px) {
    display: ${({ $open }) => $open ? 'block' : 'none'};
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(4px);
    z-index: 40;
  }
`

/* ─── sidebar ────────────────────────────────────────────── */
const Sidebar = styled.aside`
  width: ${({ $collapsed }) => $collapsed ? '68px' : '220px'};
  background: ${SURFACE};
  border-right: 1px solid ${BORDER};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width 220ms cubic-bezier(.4,0,.2,1);
  overflow: hidden;
  position: relative;
  z-index: 50;

  @media (max-width: 1023px) {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    width: 240px;
    transform: ${({ $mobileOpen }) => $mobileOpen ? 'translateX(0)' : 'translateX(-100%)'};
    transition: transform 280ms cubic-bezier(.4,0,.2,1);
    z-index: 50;
  }
`

const SidebarTop = styled.div`
  height: 60px;
  padding: 0 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid ${BORDER};
  flex-shrink: 0;
`

const LogoMark = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  min-width: 0;
`

const LogoImg = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 8px;
  flex-shrink: 0;
  object-fit: cover;
`

const LogoText = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${TEXT};
  letter-spacing: 0.06em;
  white-space: nowrap;
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  transition: opacity 180ms;
  overflow: hidden;
`

const CollapseBtn = styled.button`
  flex-shrink: 0;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${MUTED};
  transition: all 150ms;
  &:hover { background: rgba(255,255,255,0.06); color: ${TEXT}; }

  @media (max-width: 1023px) { display: none; }
`

const MobileClose = styled.button`
  display: none;
  @media (max-width: 1023px) {
    display: flex;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    align-items: center;
    justify-content: center;
    color: ${MUTED};
    &:hover { color: ${TEXT}; }
  }
`

const Nav = styled.nav`
  flex: 1;
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow-y: auto;
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  border-radius: 8px;
  color: ${MUTED};
  text-decoration: none;
  font-size: 13.5px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 150ms ease;
  min-width: 0;

  svg { flex-shrink: 0; }

  &:hover { background: rgba(255,255,255,0.05); color: ${TEXT}; }
  &.active { background: rgba(37,99,235,0.18); color: #60a5fa; }

  @media (max-width: 1023px) {
    padding: 11px 12px;
    font-size: 14px;
  }
`

const NavLabel = styled.span`
  opacity: ${({ $collapsed }) => $collapsed ? 0 : 1};
  transition: opacity 180ms;
  overflow: hidden;
  white-space: nowrap;

  @media (max-width: 1023px) { opacity: 1; }
`

const SidebarBottom = styled.div`
  padding: 8px;
  border-top: 1px solid ${BORDER};
`

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 10px;
  width: 100%;
  border-radius: 8px;
  color: ${MUTED};
  font-size: 13.5px;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms;
  white-space: nowrap;

  &:hover { background: rgba(239,68,68,0.1); color: #f87171; }
`

/* ─── content ────────────────────────────────────────────── */
const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  overflow: hidden;
`

const TopBar = styled.div`
  height: 60px;
  padding: 0 24px;
  background: ${SURFACE};
  border-bottom: 1px solid ${BORDER};
  display: flex;
  align-items: center;
  gap: 16px;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  z-index: 20;
`

const HamburgerBtn = styled.button`
  display: none;
  @media (max-width: 1023px) {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 8px;
    color: ${MUTED};
    &:hover { background: rgba(255,255,255,0.06); color: ${TEXT}; }
  }
`

const PageTitle = styled.h1`
  font-size: 16px;
  font-weight: 600;
  color: ${TEXT};
  flex: 1;
`

const Main = styled.main`
  flex: 1;
  padding: 28px 28px 40px;
  overflow-y: auto;
  color: ${TEXT};

  @media (max-width: 640px) {
    padding: 20px 16px 32px;
  }
`

/* ─── nav config ─────────────────────────────────────────── */
const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={17} />, end: true },
  { to: '/admin/produtos', label: 'Produtos', icon: <Package size={17} /> },
  { to: '/admin/categorias', label: 'Categorias', icon: <Tag size={17} /> },
]

const pageTitles = {
  '/admin': 'Dashboard',
  '/admin/produtos': 'Produtos',
  '/admin/produtos/novo': 'Novo produto',
  '/admin/categorias': 'Categorias',
}

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  // fecha sidebar mobile ao navegar
  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  const title = Object.entries(pageTitles)
    .sort((a, b) => b[0].length - a[0].length)
    .find(([path]) => location.pathname.startsWith(path))?.[1] ?? 'Admin'

  return (
    <Shell>
      <Overlay $open={mobileOpen} onClick={() => setMobileOpen(false)} />

      <Sidebar $collapsed={collapsed} $mobileOpen={mobileOpen}>
        <SidebarTop>
          <LogoMark>
            <LogoImg src="/logo.png" alt="Dog Imports" />
            <LogoText $collapsed={collapsed}>DOG IMPORTS</LogoText>
          </LogoMark>
          <CollapseBtn onClick={() => setCollapsed(v => !v)} title={collapsed ? 'Expandir' : 'Recolher'}>
            <ChevronLeft size={16} style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 220ms' }} />
          </CollapseBtn>
          <MobileClose onClick={() => setMobileOpen(false)}>
            <X size={18} />
          </MobileClose>
        </SidebarTop>

        <Nav>
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} end={item.end}>
              {item.icon}
              <NavLabel $collapsed={collapsed}>{item.label}</NavLabel>
            </NavItem>
          ))}
        </Nav>

        <SidebarBottom>
          <LogoutBtn onClick={handleLogout}>
            <LogOut size={17} />
            <NavLabel $collapsed={collapsed}>Sair</NavLabel>
          </LogoutBtn>
        </SidebarBottom>
      </Sidebar>

      <Content>
        <TopBar>
          <HamburgerBtn onClick={() => setMobileOpen(true)}>
            <Menu size={20} />
          </HamburgerBtn>
          <PageTitle>{title}</PageTitle>
        </TopBar>
        <Main>
          <Outlet />
        </Main>
      </Content>
    </Shell>
  )
}
