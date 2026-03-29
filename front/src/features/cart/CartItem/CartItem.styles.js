import styled from 'styled-components'

export const ItemWrapper = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[4]} 0`};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const ItemImage = styled.img`
  width: 80px;
  height: 100px;
  object-fit: cover;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background: ${({ theme }) => theme.colors.surface};
  flex-shrink: 0;
`

export const ItemInfo = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`

export const ItemName = styled.p`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  line-height: 1.3;
`

export const ItemMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.textSecondary};
`

export const QuantityRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  margin-top: auto;
`

export const QtyButton = styled.button`
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};

  &:hover:not(:disabled) {
    border-color: ${({ theme }) => theme.colors.brand};
  }

  &:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
`

export const QtyValue = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  min-width: 20px;
  text-align: center;
`

export const ItemPrice = styled.p`
  font-size: ${({ theme }) => theme.typography.size.base};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  text-align: right;
  white-space: nowrap;
`

export const RemoveBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  margin-top: ${({ theme }) => theme.spacing[2]};
  float: right;

  &:hover {
    color: ${({ theme }) => theme.colors.accentRed};
  }
`
