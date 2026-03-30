import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing[1]};
  width: ${({ $fullWidth }) => ($fullWidth ? '100%' : 'auto')};
`

export const Label = styled.label`
  font-size: ${({ theme }) => theme.typography.size.sm};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme, $dark }) => $dark ? theme.colors.adminText : theme.colors.textPrimary};
`

export const SelectWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  border: 1.5px solid ${({ theme, $hasError, $dark }) =>
    $hasError ? theme.colors.accentRed : $dark ? theme.colors.adminBorder : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  background: ${({ theme, disabled, $dark }) =>
    disabled
      ? ($dark ? 'rgba(255,255,255,0.04)' : theme.colors.surface)
      : ($dark ? 'rgba(255,255,255,0.06)' : theme.colors.background)};
  opacity: ${({ disabled }) => disabled ? 0.6 : 1};
`

export const StyledSelect = styled.select`
  flex: 1;
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  padding-right: ${({ theme }) => theme.spacing[10]};
  border: none;
  outline: none;
  background: transparent;
  appearance: none;
  font-size: ${({ theme }) => theme.typography.size.base};
  color: ${({ theme, $dark }) => $dark ? theme.colors.adminText : theme.colors.textPrimary};
  cursor: pointer;

  option {
    background: ${({ theme, $dark }) => $dark ? theme.colors.adminSidebar : theme.colors.background};
    color: ${({ theme, $dark }) => $dark ? theme.colors.adminText : theme.colors.textPrimary};
  }

  &:disabled {
    cursor: not-allowed;
  }
`

export const ChevronIcon = styled.span`
  position: absolute;
  right: ${({ theme }) => theme.spacing[3]};
  color: ${({ theme, $dark }) => $dark ? theme.colors.adminTextMuted : theme.colors.textSecondary};
  pointer-events: none;
  display: flex;
  align-items: center;
`

export const HelperText = styled.span`
  font-size: ${({ theme }) => theme.typography.size.xs};
  color: ${({ theme }) => theme.colors.accentRed};
`
