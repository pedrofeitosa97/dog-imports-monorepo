import { type ChangeEvent } from 'react'
import { Wrapper, HiddenInput, CustomBox, CheckLabel } from './Checkbox.styles'
import { Check } from 'lucide-react'

interface CheckboxProps {
  checked: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  label?: string
  disabled?: boolean
  id?: string
}

export default function Checkbox({ checked, onChange, label, disabled = false, id }: CheckboxProps) {
  const inputId = id || `checkbox-${label}`
  return (
    <Wrapper disabled={disabled}>
      <HiddenInput
        type="checkbox"
        id={inputId}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <CustomBox checked={checked}>
        {checked && <Check size={12} strokeWidth={3} color="#fff" />}
      </CustomBox>
      {label && <CheckLabel>{label}</CheckLabel>}
    </Wrapper>
  )
}
