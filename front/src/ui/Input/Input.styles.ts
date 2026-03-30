import styled from 'styled-components'

export const Wrapper = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`

export const Label = styled.label<{ $dark?: boolean }>`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme, $dark }) => $dark ? theme.colors.adminText : theme.colors.textPrimary};
`

export const InputRow = styled.div<{ $hasError?: boolean; disabled?: boolean; $dark?: boolean }>`
  display: flex;
  align-items: center;
  border: 1.5px solid ${({ theme, $hasError, $dark }) =>
    $hasError ? theme.colors.accentRed : $dark ? theme.colors.adminBorder : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background: ${({ theme, disabled, $dark }) =>
    disabled
      ? ($dark ? 'rgba(255,255,255,0.04)' : theme.colors.surface)
      : ($dark ? 'rgba(255,255,255,0.06)' : theme.colors.background)};
  transition: border-color ${({ theme }) => theme.transitions.fast};

  &:focus-within {
    border-color: ${({ theme, $hasError, $dark }) =>
      $hasError ? theme.colors.accentRed : $dark ? 'rgba(255,255,255,0.3)' : theme.colors.textPrimary};
  }
`

export const StyledInput = styled.input<{ $dark?: boolean }>`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border: none;
  outline: none;
  background: transparent;
  font-size: ${({ theme }) => theme.typography.size.base};
  color: ${({ theme, $dark }) => $dark ? theme.colors.adminText : theme.colors.textPrimary};

  &::placeholder {
    color: ${({ theme, $dark }) => $dark ? theme.colors.adminTextMuted : theme.colors.textDisabled};
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

export const HelperText = styled.span<{ $hasError?: boolean }>`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme, $hasError }) => $hasError ? theme.colors.accentRed : theme.colors.textSecondary};
`
