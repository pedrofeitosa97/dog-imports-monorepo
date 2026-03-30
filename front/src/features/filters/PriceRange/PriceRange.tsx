import { Wrapper, Label, RangeRow, RangeInput, ValuesRow } from './PriceRange.styles'
import { formatCurrency } from '../../../utils/formatCurrency'

interface PriceRangeProps {
  min?: number
  max?: number
  valueMin?: number
  valueMax?: number
  onChange: (range: [number, number]) => void
}

export default function PriceRange({ min = 0, max = 9999, valueMin, valueMax, onChange }: PriceRangeProps) {
  return (
    <Wrapper>
      <Label>Faixa de preço</Label>
      <ValuesRow>
        <span>{formatCurrency(valueMin ?? min)}</span>
        <span>{formatCurrency(valueMax ?? max)}</span>
      </ValuesRow>
      <RangeRow>
        <RangeInput
          type="range"
          min={min}
          max={max}
          value={valueMin ?? min}
          onChange={(e) => onChange([Number(e.target.value), valueMax ?? max])}
        />
        <RangeInput
          type="range"
          min={min}
          max={max}
          value={valueMax ?? max}
          onChange={(e) => onChange([valueMin ?? min, Number(e.target.value)])}
        />
      </RangeRow>
    </Wrapper>
  )
}
