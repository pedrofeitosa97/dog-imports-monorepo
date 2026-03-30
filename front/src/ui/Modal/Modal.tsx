import { useEffect, type ReactNode } from 'react'
import { X } from 'lucide-react'
import { Overlay, Dialog, ModalHeader, ModalTitle, CloseButton, ModalBody } from './Modal.styles'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'fullscreen'
}

export default function Modal({ isOpen, onClose, title, children, size = 'md' }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return (
    <Overlay onClick={onClose}>
      <Dialog size={size} onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          {title && <ModalTitle>{title}</ModalTitle>}
          <CloseButton onClick={onClose}>
            <X size={20} />
          </CloseButton>
        </ModalHeader>
        <ModalBody>{children}</ModalBody>
      </Dialog>
    </Overlay>
  )
}
