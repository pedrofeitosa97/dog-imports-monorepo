import { Wrapper, Label, SizesGrid, SizeOption } from './SizeSelector.styles'

interface SizeItem {
  label: string
  available?: boolean
}

interface SizeSelectorProps {
  sizes?: SizeItem[]
  selected?: string
  onChange: (label: string) => void
}

export default function SizeSelector({ sizes = [], selected, onChange }: SizeSelectorProps) {
  return (
    <Wrapper>
      <Label>Tamanho</Label>
      <SizesGrid>
        {sizes.map(({ label, available }) => (
          <SizeOption
            key={label}
            selected={selected === label}
            available={available}
            onClick={() => available && onChange(label)}
            disabled={!available}
            type="button"
          >
            {label}
          </SizeOption>
        ))}
      </SizesGrid>
    </Wrapper>
  )
}
