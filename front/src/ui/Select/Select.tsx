import { type ChangeEvent } from 'react'
import { Wrapper, Label, SelectWrapper, StyledSelect, ChevronIcon, HelperText } from './Select.styles'
import { ChevronDown } from 'lucide-react'

interface SelectOption {
  value: string | number
  label: string
}

interface SelectProps {
  label?: string
  options?: SelectOption[]
  value?: string | number
  onChange?: (e: ChangeEvent<HTMLSelectElement>) => void
  placeholder?: string
  disabled?: boolean
  error?: string
  fullWidth?: boolean
  dark?: boolean
  id?: string
}

export default function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Selecione...',
  disabled = false,
  error,
  fullWidth = false,
  dark = false,
  id,
}: SelectProps) {
  const selectId = id || label?.toLowerCase().replace(/\s+/g, '-')
  return (
    <Wrapper $fullWidth={fullWidth}>
      {label && <Label htmlFor={selectId} $dark={dark}>{label}</Label>}
      <SelectWrapper $hasError={!!error} disabled={disabled} $dark={dark}>
        <StyledSelect id={selectId} value={value} onChange={onChange} disabled={disabled} $dark={dark}>
          <option value="">{placeholder}</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </StyledSelect>
        <ChevronIcon $dark={dark}>
          <ChevronDown size={16} />
        </ChevronIcon>
      </SelectWrapper>
      {error && <HelperText>{error}</HelperText>}
    </Wrapper>
  )
}
