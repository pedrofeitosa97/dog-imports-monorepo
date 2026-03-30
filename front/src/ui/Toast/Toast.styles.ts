import styled, { css } from 'styled-components'

type ToastVariant = 'success' | 'error' | 'warning' | 'info'

const variantStyles: Record<ToastVariant, ReturnType<typeof css>> = {
  success: css`
    background: #f0fdf4;
    border-left: 4px solid ${({ theme }) => theme.colors.accentGreen};
  `,
  error: css`
    background: #fff5f5;
    border-left: 4px solid ${({ theme }) => theme.colors.accentRed};
  `,
  warning: css`
    background: #fffbeb;
    border-left: 4px solid ${({ theme }) => theme.colors.accentGold};
  `,
  info: css`
    background: #eff6ff;
    border-left: 4px solid #3b82f6;
  `,
}

const iconColors: Record<ToastVariant, ReturnType<typeof css>> = {
  success: css`color: ${({ theme }) => theme.colors.accentGreen};`,
  error: css`color: ${({ theme }) => theme.colors.accentRed};`,
  warning: css`color: ${({ theme }) => theme.colors.accentGold};`,
  info: css`color: #3b82f6;`,
}

export const ToastWrapper = styled.div<{ variant?: ToastVariant }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[3]};
  padding: ${({ theme }) => `${theme.spacing[3]} ${theme.spacing[4]}`};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  box-shadow: ${({ theme }) => theme.shadows.md};
  min-width: 280px;
  max-width: 420px;
  ${({ variant = 'info' }) => variantStyles[variant]}
`

export const ToastIcon = styled.span<{ variant?: ToastVariant }>`
  flex-shrink: 0;
  display: flex;
  ${({ variant = 'info' }) => iconColors[variant]}
`

export const ToastMessage = styled.p`
  flex: 1;
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
`

export const ToastClose = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.textSecondary};
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing[1]};

  &:hover {
    color: ${({ theme }) => theme.colors.textPrimary};
  }
`
