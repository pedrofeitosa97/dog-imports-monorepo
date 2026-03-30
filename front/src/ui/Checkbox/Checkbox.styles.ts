import styled from 'styled-components'

export const Wrapper = styled.label<{ disabled?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing[2]};
  cursor: ${({ disabled }) => (disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ disabled }) => (disabled ? 0.5 : 1)};
`

export const HiddenInput = styled.input`
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
`

export const CustomBox = styled.span<{ checked?: boolean }>`
  width: 18px;
  height: 18px;
  border: 1.5px solid ${({ theme, checked }) => checked ? theme.colors.brand : theme.colors.border};
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  background: ${({ theme, checked }) => checked ? theme.colors.brand : theme.colors.background};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  transition: all ${({ theme }) => theme.transitions.fast};
`

export const CheckLabel = styled.span`
  font-size: ${({ theme }) => theme.typography.size.sm};
  color: ${({ theme }) => theme.colors.textPrimary};
  user-select: none;
`
