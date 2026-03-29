import styled from 'styled-components'

export const HeaderWrapper = styled.header`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  background: ${({ theme, transparent }) => transparent ? 'transparent' : theme.colors.background};
  box-shadow: ${({ theme, scrolled }) => scrolled ? theme.shadows.base : 'none'};
  transition: all ${({ theme }) => theme.transitions.normal};
`

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[4]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[8]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};
`

export const TopBarLink = styled.a`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
    text-decoration: underline;
  }
`

export const MainHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
  padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[8]}`};
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
`

export const Logo = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;

  img {
    height: 48px;
    width: auto;
    display: block;
  }
`

export const Nav = styled.nav`
  display: none;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
  flex: 1;
  justify-content: center;

  @media (min-width: 1024px) {
    display: flex;
  }
`

export const NavItem = styled.a`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme, transparent }) => transparent ? '#fff' : theme.colors.textPrimary};
  text-decoration: none;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  white-space: nowrap;
  padding-bottom: 2px;
  border-bottom: 2px solid transparent;
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:hover,
  &.active {
    border-bottom-color: currentColor;
  }
`

export const IconsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  margin-left: auto;
`

export const IconBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme, transparent }) => transparent ? '#fff' : theme.colors.textPrimary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[1]};
  transition: opacity ${({ theme }) => theme.transitions.fast};

  &:hover {
    opacity: 0.7;
  }
`

export const CountBadge = styled.span`
  position: absolute;
  top: -6px;
  right: -6px;
  min-width: 18px;
  height: 18px;
  background: ${({ theme }) => theme.colors.brand};
  color: #fff;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 4px;
`

export const Hamburger = styled.button`
  display: flex;
  align-items: center;
  color: ${({ theme, transparent }) => transparent ? '#fff' : theme.colors.textPrimary};
  cursor: pointer;

  @media (min-width: 1024px) {
    display: none;
  }
`

export const MobileOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: ${({ theme }) => theme.zIndex.overlay};
`

export const MobileMenu = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: ${({ theme }) => theme.colors.background};
  z-index: ${({ theme }) => theme.zIndex.modal};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  transform: ${({ isOpen }) => isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform ${({ theme }) => theme.transitions.normal};
  box-shadow: ${({ theme }) => theme.shadows.xl};
`

export const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
`

export const MobileNavItem = styled.a`
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
  text-decoration: none;
  padding: ${({ theme }) => `${theme.spacing[3]} 0`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};

  &:hover {
    color: ${({ theme }) => theme.colors.textSecondary};
  }
`
