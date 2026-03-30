import styled, { css } from 'styled-components'

type BadgeVariant = 'green' | 'red' | 'gold' | 'gray' | 'dark'
type BadgeSize = 'sm' | 'md'

const variants: Record<BadgeVariant, ReturnType<typeof css>> = {
  green: css`
    background: ${({ theme }) => theme.colors.accentGreen};
    color: #fff;
  `,
  red: css`
    background: ${({ theme }) => theme.colors.accentRed};
    color: #fff;
  `,
  gold: css`
    background: ${({ theme }) => theme.colors.accentGold};
    color: #fff;
  `,
  gray: css`
    background: ${({ theme }) => theme.colors.surface};
    color: ${({ theme }) => theme.colors.textSecondary};
    border: 1px solid ${({ theme }) => theme.colors.border};
  `,
  dark: css`
    background: ${({ theme }) => theme.colors.textPrimary};
    color: #fff;
  `,
}

const sizes: Record<BadgeSize, ReturnType<typeof css>> = {
  sm: css`
    font-size: ${({ theme }) => theme.typography.size.xs};
    padding: 2px 6px;
  `,
  md: css`
    font-size: ${({ theme }) => theme.typography.size.sm};
    padding: 3px 8px;
  `,
}

export const StyledBadge = styled.span<{ $variant?: BadgeVariant; $size?: BadgeSize }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  font-weight: ${({ theme }) => theme.typography.weight.semibold};
  white-space: nowrap;
  ${({ $variant = 'green' }) => variants[$variant]}
  ${({ $size = 'md' }) => sizes[$size]}
`
