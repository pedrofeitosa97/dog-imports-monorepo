import styled from 'styled-components'

export const SidebarWrapper = styled.aside`
  width: 280px;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`

export const SidebarHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: ${({ theme }) => theme.spacing[3]};
  border-bottom: 2px solid ${({ theme }) => theme.colors.textPrimary};
`

export const Title = styled.h3`
  font-size: ${({ theme }) => theme.typography.size.md};
  font-weight: ${({ theme }) => theme.typography.weight.bold};
  color: ${({ theme }) => theme.colors.textPrimary};
`

export const ClearBtn = styled.button`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  text-decoration: underline;
  cursor: pointer;
  background: none;
  border: none;

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`

export const Count = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textSecondary};
  padding-top: ${({ theme }) => theme.spacing[1]};
`
