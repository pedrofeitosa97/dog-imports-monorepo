import { type ReactNode } from 'react'
import { StyledBadge } from './Badge.styles'

interface BadgeProps {
  children: ReactNode
  variant?: 'green' | 'red' | 'gold' | 'gray' | 'dark'
  size?: 'sm' | 'md'
}

export default function Badge({ children, variant = 'green', size = 'md' }: BadgeProps) {
  return (
    <StyledBadge $variant={variant} $size={size}>
      {children}
    </StyledBadge>
  )
}
