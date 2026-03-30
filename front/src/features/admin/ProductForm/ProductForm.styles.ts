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

/* ── Size Manager ─────────────────────────────────────────────────────────── */

export const PresetGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const PresetGroupLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: rgba(255,255,255,0.3);
  letter-spacing: 0.5px;
  text-transform: uppercase;
`

export const PresetChips = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

export const PresetChip = styled.button<{ $added?: boolean }>`
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 120ms;
  background: ${({ $added }) => $added ? 'rgba(37,99,235,0.25)' : INPUT_BG};
  color: ${({ $added }) => $added ? '#60a5fa' : MUTED};
  border: 1px solid ${({ $added }) => $added ? 'rgba(37,99,235,0.4)' : BORDER};
  &:hover { background: rgba(255,255,255,0.1); color: ${TEXT}; }
`

export const SizeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const SizeRow = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(255,255,255,0.03);
  border: 1px solid ${BORDER};
  border-radius: 10px;
  flex-wrap: wrap;
`

export const SizeBadge = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${TEXT};
  min-width: 36px;
`

export const SizeStockInput = styled.input`
  width: 72px;
  height: 32px;
  padding: 0 8px;
  background: ${INPUT_BG};
  border: 1px solid ${BORDER};
  border-radius: 7px;
  font-size: 13px;
  font-family: 'Manrope', sans-serif;
  color: ${TEXT};
  outline: none;
  text-align: center;
  &:focus { border-color: rgba(255,255,255,0.25); }
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button { -webkit-appearance: none; }
`

export const SizeAvailToggle = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: ${MUTED};
  cursor: pointer;
  flex: 1;
  min-width: 100px;

  input[type="checkbox"] {
    width: 14px;
    height: 14px;
    accent-color: #2563eb;
    cursor: pointer;
  }
`

export const SizeRemoveBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 6px;
  color: rgba(255,100,100,0.6);
  cursor: pointer;
  transition: all 120ms;
  margin-left: auto;
  &:hover { background: rgba(255,80,80,0.12); color: #ff6b6b; }
`

export const AddCustomRow = styled.div`
  display: flex;
  gap: 8px;
  align-items: center;
`

export const AddCustomInput = styled.input`
  height: 36px;
  width: 100px;
  padding: 0 10px;
  background: ${INPUT_BG};
  border: 1px solid ${BORDER};
  border-radius: 8px;
  font-size: 13px;
  font-family: 'Manrope', sans-serif;
  color: ${TEXT};
  outline: none;
  &:focus { border-color: rgba(255,255,255,0.25); }
  &::placeholder { color: ${MUTED}; }
`

export const StockSummary = styled.p`
  font-size: 12px;
  color: rgba(235,235,245,0.35);
  margin-top: 4px;
`
