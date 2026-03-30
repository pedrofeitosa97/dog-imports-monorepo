import styled from 'styled-components'
import { useSiteSettings } from '../../../hooks/useSiteSettings'

const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || '5511999999999'

const Btn = styled.a`
  position: fixed;
  bottom: 24px;
  right: 24px;
  z-index: 1000;
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: #25d366;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 16px rgba(37, 211, 102, 0.45);
  transition: transform 160ms ease, box-shadow 160ms ease;
  text-decoration: none;

  &:hover {
    transform: scale(1.08);
    box-shadow: 0 6px 20px rgba(37, 211, 102, 0.6);
  }

  @media (max-width: 480px) {
    bottom: 18px;
    right: 16px;
    width: 50px;
    height: 50px;
  }
`

const Tooltip = styled.span`
  position: absolute;
  right: calc(100% + 10px);
  white-space: nowrap;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 12px;
  padding: 5px 10px;
  border-radius: 6px;
  opacity: 0;
  pointer-events: none;
  transition: opacity 160ms ease;

  ${Btn}:hover & {
    opacity: 1;
  }

  @media (max-width: 640px) { display: none; }
`

// WhatsApp SVG icon
function WhatsAppIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="#fff">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
      <path d="M12 0C5.373 0 0 5.373 0 12c0 2.117.549 4.103 1.508 5.828L.057 23.4a.5.5 0 0 0 .609.61l5.65-1.482A11.938 11.938 0 0 0 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.8 9.8 0 0 1-5.003-1.365l-.358-.213-3.713.974.991-3.622-.234-.373A9.79 9.79 0 0 1 2.182 12C2.182 6.57 6.57 2.182 12 2.182S21.818 6.57 21.818 12 17.43 21.818 12 21.818z" />
    </svg>
  )
}

export default function WhatsAppButton() {
  const { settings } = useSiteSettings()
  const number = settings.whatsapp_number || WHATSAPP_NUMBER
  const href = `https://wa.me/${number.replace(/\D/g, '')}`

  return (
    <Btn href={href} target="_blank" rel="noopener noreferrer" aria-label="Fale conosco no WhatsApp">
      <Tooltip>Fale conosco</Tooltip>
      <WhatsAppIcon />
    </Btn>
  )
}
