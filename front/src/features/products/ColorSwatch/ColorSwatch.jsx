import { Wrapper, Label, SwatchList, Swatch } from './ColorSwatch.styles'

export default function ColorSwatch({ colors = [], selected, onChange }) {
  return (
    <Wrapper>
      <Label>Cor: <strong>{selected || 'Selecione'}</strong></Label>
      <SwatchList>
        {colors.map(({ name, hex, available }) => (
          <Swatch
            key={name}
            title={name}
            hex={hex}
            selected={selected === name}
            available={available}
            onClick={() => available && onChange(name)}
            disabled={!available}
            type="button"
          />
        ))}
      </SwatchList>
    </Wrapper>
  )
}
