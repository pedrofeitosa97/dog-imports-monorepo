import Accordion from '../../../ui/Accordion/Accordion'
import Checkbox from '../../../ui/Checkbox/Checkbox'
import { OptionsList } from './FilterAccordion.styles'

export default function FilterAccordion({ title, options = [], selected = [], onToggle, defaultOpen = false }) {
  return (
    <Accordion title={title} defaultOpen={defaultOpen}>
      <OptionsList>
        {options.map((opt) => (
          <li key={opt.value}>
            <Checkbox
              label={opt.label}
              checked={selected.includes(opt.value)}
              onChange={() => onToggle(opt.value)}
            />
          </li>
        ))}
      </OptionsList>
    </Accordion>
  )
}
