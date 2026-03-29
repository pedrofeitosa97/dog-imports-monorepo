import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, Tag, LogOut, Menu, X } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import styled from 'styled-components'

const Shell = styled.div`
  display: flex;
  min-height: 100vh;
  background: ${({ theme }) => theme.colors.adminBg};
`

const Sidebar = styled.aside`
  width: ${({ collapsed }) => collapsed ? '64px' : '240px'};
  background: ${({ theme }) => theme.colors.adminSidebar};
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transition: width ${({ theme }) => theme.transitions.normal};
  overflow: hidden;
`

const SidebarTop = styled.div`
  padding: 20px 16px;
  display: flex;
  align-items: center;
  gap: 12px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
`

const SidebarLogo = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #fff;
  letter-spacing: 0.1em;
  white-space: nowrap;
  opacity: ${({ collapsed }) => collapsed ? 0 : 1};
  transition: opacity 200ms;
`

const CollapseBtn = styled.button`
  color: rgba(255,255,255,0.5);
  cursor: pointer;
  display: flex;
  flex-shrink: 0;
  &:hover { color: #fff; }
`

const Nav = styled.nav`
  flex: 1;
  padding: 16px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const NavItem = styled(NavLink)`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  border-radius: 8px;
  color: rgba(255,255,255,0.6);
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  white-space: nowrap;
  transition: all 150ms ease;

  &:hover { background: rgba(255,255,255,0.08); color: #fff; }
  &.active { background: ${({ theme }) => theme.colors.adminAccent}; color: #fff; }
`

const NavLabel = styled.span`
  opacity: ${({ collapsed }) => collapsed ? 0 : 1};
  transition: opacity 200ms;
`

const LogoutBtn = styled.button`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 12px;
  color: rgba(255,255,255,0.4);
  font-size: 14px;
  cursor: pointer;
  width: 100%;
  border-radius: 8px;
  margin: 8px;
  transition: all 150ms ease;
  white-space: nowrap;

  &:hover { background: rgba(255,0,0,0.1); color: #ff6b6b; }
`

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

const TopBar = styled.div`
  background: ${({ theme }) => theme.colors.adminSidebar};
  padding: 16px 32px;
  border-bottom: 1px solid rgba(255,255,255,0.08);
  display: flex;
  align-items: center;
  justify-content: space-between;
`

const PageTitle = styled.h1`
  font-size: 18px;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.adminText};
`

const Main = styled.main`
  flex: 1;
  padding: 32px;
  overflow-y: auto;
  color: ${({ theme }) => theme.colors.adminText};
`

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} />, end: true },
  { to: '/admin/produtos', label: 'Produtos', icon: <Package size={18} /> },
  { to: '/admin/categorias', label: 'Categorias', icon: <Tag size={18} /> },
]

export default function AdminLayout() {
  const [collapsed, setCollapsed] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/admin/login')
  }

  return (
    <Shell>
      <Sidebar collapsed={collapsed}>
        <SidebarTop>
          <CollapseBtn onClick={() => setCollapsed((v) => !v)}>
            {collapsed ? <Menu size={18} /> : <X size={18} />}
          </CollapseBtn>
          <SidebarLogo collapsed={collapsed}>DOG IMPORTS</SidebarLogo>
        </SidebarTop>
        <Nav>
          {navItems.map((item) => (
            <NavItem key={item.to} to={item.to} end={item.end}>
              {item.icon}
              <NavLabel collapsed={collapsed}>{item.label}</NavLabel>
            </NavItem>
          ))}
        </Nav>
        <LogoutBtn onClick={handleLogout}>
          <LogOut size={18} />
          <NavLabel collapsed={collapsed}>Sair</NavLabel>
        </LogoutBtn>
      </Sidebar>

      <Content>
        <TopBar>
          <PageTitle>Admin</PageTitle>
        </TopBar>
        <Main>
          <Outlet />
        </Main>
      </Content>
    </Shell>
  )
}
