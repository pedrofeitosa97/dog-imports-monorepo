import { Wrapper, Label, SizesGrid, SizeOption } from './SizeSelector.styles'

export default function SizeSelector({ sizes = [], selected, onChange }) {
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
