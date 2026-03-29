import styled, { css } from 'styled-components'

const variants = {
  primary: css`
    background: ${({ theme }) => theme.colors.brand};
    color: ${({ theme }) => theme.colors.textInverse};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.brandHover};
    }
  `,
  secondary: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textPrimary};
    border: 1.5px solid ${({ theme }) => theme.colors.textPrimary};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surface};
    }
  `,
  ghost: css`
    background: transparent;
    color: ${({ theme }) => theme.colors.textPrimary};
    &:hover:not(:disabled) {
      background: ${({ theme }) => theme.colors.surface};
    }
  `,
  danger: css`
    background: ${({ theme }) => theme.colors.accentRed};
    color: ${({ theme }) => theme.colors.textInverse};
    &:hover:not(:disabled) {
      background: #c62828;
    }
  `,
}

const sizes = {
  sm: css`
    padding: ${({ theme }) => `${theme.spacing[2]} ${theme.spacing[3]}`};
    font-size: ${({ theme }) => theme.typography.size.sm};
    height: 32px;
  `,
  md: css`
    padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[6]}`};
    font-size: ${({ theme }) => theme.typography.size.base};
    height: 44px;
  `,
  lg: css`
    padding: ${({ theme }) => `${theme.spacing[4]} ${theme.spacing[8]}`};
    font-size: ${({ theme }) => theme.typography.size.md};
    height: 52px;
  `,
}

export const StyledButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing[2]};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  border-radius: ${({ theme }) => theme.borderRadius.base};
  border: none;
  cursor: pointer;
  transition: all ${({ theme }) => theme.transitions.fast};
  white-space: nowrap;
  text-decoration: none;
  width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
  letter-spacing: ${({ theme }) => theme.typography.letterSpacing.wide};
  text-transform: uppercase;

  ${({ variant = 'primary' }) => variants[variant]}
  ${({ size = 'md' }) => sizes[size]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.brand};
    outline-offset: 2px;
  }
`
