import { useState, type ReactNode } from 'react'
import { ChevronDown } from 'lucide-react'
import { AccordionWrapper, AccordionHeader, AccordionTitle, ChevronWrapper, AccordionBody } from './Accordion.styles'

interface AccordionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

export default function Accordion({ title, children, defaultOpen = false }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <AccordionWrapper>
      <AccordionHeader onClick={() => setIsOpen((v) => !v)}>
        <AccordionTitle>{title}</AccordionTitle>
        <ChevronWrapper $isOpen={isOpen}>
          <ChevronDown size={18} />
        </ChevronWrapper>
      </AccordionHeader>
      <AccordionBody $isOpen={isOpen}>{children}</AccordionBody>
    </AccordionWrapper>
  )
}
