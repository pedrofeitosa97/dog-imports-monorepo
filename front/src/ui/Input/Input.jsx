import { Wrapper, Label, StyledInput, HelperText, Prefix, Suffix, InputRow } from './Input.styles'

export default function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  helperText,
  prefix,
  suffix,
  disabled = false,
  fullWidth = false,
  dark = false,
  placeholder,
  id,
  ...props
}) {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

  return (
    <Wrapper $fullWidth={fullWidth}>
      {label && <Label htmlFor={inputId} $dark={dark}>{label}</Label>}
      <InputRow $hasError={!!error} disabled={disabled} $dark={dark}>
        {prefix && <Prefix>{prefix}</Prefix>}
        <StyledInput
          id={inputId}
          type={type}
          value={value}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          $dark={dark}
          {...props}
        />
        {suffix && <Suffix>{suffix}</Suffix>}
      </InputRow>
      {(helperText || error) && (
        <HelperText $hasError={!!error}>{error || helperText}</HelperText>
      )}
    </Wrapper>
  )
}
