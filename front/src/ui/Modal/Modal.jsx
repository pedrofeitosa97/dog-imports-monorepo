import { useEffect } from 'react'
import { X } from 'lucide-react'
import { Overlay, Dialog, ModalHeader, ModalTitle, CloseButton, ModalBody } from './Modal.styles'

export default function Modal({ isOpen, onClose, title, children, size = 'md' }) {
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
