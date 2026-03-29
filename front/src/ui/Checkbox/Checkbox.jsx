import { Wrapper, HiddenInput, CustomBox, CheckLabel } from './Checkbox.styles'
import { Check } from 'lucide-react'

export default function Checkbox({ checked, onChange, label, disabled = false, id }) {
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
      {label && <CheckLabel htmlFor={inputId}>{label}</CheckLabel>}
    </Wrapper>
  )
}
