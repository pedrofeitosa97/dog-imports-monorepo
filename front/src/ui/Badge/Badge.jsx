import { StyledBadge } from './Badge.styles'

export default function Badge({ children, variant = 'green', size = 'md' }) {
  return (
    <StyledBadge $variant={variant} $size={size}>
      {children}
    </StyledBadge>
  )
}
