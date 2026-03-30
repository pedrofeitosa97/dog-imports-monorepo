import { createPortal } from 'react-dom'
import styled, { keyframes, css } from 'styled-components'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import type { ToastItem, ToastVariant } from '../../contexts/toast.context'

const slideIn = keyframes`
  from { opacity: 0; transform: translateX(24px); }
  to   { opacity: 1; transform: translateX(0); }
`

const Container = styled.div`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 9999;
  display: flex;
  flex-direction: column;
  gap: 10px;
  pointer-events: none;

  @media (max-width: 480px) {
    bottom: 16px;
    right: 12px;
    left: 12px;
  }
`

const variantStyles: Record<ToastVariant, ReturnType<typeof css>> = {
  success: css`border-color: rgba(52,211,153,0.3); background: rgba(52,211,153,0.1);`,
  error:   css`border-color: rgba(255,68,58,0.35);  background: rgba(255,68,58,0.1);`,
  warning: css`border-color: rgba(251,191,36,0.3);  background: rgba(251,191,36,0.08);`,
  info:    css`border-color: rgba(96,165,250,0.3);  background: rgba(96,165,250,0.08);`,
}

const iconColors: Record<ToastVariant, string> = {
  success: '#34d399',
  error:   '#ff453a',
  warning: '#fbbf24',
  info:    '#60a5fa',
}

const Pill = styled.div<{ $variant: ToastVariant }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 12px;
  border: 1px solid;
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  min-width: 260px;
  max-width: 380px;
  pointer-events: all;
  animation: ${slideIn} 0.25s cubic-bezier(.22,.68,0,1.1) both;
  font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', 'Inter', sans-serif;
  ${({ $variant }) => variantStyles[$variant]}

  @media (max-width: 480px) {
    min-width: 0;
    width: 100%;
    max-width: 100%;
  }
`

const IconWrap = styled.span<{ $variant: ToastVariant }>`
  flex-shrink: 0;
  display: flex;
  color: ${({ $variant }) => iconColors[$variant]};
`

const Msg = styled.p`
  flex: 1;
  font-size: 13.5px;
  font-weight: 500;
  color: #f5f5f7;
  letter-spacing: -0.1px;
`

const CloseBtn = styled.button`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: rgba(235,235,245,0.35);
  cursor: pointer;
  padding: 2px;
  border-radius: 4px;
  transition: color 120ms;
  &:hover { color: #f5f5f7; }
`

const icons: Record<ToastVariant, React.ReactElement> = {
  success: <CheckCircle size={17} />,
  error:   <AlertCircle size={17} />,
  warning: <AlertTriangle size={17} />,
  info:    <Info size={17} />,
}

interface Props {
  toasts: ToastItem[]
  onDismiss: (id: string) => void
}

export default function ToastContainer({ toasts, onDismiss }: Props) {
  if (!toasts.length) return null

  return createPortal(
    <Container>
      {toasts.map((t) => (
        <Pill key={t.id} $variant={t.variant}>
          <IconWrap $variant={t.variant}>{icons[t.variant]}</IconWrap>
          <Msg>{t.message}</Msg>
          <CloseBtn onClick={() => onDismiss(t.id)}><X size={14} /></CloseBtn>
        </Pill>
      ))}
    </Container>,
    document.body
  )
}
