import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
`

export const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`

export const InputRow = styled.div`
  display: flex;
  align-items: center;
  border: 1.5px solid ${({ theme, hasError }) => hasError ? theme.colors.accentRed : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background: ${({ theme, disabled }) => disabled ? theme.colors.surface : theme.colors.background};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus-within {
    border-color: ${({ theme, hasError }) => hasError ? theme.colors.accentRed : theme.colors.textPrimary};
  }
`

export const StyledInput = styled.input`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: none;
  outline: none;
  background: transparent;
  font-size: ${({ theme }) => theme.typography.size.base};
  color: ${({ theme }) => theme.colors.textPrimary};

  &::placeholder {
    color: ${({ theme }) => theme.colors.textDisabled};
  }

  &:disabled {
    cursor: not-allowed;
    color: ${({ theme }) => theme.colors.textDisabled};
  }
`

export const Prefix = styled.span`
  padding-left: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
`

export const Suffix = styled.span`
  padding-right: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme }) => theme.colors.textSecondary};
  font-size: ${({ theme }) => theme.typography.size.sm};
`

export const HelperText = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme, hasError }) => hasError ? theme.colors.accentRed : theme.colors.textSecondary};
`
