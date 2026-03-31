import styled from 'styled-components'

export const HeaderWrapper = styled.header<{ $scrolled?: boolean; $transparent?: boolean }>`
  position: sticky;
  top: 0;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  background: ${({ theme, $transparent }) => $transparent ? 'transparent' : theme.colors.headerBg};
  backdrop-filter: ${({ $transparent }) => $transparent ? 'none' : 'blur(20px)'};
  -webkit-backdrop-filter: ${({ $transparent }) => $transparent ? 'none' : 'blur(20px)'};
  border-bottom: 1px solid ${({ theme, $transparent }) => $transparent ? 'transparent' : theme.colors.headerBorder};
  box-shadow: ${({ theme, $scrolled, $transparent }) => ($scrolled && !$transparent) ? theme.shadows.base : 'none'};
  transition: background ${({ theme }) => theme.transitions.normal},
              box-shadow ${({ theme }) => theme.transitions.normal},
              border-color ${({ theme }) => theme.transitions.normal};
`

export const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing[5]};
  padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[8]}`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  background: ${({ theme }) => theme.colors.surface};

  @media (max-width: 768px) {
    display: none;
  }
`

export const TopBarLink = styled.a`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: none;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

export const MainHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[6]};
  padding: 0 ${({ theme }) => theme.spacing[8]};
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;

  @media (max-width: 768px) {
    padding: 0 ${({ theme }) => theme.spacing[4]};
  }
`

export const Logo = styled.a`
  display: flex;
  align-items: center;
  text-decoration: none;
  flex-shrink: 0;

  img {
    height: 200px;
    width: 200px;
    object-fit: contain;
    display: block;

    @media (max-width: 768px) {
      height: 64px;
      width: 64px;
    }
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

export const NavItem = styled.a<{ $transparent?: boolean; $active?: boolean }>`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme, $transparent, $active }) =>
    $active
      ? ($transparent ? '#fff' : theme.colors.brand)
      : ($transparent ? 'rgba(255,255,255,0.9)' : theme.colors.textPrimary)};
  text-decoration: none;
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  white-space: nowrap;
  padding-bottom: 2px;
  border-bottom: 2px solid ${({ theme, $active }) => $active ? theme.colors.brand : 'transparent'};
  transition: color ${({ theme }) => theme.transitions.fast},
              border-color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme, $transparent }) => $transparent ? '#fff' : theme.colors.brand};
    border-bottom-color: ${({ theme }) => theme.colors.brand};
  }
`

export const IconsGroup = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
  margin-left: auto;
`

export const IconBtn = styled.button<{ $transparent?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme, $transparent }) => $transparent ? 'rgba(255,255,255,0.85)' : theme.colors.textPrimary};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast},
              color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.brand};
  }
`

export const ThemeToggle = styled.button<{ $transparent?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme, $transparent }) => $transparent ? 'rgba(255,255,255,0.85)' : theme.colors.textSecondary};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast},
              color ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.brand};
  }
`

export const CountBadge = styled.span`
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 17px;
  height: 17px;
  background: ${({ theme }) => theme.colors.brand};
  color: #fff;
  border-radius: ${({ theme }) => theme.borderRadius.full};
  font-size: 10px;
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 3px;
`

export const Hamburger = styled.button<{ $transparent?: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 38px;
  height: 38px;
  border-radius: ${({ theme }) => theme.borderRadius.md};
  color: ${({ theme, $transparent }) => $transparent ? 'rgba(255,255,255,0.85)' : theme.colors.textPrimary};
  cursor: pointer;
  transition: background ${({ theme }) => theme.transitions.fast};

  &:hover {
    background: ${({ theme }) => theme.colors.surface};
  }

  @media (min-width: 1024px) {
    display: none;
  }
`

export const MobileOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  backdrop-filter: blur(4px);
  z-index: ${({ theme }) => theme.zIndex.overlay};
`

export const MobileMenu = styled.div<{ $isOpen: boolean }>`
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 300px;
  background: ${({ theme }) => theme.colors.mobileMenuBg};
  z-index: ${({ theme }) => theme.zIndex.modal};
  padding: ${({ theme }) => theme.spacing[6]};
  display: flex;
  flex-direction: column;
  transform: ${({ $isOpen }) => $isOpen ? 'translateX(0)' : 'translateX(-100%)'};
  transition: transform ${({ theme }) => theme.transitions.normal};
  box-shadow: ${({ theme }) => theme.shadows.xl};
  border-right: 1px solid ${({ theme }) => theme.colors.border};
`

export const MobileNav = styled.nav`
  display: flex;
  flex-direction: column;
`

export const MobileNavItem = styled.a<{ $active?: boolean }>`
  font-size: ${({ theme }) => theme.typography.size.base};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme, $active }) => $active ? theme.colors.brand : theme.colors.textPrimary};
  text-decoration: none;
  padding: ${({ theme }) => `${theme.spacing[4]} 0`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  transition: color ${({ theme }) => theme.transitions.fast};

  &:hover {
    color: ${({ theme }) => theme.colors.brand};
  }
`
