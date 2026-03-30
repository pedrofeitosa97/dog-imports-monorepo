import styled from 'styled-components'

type ModalSize = 'sm' | 'md' | 'lg' | 'fullscreen'

const sizeMap: Record<ModalSize, string> = {
  sm: '420px',
  md: '580px',
  lg: '820px',
  fullscreen: '100vw',
}

export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.65);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: ${({ theme }) => theme.zIndex.modal};
  padding: 16px;
`

export const Dialog = styled.div<{ size?: ModalSize }>`
  background: #1c1c1f;
  border: 1px solid rgba(255,255,255,0.08);
  border-radius: 16px;
  box-shadow: 0 24px 60px rgba(0,0,0,0.5);
  width: 100%;
  max-width: ${({ size = 'md' }) => sizeMap[size]};
  max-height: 90vh;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`

export const ModalHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 18px 20px;
  border-bottom: 1px solid rgba(255,255,255,0.07);
`

export const ModalTitle = styled.h3`
  font-size: 15px;
  font-weight: 600;
  color: #f5f5f7;
`

export const CloseButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 6px;
  color: rgba(255,255,255,0.4);
  cursor: pointer;
  transition: all 150ms;

  &:hover {
    background: rgba(255,255,255,0.08);
    color: #f5f5f7;
  }
`

export const ModalBody = styled.div`
  padding: 20px;
  overflow-y: auto;
  flex: 1;
  color: rgba(255,255,255,0.75);
`
