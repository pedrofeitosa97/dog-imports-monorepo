import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[2]};
`

export const Label = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`

export const SwatchList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing[2]};
`

export const Swatch = styled.button<{ hex: string; selected?: boolean; available?: boolean }>`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ hex }) => hex};
  border: 2px solid ${({ theme, selected }) => selected ? theme.colors.brand : 'transparent'};
  outline: ${({ selected }) => selected ? '2px solid #fff' : 'none'};
  outline-offset: -4px;
  cursor: ${({ available }) => available ? 'pointer' : 'not-allowed'};
  opacity: ${({ available }) => available ? 1 : 0.35};
  transition: transform ${({ theme }) => theme.transitions.fast};
  box-shadow: ${({ theme }) => theme.shadows.sm};

  &:hover:not(:disabled) {
    transform: scale(1.15);
  }
`
