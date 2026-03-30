import { StyledButton } from './Button.styles'
import Spinner from '../Spinner/Spinner'

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  as,
  to,
  ...props
}) {
  return (
    <StyledButton
      as={as}
      to={to}
      $variant={variant}
      $size={size}
      $fullWidth={fullWidth}
      disabled={disabled || loading}
      type={type}
      onClick={onClick}
      {...props}
    >
      {loading ? <Spinner size="sm" color="currentColor" /> : children}
    </StyledButton>
  )
}
