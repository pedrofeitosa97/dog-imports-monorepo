import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`

export const Label = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`

export const SizesGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`

export const SizeOption = styled.button`
  min-width: 44px;
  height: 44px;
  padding: 0 ${({ theme }) => theme.spacing[2]};
  border: 1.5px solid ${({ theme, selected }) => selected ? theme.colors.brand : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background: ${({ theme, selected }) => selected ? theme.colors.brand : 'transparent'};
  color: ${({ theme, selected }) => selected ? theme.colors.textInverse : theme.colors.textPrimary};
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  cursor: ${({ available }) => available ? 'pointer' : 'not-allowed'};
  opacity: ${({ available }) => available ? 1 : 0.35};
  transition: all ${({ theme }) => theme.transitions.fast};
  text-decoration: ${({ available }) => available ? 'none' : 'line-through'};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.brand};
  }
`
