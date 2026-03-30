import { SpinnerRing } from './Spinner.styles'

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  color?: string
}

export default function Spinner({ size = 'md', color }: SpinnerProps) {
  return <SpinnerRing size={size} color={color} />
}
