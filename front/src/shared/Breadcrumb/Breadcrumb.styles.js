import styled from 'styled-components'

export const BreadcrumbWrapper = styled.nav`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[1]};
`

export const BreadcrumbItem = styled.a`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme, current }) => current ? theme.colors.textPrimary : theme.colors.textSecondary};
  text-decoration: none;
  font-weight: ${({ theme, current }) => current ? theme.typography.weight.medium : theme.typography.weight.regular};

  &:hover {
    text-decoration: ${({ current }) => current ? 'none' : 'underline'};
  }
`

export const Separator = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
`
