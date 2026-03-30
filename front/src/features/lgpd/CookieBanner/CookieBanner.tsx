import { useState } from 'react'
import styled from 'styled-components'

const STORAGE_KEY = 'cookie_consent_accepted'

const Banner = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 999;
  background: ${({ theme }) => theme.mode === 'dark' ? 'rgba(18,18,20,0.97)' : 'rgba(255,255,255,0.97)'};
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  backdrop-filter: blur(12px);
  padding: 14px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;

  @media (max-width: 480px) {
    padding: 12px 16px;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
  }
`

const Text = styled.p`
  font-size: 13px;
  color: ${({ theme }) => theme.colors.textSecondary};
  margin: 0;
  flex: 1;
  min-width: 0;
`

const AcceptBtn = styled.button`
  flex-shrink: 0;
  padding: 9px 20px;
  background: ${({ theme }) => theme.colors.brand};
  color: #fff;
  border-radius: ${({ theme }) => theme.borderRadius.base};
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 140ms ease;
  white-space: nowrap;

  &:hover { opacity: 0.85; }
`

export default function CookieBanner() {
  const [visible, setVisible] = useState(() => !localStorage.getItem(STORAGE_KEY))

  if (!visible) return null

  const accept = () => {
    localStorage.setItem(STORAGE_KEY, 'true')
    setVisible(false)
  }

  return (
    <Banner>
      <Text>
        Usamos cookies para melhorar sua experiência de navegação. Ao continuar, você concorda com nossa{' '}
        <strong>Política de Privacidade</strong>.
      </Text>
      <AcceptBtn onClick={accept}>Aceitar e continuar</AcceptBtn>
    </Banner>
  )
}
