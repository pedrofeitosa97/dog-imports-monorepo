import { useEffect } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import { ToastWrapper, ToastIcon, ToastMessage, ToastClose } from './Toast.styles'

const icons = {
  success: <CheckCircle size={20} />,
  error: <AlertCircle size={20} />,
  warning: <AlertTriangle size={20} />,
  info: <Info size={20} />,
}

export default function Toast({ message, variant = 'info', duration = 4000, onDismiss }) {
  useEffect(() => {
    if (!duration) return
    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [duration, onDismiss])

  return (
    <ToastWrapper variant={variant}>
      <ToastIcon variant={variant}>{icons[variant]}</ToastIcon>
      <ToastMessage>{message}</ToastMessage>
      <ToastClose onClick={onDismiss}>
        <X size={16} />
      </ToastClose>
    </ToastWrapper>
  )
}
