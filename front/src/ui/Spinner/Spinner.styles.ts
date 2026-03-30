import styled, { keyframes } from 'styled-components'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

type SpinnerSize = 'sm' | 'md' | 'lg'

const sizeMap: Record<SpinnerSize, string> = {
  sm: '16px',
  md: '24px',
  lg: '40px',
}

export const SpinnerRing = styled.span<{ size?: SpinnerSize; color?: string }>`
  display: inline-block;
  width: ${({ size = 'md' }) => sizeMap[size]};
  height: ${({ size = 'md' }) => sizeMap[size]};
  border: 2px solid transparent;
  border-top-color: ${({ color, theme }) => color || theme.colors.brand};
  border-right-color: ${({ color, theme }) => color || theme.colors.brand};
  border-radius: 50%;
  animation: ${spin} 0.6s linear infinite;
  flex-shrink: 0;
`
