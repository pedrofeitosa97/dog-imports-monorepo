import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { AccordionWrapper, AccordionHeader, AccordionTitle, ChevronWrapper, AccordionBody } from './Accordion.styles'

export default function Accordion({ title, children, defaultOpen = false }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <AccordionWrapper>
      <AccordionHeader onClick={() => setIsOpen((v) => !v)}>
        <AccordionTitle>{title}</AccordionTitle>
        <ChevronWrapper isOpen={isOpen}>
          <ChevronDown size={18} />
        </ChevronWrapper>
      </AccordionHeader>
      <AccordionBody isOpen={isOpen}>{children}</AccordionBody>
    </AccordionWrapper>
  )
}
