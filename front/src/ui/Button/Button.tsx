import { type ReactNode, type ButtonHTMLAttributes } from 'react'
import { StyledButton } from './Button.styles'
import Spinner from '../Spinner/Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children?: ReactNode
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
  fullWidth?: boolean
  as?: React.ElementType
  to?: string
  href?: string
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  fullWidth = false,
  type = 'button',
  onClick,
  as: asElement,
  to,
  ...props
}: ButtonProps) {
  return (
    <StyledButton
      as={asElement}
      {...(to ? { to } : {})}
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
