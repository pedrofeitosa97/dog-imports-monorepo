import styled from 'styled-components'

export const PaginationWrapper = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[1]};
`

const base = `
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 150ms ease;
`

export const PageButton = styled.button<{ active?: boolean }>`
  ${base}
  background: ${({ theme, active }) => active ? theme.colors.brand : 'transparent'};
  color: ${({ theme, active }) => active ? theme.colors.textInverse : theme.colors.textPrimary};
  border: 1px solid ${({ theme, active }) => active ? theme.colors.brand : theme.colors.border};

  &:hover:not(:disabled) {
    background: ${({ theme, active }) => active ? theme.colors.brandHover : theme.colors.surface};
  }
`

export const NavButton = styled.button`
  ${base}
  background: transparent;
  color: ${({ theme }) => theme.colors.textSecondary};
  border: 1px solid ${({ theme }) => theme.colors.border};

  &:hover:not(:disabled) {
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textPrimary};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

export const Ellipsis = styled.span`
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
`
