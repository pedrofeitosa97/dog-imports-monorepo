import { type ReactNode } from 'react'
import Accordion from '../../../ui/Accordion/Accordion'
import Checkbox from '../../../ui/Checkbox/Checkbox'
import { OptionsList } from './FilterAccordion.styles'

interface FilterOption {
  value: string
  label: string
}

interface FilterAccordionProps {
  title: string
  children?: ReactNode
  options?: FilterOption[]
  selected?: string[]
  onToggle?: (value: string) => void
  defaultOpen?: boolean
}

export default function FilterAccordion({
  title,
  children,
  options = [],
  selected = [],
  onToggle,
  defaultOpen = false,
}: FilterAccordionProps) {
  return (
    <Accordion title={title} defaultOpen={defaultOpen}>
      {children ?? (
        <OptionsList>
          {options.map((opt) => (
            <li key={opt.value}>
              <Checkbox
                label={opt.label}
                checked={selected.includes(opt.value)}
                onChange={() => onToggle?.(opt.value)}
              />
            </li>
          ))}
        </OptionsList>
      )}
    </Accordion>
  )
}
