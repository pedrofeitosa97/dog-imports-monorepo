import styled from 'styled-components'

const BORDER   = 'rgba(255,255,255,0.07)'
const TEXT     = '#f5f5f7'
const MUTED    = 'rgba(255,255,255,0.45)'
const INPUT_BG = 'rgba(255,255,255,0.05)'

export const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 860px;
`

export const FormSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px;
  background: #141416;
  border: 1px solid ${BORDER};
  border-radius: 14px;

  @media (max-width: 640px) {
    padding: 16px;
    border-radius: 12px;
  }

  label {
    color: ${TEXT};
  }

  input, select, textarea {
    color: ${TEXT} !important;
    background: ${INPUT_BG} !important;
    border-color: ${BORDER} !important;
    &::placeholder { color: ${MUTED}; }
    option { background: #141416; color: ${TEXT}; }
  }
`

export const SectionTitle = styled.h3`
  font-size: 13px;
  font-weight: 600;
  color: ${MUTED};
  text-transform: uppercase;
  letter-spacing: 0.08em;
  padding-bottom: 12px;
  border-bottom: 1px solid ${BORDER};
`

export const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

export const FormLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: ${TEXT};
`

export const TextArea = styled.textarea`
  width: 100%;
  padding: 12px 14px;
  border: 1px solid ${BORDER};
  border-radius: 8px;
  background: ${INPUT_BG};
  font-family: 'Manrope', sans-serif;
  font-size: 14px;
  color: ${TEXT};
  resize: vertical;
  outline: none;
  min-height: 90px;
  transition: border-color 150ms;

  &::placeholder { color: ${MUTED}; }
  &:focus { border-color: rgba(255,255,255,0.25); }
`

export const ToggleRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  input[type="checkbox"] {
    width: 16px;
    height: 16px;
    accent-color: #2563eb;
    cursor: pointer;
    flex-shrink: 0;
  }
`

export const ToggleLabel = styled.label`
  font-size: 14px;
  color: ${TEXT};
  cursor: pointer;
`

export const ActionsRow = styled.div`
  display: flex;
  justify-content: flex-end;
  padding-top: 4px;
`
