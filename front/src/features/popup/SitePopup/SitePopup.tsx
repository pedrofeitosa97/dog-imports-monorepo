import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import styled, { keyframes } from 'styled-components'
import { popupService } from '../../../services/popupService'
import { getImageUrl } from '../../../utils/getImageUrl'
import type { Popup } from '../../../types/api'

const fadeIn = keyframes`
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to   { opacity: 1; transform: scale(1) translateY(0); }
`

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.55);
  backdrop-filter: blur(4px);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
`

const Card = styled.div`
  position: relative;
  background: ${({ theme }) => theme.colors.card};
  border-radius: ${({ theme }) => theme.borderRadius.md};
  overflow: hidden;
  max-width: 440px;
  width: 100%;
  box-shadow: ${({ theme }) => theme.shadows.xl};
  animation: ${fadeIn} 280ms cubic-bezier(.4,0,.2,1);
`

const CloseBtn = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(6px);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 140ms;
  z-index: 2;

  &:hover { background: rgba(0,0,0,0.6); }
`

const ImageArea = styled.div`
  width: 100%;
  aspect-ratio: 16/7;
  overflow: hidden;
  background: ${({ theme }) => theme.colors.surface};

  img { width: 100%; height: 100%; object-fit: cover; }
`

const Body = styled.div`
  padding: 24px 24px 28px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const PopupTitle = styled.h2`
  font-size: 18px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: ${({ theme }) => theme.colors.textPrimary};
`

const PopupSub = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  line-height: 1.6;
`

const CtaBtn = styled.a`
  display: inline-block;
  margin-top: 8px;
  padding: 11px 24px;
  background: ${({ theme }) => theme.colors.brand};
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  border-radius: ${({ theme }) => theme.borderRadius.sm};
  text-decoration: none;
  transition: opacity 140ms;
  align-self: flex-start;

  &:hover { opacity: 0.88; }
`

const STORAGE_KEY = 'popup_dismissed_until'

export default function SitePopup() {
  const [popup, setPopup] = useState<Popup | null>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const dismissedUntil = localStorage.getItem(STORAGE_KEY)
    if (dismissedUntil && Date.now() < Number(dismissedUntil)) return

    popupService.getActive()
      .then((data) => {
        if (!data) return
        const delay = (data.delaySeconds ?? 3) * 1000
        setPopup(data)
        setTimeout(() => setVisible(true), delay)
      })
      .catch(() => {})
  }, [])

  const dismiss = () => {
    if (!popup) return
    const cooldown = (popup.cooldownHours ?? 24) * 3600 * 1000
    localStorage.setItem(STORAGE_KEY, String(Date.now() + cooldown))
    setVisible(false)
  }

  if (!visible || !popup) return null

  const img = getImageUrl(popup.imageUrl ?? '')

  return (
    <Overlay onClick={dismiss}>
      <Card onClick={(e) => e.stopPropagation()}>
        <CloseBtn onClick={dismiss} aria-label="Fechar"><X size={16} /></CloseBtn>

        {img && (
          <ImageArea>
            <img src={img} alt={popup.title} />
          </ImageArea>
        )}

        <Body>
          <PopupTitle>{popup.title}</PopupTitle>
          {popup.subtitle && <PopupSub>{popup.subtitle}</PopupSub>}
          {popup.cta && popup.ctaUrl && (
            <CtaBtn href={popup.ctaUrl} onClick={dismiss}>{popup.cta}</CtaBtn>
          )}
        </Body>
      </Card>
    </Overlay>
  )
}
