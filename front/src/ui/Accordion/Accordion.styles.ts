import styled from 'styled-components'

export const AccordionWrapper = styled.div`
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`

export const AccordionHeader = styled.button`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${({ theme }) => `${theme.spacing[4]} 0`};
  background: none;
  border: none;
  cursor: pointer;
  text-align: left;
`

export const AccordionTitle = styled.span`
  font-size: ${({ theme }) => theme.typography.size.base};
  font-weight: ${({ theme }) => theme.typography.weight.medium};
  color: ${({ theme }) => theme.colors.textPrimary};
`

export const ChevronWrapper = styled.span<{ $isOpen: boolean }>`
  color: ${({ theme }) => theme.colors.textSecondary};
  transition: transform ${({ theme }) => theme.transitions.fast};
  transform: ${({ $isOpen }) => ($isOpen ? 'rotate(180deg)' : 'rotate(0)')};
  display: flex;
`

export const AccordionBody = styled.div<{ $isOpen: boolean }>`
  display: ${({ $isOpen }) => ($isOpen ? 'block' : 'none')};
  padding-bottom: ${({ theme }) => theme.spacing[4]};
`
