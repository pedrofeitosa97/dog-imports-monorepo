import styled from 'styled-components'

const Track = styled.button<{ $on?: boolean }>`
  position: relative;
  width: 36px;
  height: 20px;
  border-radius: 999px;
  background: ${({ $on }) => $on ? '#f97316' : 'rgba(255,255,255,0.14)'};
  flex-shrink: 0;
  cursor: pointer;
  transition: background 180ms ease;
`

const Thumb = styled.span<{ $on?: boolean }>`
  position: absolute;
  top: 3px;
  left: ${({ $on }) => $on ? '19px' : '3px'};
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background: #fff;
  transition: left 180ms ease;
  pointer-events: none;
`

interface ToggleProps {
  checked: boolean
  onChange: (next: boolean) => void
  disabled?: boolean
}

export default function Toggle({ checked, onChange, disabled }: ToggleProps) {
  return (
    <Track
      $on={checked}
      onClick={() => !disabled && onChange(!checked)}
      aria-pressed={checked}
      role="switch"
      type="button"
    >
      <Thumb $on={checked} />
    </Track>
  )
}
