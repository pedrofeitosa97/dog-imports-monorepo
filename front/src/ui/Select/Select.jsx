import { Wrapper, Label, SelectWrapper, StyledSelect, ChevronIcon, HelperText } from './Select.styles'
import { ChevronDown } from 'lucide-react'

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
}) {
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
